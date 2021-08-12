<?php

namespace app\api\v1\controllers;


use app\models\Profile;
use Yii;
use yii\caching\TagDependency;
use yii\web\Response;

class ProfileController extends AllApiController {

    public $modelClass = Profile::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['view']);

        return $actions;
    }

    public function actionView ($id): Response {
        $profile =  Yii::$app->cache->getOrSet('profile_' . $id, function () use ($id) {
            return Profile::find()->where(['user_id' => $id])->asArray()->one();
        }, Yii::$app->params['cacheDuration'], new TagDependency(['tags' => 'profile_' . $id]));

        return $this->asJson($profile);
    }

    public function actionCurrency (): Response {
        $currency =  Yii::$app->cache->getOrSet('currency', function () {
            return file_get_contents('https://www.cbr-xml-daily.ru/daily_json.js');
        }, 86400);

        return $this->asJson(json_decode($currency));
    }

}
