<?php

namespace app\api\v1\controllers;


use app\models\Bill;
use app\models\Event;
use Yii;
use yii\caching\TagDependency;
use yii\web\HttpException;
use yii\web\Response;

class EventController extends AllApiController {

    public $modelClass = Event::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update'], $actions['delete']);

        return $actions;
    }

    public function actionIndex(): Response {
        $filter = Yii::$app->getRequest()->getQueryParams();

        $query = Event::find()->joinWith('category')->joinWith('bill')->where([Event::tableName()
            . '.user_id' => $filter['user_id']])->andWhere(['between', Event::tableName() . '.date', $filter['dataFrom'],
            $filter['dataTo']]);

        if ($filter['bills']) {
            $query->andWhere([Event::tableName() . '.bill_id' => $filter['bills']]);
        }

        if ($filter['categories']) {
            $query->andWhere([Event::tableName() . '.category_id' => $filter['categories']]);
        }

        if ($filter['currencies']) {
            $arrCur = '';

            $last = count($filter['currencies']);
            foreach ($filter['currencies'] as $key => $currency) {
                $arrCur .= Event::tableName() . '.currency = ' . '"' . $currency . '"';

                if ($key != $last - 1) {
                    $arrCur .= ' OR ';
                }
            }
            $query->andWhere($arrCur);
        }

        if ($filter['types']) {
            $query->andWhere(['type' => $filter['types']]);
        }

        $events = $query->orderBy([Event::tableName() . '.date' => SORT_DESC])->asArray()->all();

        return $this->asJson(['events' => $events]);
    }

    /**
     * @return Response
     * @throws \yii\base\InvalidConfigException|HttpException
     */
    public function actionCreate(): Response {
        $model = new Event();

        $event = Yii::$app->getRequest()->getBodyParams();
        $transaction = Yii::$app->db->beginTransaction();
        try {
            $model->user_id = $event['user_id'];
            $model->bill_id = $event['bill_id'];
            $model->category_id = $event['category_id'];
            $model->currency = $event['currency'];
            $model->type = Event::TYPE_ARRAY[$event['type']];
            $model->amount = $event['amount'];
            $model->convertAmount = $event['convertAmount'];
            $model->date = $event['date'];
            $model->description = $event['description'];
            if ($model->validate() && $model->save()) {
                $bill = Bill::findOne(['id' => $event['bill_id']]);

                if ($event['type'] == 'income') {
                    $bill->balance += $event['convertAmount'];
                } else {
                    $bill->balance -= $event['convertAmount'];
                }

                if ($bill->validate() && $bill->save()) {
                    TagDependency::invalidate(Yii::$app->cache, 'profile_' . $event['user_id']);

                    $transaction->commit();
                    return $this->asJson($model);
                } else {
                    $transaction->rollBack();

                    throw new HttpException(422, $bill->errors);
                }
            }

            throw new HttpException(422, $model->errors);
        } catch (\Throwable $e) {
            $transaction->rollBack();

            throw new HttpException($e->getCode(), 'server.errors.unknownError');
        }
    }

     /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id): Response {
        $event = Event::findOne(['id' => $id]);

        $updateEvent = Yii::$app->getRequest()->getBodyParams();
        try {
            $event->category_id = $updateEvent['category_id'];
            $event->description = $updateEvent['description'];
            if ($event->validate() && $event->save()) {
                return $this->asJson($event);
            }

            throw new HttpException(422, $event->errors);
        } catch (\Throwable $e) {
            throw new HttpException($e->getCode(), 'server.errors.unknownError');
        }
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     */
    public function actionDelete($id): Response {
        $event = Event::findOne(['id' => $id]);

        $transaction = Yii::$app->db->beginTransaction();
        try {
            $bill = Bill::findOne(['id' => $event['bill_id']]);

            if ($event['type'] == 'income') {
                $bill->balance -= $event['convertAmount'];
            } else {
                $bill->balance += $event['convertAmount'];
            }

            if ($bill->validate() && $bill->save()) {
                $eventDeleteElement = $event;
                if ($event->delete() > 0) {
                    TagDependency::invalidate(Yii::$app->cache, 'profile_' . $event['user_id']);

                    $transaction->commit();

                    Yii::$app->getResponse()->setStatusCode(204);
                    return $this->asJson($eventDeleteElement);
                }
            } else {
                $transaction->rollBack();

                throw new HttpException(422, $bill->errors);
            }
        } catch (\Throwable $e) {
            $transaction->rollBack();

            throw new HttpException($e->getCode(), 'server.errors.unknownError');
        }
    }
}
