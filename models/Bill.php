<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%bills}}".
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property float|null $balance
 * @property string $currency
 *
 * @property User $user
 */
class Bill extends ActiveRecord {

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
            [['user_id'], 'required'],
            [['user_id'], 'integer'],
            [['name', 'currency'], 'string'],
            [['balance'], 'number'],
            [['balance'], 'default', 'value' => 0],
            [['currency'], 'default', 'value' => Currency::DEFAULT_CURRENCY['RUB']['CharCode']],
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
            'name' => 'Name',
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

    /**
     * Gets query for [[User]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getIsEvent(): \yii\db\ActiveQuery {
        return $this->hasMany(Event::class, ['bill_id' => 'id']);
    }
}
