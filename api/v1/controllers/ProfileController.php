<?php

namespace app\api\v1\controllers;


use app\models\Bill;
use Yii;
use yii\caching\TagDependency;
use yii\web\HttpException;
use yii\web\Response;

class ProfileController extends AllApiController {

    public $modelClass = Bill::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['create'], $actions['update'], $actions['view'], $actions['delete']);

        return $actions;
    }

    /**
     * @return Response
     *
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate (): Response {
        $new_data_bill = Yii::$app->getRequest()->getBodyParams();
        $count = Bill::find()->where(['user_id' => $new_data_bill['user_id']])->count();

        $newBill = new Bill();
        $newBill->user_id = $new_data_bill['user_id'];
        $newBill->name = $new_data_bill['name'] != '' ? $new_data_bill['name'] : '#' . ((int)$count + 1);
        $newBill->balance = $new_data_bill['balance'];
        $newBill->currency = Bill::CURRENCY_ARRAY[$new_data_bill['currency']];

        if ($newBill->validate() && $newBill->save()) {
            TagDependency::invalidate(Yii::$app->cache, 'profile_' . $newBill->user_id);

            return $this->asJson($newBill);
        } else {
            return $this->asJson($newBill->errors);
        }
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate ($id): Response {
        $bill = Yii::$app->getRequest()->getBodyParams();

        $editBill = Bill::findOne($id);
        $editBill->name = $bill['name'];
        if ($editBill->validate() && $editBill->save()) {
            TagDependency::invalidate(Yii::$app->cache, 'profile_' . $editBill->user_id);

            return $this->asJson($editBill);
        }

        throw new HttpException(400, 'server.errors.unknownError');
    }

    /**
     * @param $id
     *
     * @return Response
     */
    public function actionView ($id): Response {
        $profile = Yii::$app->cache->getOrSet('profile_' . $id, function () use ($id) {
            return Bill::find()->where(['user_id' => $id])->asArray()->all();
        }, Yii::$app->params['cacheDuration'], new TagDependency(['tags' => 'profile_' . $id]));

        return $this->asJson($profile);
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionDelete ($id): Response {
        $deleteBill = Bill::findOne($id);
        $user_id = $deleteBill->user_id;
        if ($deleteBill->delete()) {
            TagDependency::invalidate(Yii::$app->cache, 'profile_' . $user_id);

            return $this->asJson(true);
        }

        throw new HttpException(400, 'server.errors.unknownError');
    }

    /**
     * @return Response
     */
    public function actionCurrency (): Response {
        $currency = Yii::$app->cache->getOrSet('currency', function () {
            return file_get_contents('https://www.cbr-xml-daily.ru/daily_json.js');
        }, 86400);

        return $this->asJson(json_decode($currency));
    }

}
