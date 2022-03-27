<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';
$config_api = require '../api/config_api.php';

$config = [
    'id' => 'homeBookkeeping_1',
    'name' => 'My Api HomeBookkeeping server',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'language' => 'ru_RU',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
        '@api' => '@app/api'
    ],
    'on beforeRequest' => function ($event) {
        \yii\helpers\Inflector::$transliterator = 'Russian-Latin/BGN; Any-Latin; Latin-ASCII; NFD; [:Nonspacing Mark:] Remove; NFC; [:Punctuation:] Remove; Lower();';
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
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\PhpMessageSource',
                    'basePath' => '@app/messages',
                    'sourceLanguage' => 'en_US',
                ],
            ],
        ],
        'formatter' => [
            'class' => 'yii\i18n\Formatter',
            'locale' => 'ru_RU',
            'dateFormat' => 'dd.MM.yyyy',
            'decimalSeparator' => ',',
            'thousandSeparator' => ' ',
            'currencyCode' => 'RUB',
            'defaultTimeZone' => 'UTC',
            'timeZone' => 'Asia/Yekaterinburg'
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
            'useFileTransport' => false,
            'viewPath' => '@app/mail',
            'htmlLayout' => 'layouts/main-html',
            'textLayout' => 'layouts/main-text',
            'messageConfig' => [
                'charset' => 'UTF-8',
                'from' => ['info@bookkeeping.ru' => 'Home Bookkeeping'],
            ],
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
                    'logFile' => '@runtime/logs/api_' . date('d-m-Y') . '.log',
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
                    'api/v1/event', 'api/v1/planning-event', 'api/v1/currency', 'api/v1/notification'],
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
                    'tokens' => [
                        '{id}' => '<id:\\w+>',
                        '{base}' => '<id:\\w+>'
                    ],
                    'extraPatterns' => [
                        'POST registration' => 'registration',
                        'POST login' => 'login',
                        'POST forgot-password' => 'forgot-password',
                        'GET currency' => 'currency',
                        'POST user-exists' => 'user-exists',
                        'GET all-currency' => 'all-currency',
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
