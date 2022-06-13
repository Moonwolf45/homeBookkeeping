<?php


use yii\queue\LogBehavior;
use yii\queue\redis\Queue;
use yii\redis\Connection;

$params = require __DIR__ . '/params.php';

$db = array_merge(
    require __DIR__ . '/db.php',
    require __DIR__ . '/db-local.php'
);


$config = [
    'id' => 'basic-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => [
        'log',
        'queue'
    ],
    'controllerNamespace' => 'app\commands',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
        '@tests' => '@app/tests',
    ],
    'components' => [
        'redis' => [
            'class' => Connection::class,
            'hostname' => '127.0.0.1',
            'port' => 6379
        ],
        'queue' => [
            'class' => Queue::class,
            'as log' => LogBehavior::class,
            'redis' => 'redis',
            'channel' => 'queue'
        ],
        'cache' => [
            'class' => 'yii\caching\MemCache',
            'useMemcached' => true,
            'servers' => [
                [
                    'host' => '127.0.0.1',
                    'port' => 11211,
                    'weight' => 256
                ]
            ]
        ],
        'log' => [
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ], [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning', 'info', 'profile'],
                    'categories' => ['cron'],
                    'logFile' => '@runtime/logs/cron_' . date('d-m-Y') . '.log',
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning', 'info'],
                    'categories' => ['job'],
                    'logFile' => '@runtime/logs/jobs_' . date('d-m-Y') . '.log',
                ],
            ],
        ],
        'db' => $db,
    ],
    'params' => $params,
    'controllerMap' => [
        'fixture' => [
            'class' => 'yii\faker\FixtureController',
        ],
    ],
];

if (YII_ENV_DEV) {
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
