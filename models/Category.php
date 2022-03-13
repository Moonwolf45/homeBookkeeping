<?php

namespace app\models;


use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%categories}}".
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $color
 *
 * @property User $user
 * @property Event[] $events
 * @property PlanningEvent[] $planningEvents
 */
class Category extends ActiveRecord {

    const DEFAULT_CATEGORY = [
        ['title' => 'category.food', 'color' => '#34215e'],
        ['title' => 'category.debts_loans', 'color' => '#9eebf1'],
        ['title' => 'category.auto', 'color' => '#2c65ff'],
        ['title' => 'category.business_projects', 'color' => '#2e4b70'],
        ['title' => 'category.household_appliances', 'color' => '#fff714'],
        ['title' => 'category.mortgage', 'color' => '#1f3422'],
        ['title' => 'category.mc_i_t', 'color' => '#5592ce'],
        ['title' => 'category.communal_payments', 'color' => '#279e93'],
        ['title' => 'category.health_beauty', 'color' => '#e184c6'],
        ['title' => 'category.financial_operations', 'color' => '#3dfeef'],
        ['title' => 'category.cafes_restaurants', 'color' => '#9a110a'],
        ['title' => 'category.h_a_c', 'color' => '#36349a'],
        ['title' => 'category.medicine_pharmacy', 'color' => '#6cbb66'],
        ['title' => 'category.pets', 'color' => '#91153e'],
        ['title' => 'category.education', 'color' => '#baa0a0'],
        ['title' => 'category.public_transport', 'color' => '#b0aa5e'],
        ['title' => 'category.clothes_footwear', 'color' => '#37732d'],
        ['title' => 'category.vacation_travel', 'color' => '#b08bb4'],
        ['title' => 'category.multimedia', 'color' => '#ec12f1'],
        ['title' => 'category.hypermarket', 'color' => '#8da251'],
        ['title' => 'category.e_c', 'color' => '#55335e'],
        ['title' => 'category.family_children', 'color' => '#ffb0b0'],
        ['title' => 'category.construction_repair', 'color' => '#6a3535'],
        ['title' => 'category.hobbies_interests', 'color' => '#ff8000'],
        ['title' => 'category.f_t_c', 'color' => '#fe4747'],
        ['title' => 'category.other', 'color' => '#6c6c6c'],
        ['title' => 'category.charity', 'color' => '#ffb997'],
        ['title' => 'category.other_expenses', 'color' => '#646464'],
        ['title' => 'category.cash_withdrawal', 'color' => '#c0c0c0'],
        ['title' => 'category.t_f_c_t_c', 'color' => '#0056f2']
    ];

    /**
     * {@inheritdoc}
     */
    public static function tableName (): string {
        return '{{%categories}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules (): array {
        return [
            [['user_id', 'title', 'color'], 'required'],
            [['user_id'], 'integer'],
            [['title', 'color'], 'string', 'max' => 255],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::class,
                'targetAttribute' => ['user_id' => 'id']],
            ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels (): array {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'title' => 'Title',
            'color' => 'Color',
        ];
    }

    /**
     * Gets query for [[User]].
     *
     * @return ActiveQuery
     */
    public function getUser (): ActiveQuery {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    /**
     * Gets query for [[Events]].
     *
     * @return ActiveQuery
     */
    public function getEvents (): ActiveQuery {
        return $this->hasMany(Event::class, ['category_id' => 'id']);
    }

    /**
     * Gets query for [[PlanningEvents]].
     *
     * @return ActiveQuery
     */
    public function getPlanningEvents (): ActiveQuery {
        return $this->hasMany(PlanningEvent::class, ['category_id' => 'id']);
    }
}
