<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%bills}}".
 *
 * @property int $id
 * @property int $user_id
 * @property float|null $balance
 * @property int $currency
 *
 * @property User $user
 */
class Bill extends ActiveRecord {

    const CURRENCY_RUB = 1;
    const CURRENCY_USD = 2;
    const CURRENCY_EUR = 3;

    const CURRENCY_ARRAY = [
        'rub' => self::CURRENCY_RUB,
        'usd' => self::CURRENCY_USD,
        'eur' => self::CURRENCY_EUR
    ];

    /**
     * {@inheritdoc}
     */
    public static function tableName(): string {
        return '{{%bills}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules(): array {
        return [
            [['user_id', 'currency'], 'required'],
            [['user_id', 'currency'], 'integer'],
            [['balance'], 'number'],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels(): array {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'balance' => 'Balance Rub',
            'currency' => 'Currency',
        ];
    }

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getUser(): \yii\db\ActiveQuery {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}
