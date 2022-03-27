<?php

return [
    'request' => [
        'class' => 'yii\web\Request',
        'enableCsrfValidation' => false,
        'enableCsrfCookie' => false
    ],
    'response' => [
        'class' => 'yii\web\Response',
        'on beforeSend' => function ($event) {
            $response = $event->sender;
            if ($response->data !== null) {
                $response->data = [
                    'success' => $response->isSuccessful,
                    'data' => $response->data,
                ];
                $response->statusCode = 200;
            }
        },
        'formatters' => [
            \yii\web\Response::FORMAT_JSON => [
                'class' => 'yii\web\JsonResponseFormatter',
                'prettyPrint' => YII_DEBUG,
                'encodeOptions' => JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
            ]
        ],
        'format' => yii\web\Response::FORMAT_JSON,
    ],
    'errorHandler' => [
        'class' => 'yii\web\ErrorHandler',
        'errorAction' => null
    ],
    'user' => [
        'class' => 'yii\web\User',
        'identityClass' => 'app\models\User',
        'enableSession' => false,
        'enableAutoLogin' => false
    ]
];
