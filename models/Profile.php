<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%profiles}}".
 *
 * @property int $id
 * @property int $user_id
 * @property float|null $balanceRUB
 * @property float|null $balanceUSD
 * @property float|null $balanceEUR
 *
 * @property User $user
 */
class Profile extends ActiveRecord {
    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return '{{%profiles}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['balanceRUB', 'balanceUSD', 'balanceEUR'], 'number'],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'balanceRUB' => 'Balance Rub',
            'balanceUSD' => 'Balance Usd',
            'balanceEUR' => 'Balance Eur',
        ];
    }

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser() {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}
