<?php

namespace app\models;

use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%planning_events}}".
 *
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int $bill_id
 * @property string $currency
 * @property int $type
 * @property float $amount
 * @property int $date
 * @property string|null $description
 * @property int $status
 * @property int $event_id
 *
 * @property Category $category
 * @property Bill $bill
 * @property User $user
 * @property Event $event
 */
class PlanningEvent extends ActiveRecord {

    const STATUS_ON = 1;
    const STATUS_OFF = 0;

    /**
     * {@inheritdoc}
     */
    public static function tableName(): string {
        return '{{%planning_events}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules(): array {
        return [
            [['user_id', 'category_id', 'bill_id', 'amount', 'date'], 'required'],
            [['user_id', 'category_id', 'bill_id', 'type', 'date', 'view', 'status'], 'integer'],
            [['amount'], 'number'],
            [['description', 'currency'], 'string'],
            [['currency'], 'default', 'value' => Currency::DEFAULT_CURRENCY['RUB']['CharCode']],
            [['status'], 'default', 'value' => self::STATUS_ON],
            [['bill_id'], 'exist', 'skipOnError' => true, 'targetClass' => Bill::class,
                'targetAttribute' => ['bill_id' => 'id']],
            [['category_id'], 'exist', 'skipOnError' => true, 'targetClass' => Category::class,
                'targetAttribute' => ['category_id' => 'id']],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id']],
            [['event_id'], 'exist', 'skipOnError' => true, 'targetClass' => Event::class,
                'targetAttribute' => ['event_id' => 'id']],
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
            'date' => 'Date',
            'description' => 'Description',
            'status' => 'Status',
            'event_id' => 'Event ID',
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

    /**
     * Gets query for [[Event]].
     *
     * @return ActiveQuery
     */
    public function getEvent(): ActiveQuery {
        return $this->hasOne(Event::class, ['id' => 'event_id']);
    }
}
