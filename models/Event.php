<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%events}}".
 *
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int $currency
 * @property int $type
 * @property float $amount
 * @property int $date
 * @property string|null $description
 *
 * @property Category $category
 * @property User $user
 */
class Event extends ActiveRecord {

    const CURRENCY_RUB = 1;
    const CURRENCY_USD = 2;
    const CURRENCY_EUR = 3;

    const TYPE_INCOME = 1;
    const TYPE_OUTCOME = 2;

    const CURRENCY_ARRAY = [
        'rub' => self::CURRENCY_RUB,
        'usd' => self::CURRENCY_USD,
        'eur' => self::CURRENCY_EUR
    ];

    const TYPE_ARRAY = [
        'income' => self::TYPE_INCOME,
        'outcome' => self::TYPE_OUTCOME
    ];

    /**
     * {@inheritdoc}
     */
    public static function tableName(): string {
        return '{{%events}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules(): array {
        return [
            [['user_id', 'category_id', 'amount', 'date'], 'required'],
            [['user_id', 'category_id', 'currency', 'type', 'date'], 'integer'],
            [['amount'], 'number'],
            [['description'], 'safe'],
            [['category_id'], 'exist', 'skipOnError' => true, 'targetClass' => Category::class,
                'targetAttribute' => ['category_id' => 'id']],
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
            'category_id' => 'Category ID',
            'currency' => 'Currency',
            'type' => 'Type',
            'amount' => 'Amount',
            'date' => 'Date',
            'description' => 'Description',
        ];
    }

    /**
     * Gets query for [[Category]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getCategory(): \yii\db\ActiveQuery {
        return $this->hasOne(Category::class, ['id' => 'category_id']);
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
