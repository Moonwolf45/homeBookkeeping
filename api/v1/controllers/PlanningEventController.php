<?php

namespace app\api\v1\controllers;


use app\models\Event;
use app\models\PlanningEvent;
use Yii;
use yii\web\HttpException;
use yii\web\Response;

class PlanningEventController extends AllApiController {

    public $modelClass = PlanningEvent::class;

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

        $query = PlanningEvent::find()->joinWith('category')->joinWith('bill')->where([PlanningEvent::tableName()
        . '.user_id' => $filter['user_id']]);

        $activePlanningEvents = $query->andWhere([PlanningEvent::tableName() . '.status' => PlanningEvent::STATUS_ON])
            ->orderBy([PlanningEvent::tableName() . '.date' => SORT_ASC])->asArray()->all();
        $noneActivePlanningEvents = $query->andWhere([PlanningEvent::tableName() . '.status' => PlanningEvent::STATUS_OFF])
            ->orderBy([PlanningEvent::tableName() . '.date' => SORT_ASC])->asArray()->all();

        $arrActivePlanningEvents = [];
        $arrNoneActivePlanningEvents = [];

        $arrNewKeyActivePlanningEvents = [];
        $arrNewKeyNoneActivePlanningEvents = [];

        if (!empty($activePlanningEvents)) {
            foreach ($activePlanningEvents as $active_e) {
                $strDate = strtotime($active_e['date']);

                $arrActivePlanningEvents[date('d.m.Y', $strDate)]['id'] = md5(date('dmY', $strDate));
                $arrActivePlanningEvents[date('d.m.Y', $strDate)]['name'] = date('d.m.Y', $strDate);
                $arrActivePlanningEvents[date('d.m.Y', $strDate)]['children'][] = $active_e;
            }

            foreach ($arrActivePlanningEvents as $active_e) {
                $arrNewKeyActivePlanningEvents[] = $active_e;
            }
        }

        if (!empty($noneActivePlanningEvents)) {
            foreach ($noneActivePlanningEvents as $noneActive_e) {
                $strDate = strtotime($noneActive_e['date']);

                $arrNoneActivePlanningEvents[date('d.m.Y', $strDate)]['id'] = md5(date('dmY', $strDate));
                $arrNoneActivePlanningEvents[date('d.m.Y', $strDate)]['name'] = date('d.m.Y', $strDate);
                $arrNoneActivePlanningEvents[date('d.m.Y', $strDate)]['children'][] = $noneActive_e;
            }

            foreach ($arrNoneActivePlanningEvents as $noneActive_e) {
                $arrNewKeyNoneActivePlanningEvents[] = $noneActive_e;
            }
        }

        return $this->asJson(['activePlanningEvents' => $arrNewKeyActivePlanningEvents,
            'noneActivePlanningEvents' => $arrNewKeyNoneActivePlanningEvents]);
    }

    /**
     * @return Response
     * @throws \yii\base\InvalidConfigException|HttpException
     */
    public function actionCreate(): Response {
        $model = new PlanningEvent();

        $planningEvent = Yii::$app->getRequest()->getBodyParams();
        $transaction = Yii::$app->db->beginTransaction();
        try {
            $model->user_id = $planningEvent['user_id'];
            $model->bill_id = $planningEvent['bill_id'];
            $model->category_id = $planningEvent['category_id'];
            $model->currency = $planningEvent['currency'];
            $model->type = Event::TYPE_ARRAY[$planningEvent['type']];
            $model->amount = $planningEvent['amount'];
            $model->date = $planningEvent['date'];
            $model->description = $planningEvent['description'];
            $model->status = $planningEvent['status'];

            if ($model->validate() && $model->save()) {
                $transaction->commit();

                return $this->asJson($model);
            }

            $transaction->rollBack();

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(422, $model->errors);
        } catch (\Throwable $e) {
            $transaction->rollBack();

            Yii::$app->response->format = Response::FORMAT_JSON;
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
        $planningEvent = PlanningEvent::findOne(['id' => $id]);

        $updatePlanningEvent = Yii::$app->getRequest()->getBodyParams();
        $transaction = Yii::$app->db->beginTransaction();
        try {
            $planningEvent->user_id = $updatePlanningEvent['user_id'];
            $planningEvent->bill_id = $updatePlanningEvent['bill_id'];
            $planningEvent->category_id = $updatePlanningEvent['category_id'];
            $planningEvent->currency = $updatePlanningEvent['currency'];
            $planningEvent->type = Event::TYPE_ARRAY[$updatePlanningEvent['type']];
            $planningEvent->amount = $updatePlanningEvent['amount'];
            $planningEvent->date = $updatePlanningEvent['date'];
            $planningEvent->description = $updatePlanningEvent['description'];
            $planningEvent->status = $updatePlanningEvent['status'];
            if ($planningEvent->validate() && $planningEvent->save()) {
                $transaction->commit();

                return $this->asJson($planningEvent);
            }

            $transaction->rollBack();

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(422, $planningEvent->errors);
        } catch (\Throwable $e) {
            $transaction->rollBack();

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException($e->getCode(), 'server.errors.unknownError');
        }
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     * @throws \Throwable
     * @throws \yii\db\StaleObjectException
     */
    public function actionDelete($id): Response {
        $planningEvent = PlanningEvent::findOne(['id' => $id]);

        $modelPlaningEvent = $planningEvent;
        if ($planningEvent->delete() > 0) {
            Yii::$app->getResponse()->setStatusCode(204);

            return $this->asJson($modelPlaningEvent);
        } else {
            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(501, 'server.errors.unknownError');
        }
    }
}
