<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%planning_events}}".
 *
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int $currency
 * @property int $type
 * @property float $amount
 * @property int $date
 * @property string|null $description
 * @property int $view
 * @property int $status
 *
 * @property Category $category
 * @property User $user
 */
class PlanningEvent extends ActiveRecord {

    const STATUS_ON = 1;
    const STATUS_OFF = 0;

    const VIEW_ON = 1;
    const VIEW_OFF = 0;

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
            [['user_id', 'category_id', 'amount', 'date'], 'required'],
            [['user_id', 'category_id', 'currency', 'type', 'date', 'view', 'status'], 'integer'],
            [['amount'], 'number'],
            [['description'], 'string'],
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
            'status' => 'Status',
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
