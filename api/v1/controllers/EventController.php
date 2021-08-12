<?php

namespace app\api\v1\controllers;


use app\models\Event;
use app\models\Profile;
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
        unset($actions['index'], $actions['create']);

        return $actions;
    }

    public function actionIndex(): Response {
        $income = [];
        $outcome = [];

        $filter = Yii::$app->getRequest()->getQueryParams();

        $query = Event::find()->joinWith('category')->where([Event::tableName() . '.user_id' => $filter['user_id']])
            ->andWhere(['between', Event::tableName() . '.date', $filter['dataFrom'], $filter['dataTo']]);
        if ($filter['categories'] != 'all') {

        }

        if ($filter['type'] != 'all') {

        }
        $events = $query->orderBy([Event::tableName() . '.date' => SORT_DESC])->asArray()->all();

        foreach ($events as $event) {
            if ($event['type'] == Event::TYPE_INCOME) {
                $income[$event['category_id']]['label'] = $event['category']['title'];
                $income[$event['category_id']]['color'] = $event['category']['color'];
                $income[$event['category_id']]['total'] += $event['amount'];
            } else if ($event['type'] == Event::TYPE_OUTCOME) {
                $outcome[$event['category_id']]['label'] = $event['category']['title'];
                $outcome[$event['category_id']]['color'] = $event['category']['color'];
                $outcome[$event['category_id']]['total'] += $event['amount'];
            }
        }

        return $this->asJson(['events' => $events, 'income' => $income, 'outcome' => $outcome]);
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
            $model->category_id = $event['category_id'];
            $model->currency = Event::CURRENCY_ARRAY[$event['currency']];
            $model->type = Event::TYPE_ARRAY[$event['type']];
            $model->amount = $event['amount'];
            $model->date = $event['date'];
            $model->description = $event['description'];
            if ($model->validate() && $model->save()) {
                $profile = Profile::find()->where(['user_id' => $event['user_id']])->one();
                switch ($event['currency']) {
                    case 'rub':
                        if ($event['type'] == 'income') {
                            $profile['balanceRUB'] += $event['amount'];
                        } else {
                            $profile['balanceRUB'] -= $event['amount'];
                        }
                    break;

                    case 'usd':
                        if ($event['type'] == 'income') {
                          $profile['balanceUSD'] += $event['amount'];
                        } else {
                          $profile['balanceUSD'] -= $event['amount'];
                        }
                    break;

                    case 'eur':
                        if ($event['type'] == 'income') {
                            $profile['balanceEUR'] += $event['amount'];
                        } else {
                            $profile['balanceEUR'] -= $event['amount'];
                        }
                    break;
                }
                $profile->save();
                TagDependency::invalidate(Yii::$app->cache, 'profile_' . $event['user_id']);

                $transaction->commit();
                return $this->asJson($model);
            }

            throw new HttpException(422, $model->errors);
        } catch (\Throwable $e) {
            $transaction->rollBack();

            throw new HttpException($e->getCode(), 'server.errors.unknownError');
        }
    }

}
