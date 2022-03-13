<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%events}}".
 *
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int $bill_id
 * @property string $currency
 * @property int $type
 * @property float $amount
 * @property float $convertAmount
 * @property int $date
 * @property string|null $description
 *
 * @property Category $category
 * @property User $user
 */
class Event extends ActiveRecord {

    const TYPE_INCOME = 1;
    const TYPE_OUTCOME = 2;

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
            [['user_id', 'category_id', 'bill_id', 'amount', 'date'], 'required'],
            [['user_id', 'category_id', 'bill_id', 'type', 'date'], 'integer'],
            [['amount', 'convertAmount'], 'number'],
            [['description', 'currency'], 'string'],
            [['currency'], 'default', 'value' => Currency::DEFAULT_CURRENCY['RUB']['CharCode']],
            [['bill_id'], 'exist', 'skipOnError' => true, 'targetClass' => Bill::class,
                'targetAttribute' => ['bill_id' => 'id']],
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
            'bill_id' => 'Bill ID',
            'currency' => 'Currency',
            'type' => 'Type',
            'amount' => 'Amount',
            'convertAmount' => 'Convert Amount',
            'date' => 'Date',
            'description' => 'Description',
        ];
    }

    /**
     * Gets query for [[Bill]].
     *
     * @return ActiveQuery
     */
    public function getBill(): ActiveQuery {
        return $this->hasOne(Bill::class, ['id' => 'bill_id']);
    }

    /**
     * Gets query for [[Category]].
     *
     * @return ActiveQuery
     */
    public function getCategory(): ActiveQuery {
        return $this->hasOne(Category::class, ['id' => 'category_id']);
    }

    /**
     * Gets query for [[User]].
     *
     * @return ActiveQuery
     */
    public function getUser(): ActiveQuery {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}
