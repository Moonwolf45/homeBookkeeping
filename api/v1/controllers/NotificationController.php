<?php

namespace app\api\v1\controllers;


use app\models\TokenUser;
use Yii;
use yii\web\HttpException;
use yii\web\Response;

class NotificationController extends AllApiController {

    public $modelClass = TokenUser::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['create'], $actions['update'], $actions['view'], $actions['delete']);

        return $actions;
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException|\yii\base\InvalidConfigException
     */
    public function actionCreate (): Response {
        $tokenBlock = Yii::$app->getRequest()->getBodyParams();

        $newNotificationToken = new TokenUser();
        $newNotificationToken->user_id = $tokenBlock['user_id'];
        $newNotificationToken->token = $tokenBlock['token'];

        if ($newNotificationToken->validate() && $newNotificationToken->save()) {
            return $this->asJson($newNotificationToken);
        } else {
            return $this->asJson($newNotificationToken->errors);
        }
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate ($id): Response {
        $newTokenBlock = Yii::$app->getRequest()->getBodyParams();

        $editNotificationToken = TokenUser::findOne(['id' => $id]);
        $editNotificationToken->token = $newTokenBlock['token'];

        if ($editNotificationToken->validate() && $editNotificationToken->save()) {
            return $this->asJson($editNotificationToken);
        } else {
            return $this->asJson($editNotificationToken->errors);
        }
    }
}
