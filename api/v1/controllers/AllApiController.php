<?php

namespace app\api\v1\controllers;


use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\ContentNegotiator;
use yii\filters\Cors;
use yii\rest\ActiveController;
use yii\rest\Serializer;
use yii\web\Response;

class AllApiController extends ActiveController {

    public $serializer = [
        'class' => Serializer::class,
        'collectionEnvelope' => 'items',
    ];

    /**
     * @return array|array[]
     */
    public function behaviors(): array {
        $behaviors = parent::behaviors();

        if (isset($behaviors['contentNegotiator']['formats']['application/xml'])) {
            unset($behaviors['contentNegotiator']['formats']['application/xml']);
        }

        $behaviors['contentNegotiator'] = [
            'class' => ContentNegotiator::class,
            'formats' => [
                'application/json' => Response::FORMAT_JSON,
            ],
            'languages' => ['ru-RU', 'en-US']
        ];

        if (YII_ENV_DEV) {
            $behaviors['corsFilter'] = [
                'class' => Cors::class,
                'cors'  => [
                    'Origin' => [Yii::$app->params['domain_dev']],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                    'Access-Control-Allow-Credentials' => true,
                    'Access-Control-Max-Age' => 86400,
                    'Access-Control-Expose-Headers' => []
                ]
            ];
        }

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => ['options']
        ];

        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();

        $actions['options'] = ['class' => 'yii\rest\OptionsAction'];

        return $actions;
    }

}
