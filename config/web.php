<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';
$config_api = require __DIR__ . '/../api/config_api.php';

$config = [
    'id' => 'homeBookkeeping_1',
    'name' => 'My Api HomeBookkeeping server',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'language' => 'ru-RU',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
        '@api' => '@app/api'
    ],
    'on beforeRequest' => function ($event) {
        \yii\helpers\Inflector::$transliterator = 'Russian-Latin/BGN; Any-Latin; Latin-ASCII; NFD; [:Nonspacing Mark:] Remove; NFC;';
    },
    'modules' => [
        'api' => [
            'basePath' => '@api',
            'class' => 'app\api\ApiModule',
            'modules' => [
                'v1' => [
                    'basePath' => '@api/v1',
                    'class' => 'app\api\v1\V1Module',
                ]
            ],
            'components' => $config_api
        ]
    ],
    'components' => [
        'formatter' => [
            'class' => 'yii\i18n\Formatter',
            'locale' => 'ru_RU',
            'dateFormat' => 'dd.MM.yyyy',
            'decimalSeparator' => ',',
            'thousandSeparator' => ' ',
            'currencyCode' => 'RUB',
        ],
        'request' => [
            'cookieValidationKey' => 'd49ipDXNBI0afLqoza9dkfYng6bPycKB',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser'
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning', 'info'],
                    'categories' => ['api'],
                    'logFile' => '@app/runtime/logs/api.log',
                ],
            ],
        ],
        'db' => $db,
        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                ['class' => 'yii\rest\UrlRule', 'controller' => ['api/v1/user', 'api/v1/profile', 'api/v1/category',
                    'api/v1/event'],
                    'patterns' => [
                        'PUT,PATCH {id}' => 'update',
                        'DELETE {id}' => 'delete',
                        'GET,HEAD {id}' => 'view',
                        'POST' => 'create',
                        'GET,HEAD' => 'index',
                        '{id}' => 'options',
                        '' => 'options',
                        'OPTIONS <id:\d+>/<action:[\w-]+>' => 'options',
                        'OPTIONS <action:[\w-]+>' => 'options'
                    ],
                    'extraPatterns' => [
                        'POST registration' => 'registration',
                        'POST login' => 'login',
                        'GET currency' => 'currency',
                    ]
                ],

                '/' => 'site/index',
            ]
        ]
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
