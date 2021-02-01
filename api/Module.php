<?php

namespace app\api;

use Yii;
use yii\web\JsonResponseFormatter;
use yii\web\Response;
use yii\base\Module as AppModule;

/**
 * api module definition class
 */
class Module extends AppModule {

    /**
     * {@inheritdoc}
     */
    public function init() {
        parent::init();

        Yii::$app->user->enableSession = false;
        Yii::$app->user->enableAutoLogin = false;
        Yii::$app->response['formatters'] = [
            Response::FORMAT_JSON => [
                'class' => JsonResponseFormatter::class,
                'prettyPrint' => YII_DEBUG,
                'encodeOptions' => JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
            ],
        ];
        Yii::$app->request['parsers'] = [
            'application/json' => 'yii\web\JsonParser',
        ];
    }
}
