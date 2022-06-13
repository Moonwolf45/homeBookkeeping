<?php

namespace app\jobs;

use app\models\PlanningEvent;
use Yii;
use yii\base\BaseObject;
use yii\base\InvalidConfigException;
use yii\httpclient\Exception;
use yii\queue\JobInterface;
use yii\httpclient\Client;

class NotificationJob extends BaseObject implements JobInterface {

    public array $dataArrayTokensDevice;
    public array $dataArrayNotification;


//[
//'title' => 'Firebase',
//'body' => 'Firebase is awesome',
//'click_action' => 'https://homebookkeeping.ru/planning',
//'icon' => 'http://url-to-an-icon/icon.png'
//]
    /**
     * @throws Exception
     * @throws InvalidConfigException
     * @throws \yii\db\Exception
     */
    public function execute ($queue) {
        $client = new Client();

        Yii::info('Очередь, запланированная транзакция: ' .  $this->dataArrayNotification['id'], 'job');

        $transaction = Yii::$app->db->beginTransaction();

        $planningEvent = PlanningEvent::findOne(['id' => $this->dataArrayNotification['id']]);
        $planningEvent->status = PlanningEvent::STATUS_PERFORMED;
        if ($planningEvent->save()) {
            Yii::info('$planningEvent: ' . $planningEvent->id . ' Поставлен статус: '
                . PlanningEvent::STATUS_PERFORMED, 'job');

            $transaction->commit();
        } else {
            Yii::info('$planningEvent: ' . $planningEvent->id . ' Какая-то ошибка при сохранении.', 'job');

            $transaction->rollback();
        }

        $response = $client->createRequest()->setMethod('post')->setHeaders([
            'Authorization' => sprintf('key=%s', Yii::$app->params['apiFCMKey']),
            'Content-Type' => 'application/json'])
            ->setUrl('https://fcm.googleapis.com/fcm/send')
            ->setData([
                'registration_ids' => $this->dataArrayTokensDevice,
                'notification' => $this->dataArrayNotification
            ])->send();

        if ($response->isOk) {
            $planningEvent->status = PlanningEvent::STATUS_DONE;
            if ($planningEvent->save()) {
                Yii::info('$planningEvent: ' . $planningEvent->id . ' Поставлен статус: '
                    . PlanningEvent::STATUS_DONE, 'job');

                $transaction->commit();
            } else {
                Yii::info('$planningEvent: ' . $planningEvent->id . ' Какая-то ошибка при сохранении.', 'job');

                $transaction->rollback();
            }

            Yii::info('Запланированная транзакция: ' . print_r($this->dataArrayNotification, true), 'job');
        }
        Yii::info('Ответ: ' . $response, 'job');
    }
}
