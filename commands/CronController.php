<?php

namespace app\commands;


use app\jobs\NotificationJob;
use app\models\PlanningEvent;
use app\models\User;
use DateTime;
use DateTimeZone;
use Yii;
use yii\console\Controller;

class CronController extends Controller {

    /**
     * @return void
     *
     * @throws \Exception
     */
    public function actionIndex() {
        Yii::beginProfile('executePlanningEvents', 'cron');

        $nowTimeDefault = new DateTime('now', new DateTimeZone('Europe/London'));
        Yii::info('Текущие UTC время: ' . $nowTimeDefault->format('Y-m-d H:i:s'), 'cron');

        $allUsers = User::find()->joinWith(['planningEvent', 'notificationToken'])
            ->where([PlanningEvent::tableName() . '.status' => PlanningEvent::STATUS_IS_WAITING,
                PlanningEvent::tableName() . '.active' => PlanningEvent::ACTIVE_ON])->all();

        if (!empty($allUsers)) {
            foreach ($allUsers as $user) {
                $nowTime = $nowTimeDefault->setTimezone(new DateTimeZone($user->timeZone))->format('Y-m-d H:i');

                if (!empty($user->planningEvent) && !empty($user->notificationToken)) {
                    $allToDevice = [];
                    foreach ($user->notificationToke as $token) {
                        $allToDevice[] = $token->token;
                    }

                    foreach ($user->planningEvent as $planningEvent) {
                        if ($planningEvent->date == $nowTime) {
                            Yii::$app->queue->push(new NotificationJob([
                                'dataArrayTokensDevice' => $allToDevice,
                                'dataArrayNotification' => $planningEvent
                            ]));

                            Yii::info('Отправлено $planningEvent: ' . $planningEvent->id . ' в очередь. Время: '
                                . $nowTimeDefault->format('Y-m-d H:i:s'), 'cron');
                        }
                    }

                    Yii::$app->queue->run();
                }
            }
        }

        Yii::endProfile('executePlanningEvents', 'cron');
    }
}
