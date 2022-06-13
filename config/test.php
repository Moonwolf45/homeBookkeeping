<?php
$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/test_db.php';

/**
 * Application configuration shared by all test types
 */
return [
    'id' => 'basic-tests',
    'basePath' => dirname(__DIR__),
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'language' => 'en-US',
    'components' => [
        'db' => $db,
        'mailer' => [
            'useFileTransport' => true,
        ],
        'assetManager' => [
            'basePath' => __DIR__ . '/../web/assets',
        ],
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
                        'PATCH update-language/{id}' => 'update-language',
                        'GET all-currency' => 'all-currency',
                    ]
                ],
            ]
        ],
        'user' => [
            'identityClass' => 'app\models\User',
        ],
        'request' => [
            'cookieValidationKey' => 'test',
            'enableCsrfValidation' => false,
            // but if you absolutely need it set cookie domain to localhost
            /*
            'csrfCookie' => [
                'domain' => 'localhost',
            ],
            */
        ],
    ],
    'params' => $params,
];
