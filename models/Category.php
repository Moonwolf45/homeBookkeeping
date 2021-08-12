<?php

namespace app\models;


use Yii;
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
        ['title' => 'Питание', 'color' => '#34215e'],
        ['title' => 'Долги, кредиты', 'color' => '#9eebf1'],
        ['title' => 'Автотранспорт', 'color' => '#2c65ff'],
        ['title' => 'Бизнес, проекты', 'color' => '#2e4b70'],
        ['title' => 'Бытовая техника', 'color' => '#fff714'],
        ['title' => 'Ипотека', 'color' => '#1f3422'],
        ['title' => 'Мобильная связь, интернет, ТВ', 'color' => '#5592ce'],
        ['title' => 'Коммунальные платежи', 'color' => '#279e93'],
        ['title' => 'Красота и здоровье', 'color' => '#e184c6'],
        ['title' => 'Финансовые операции', 'color' => '#3dfeef'],
        ['title' => 'Кафе и рестораны', 'color' => '#9a110a'],
        ['title' => 'Дом, квартира, дача', 'color' => '#36349a'],
        ['title' => 'Медицина, аптека', 'color' => '#6cbb66'],
        ['title' => 'Домашние животные', 'color' => '#91153e'],
        ['title' => 'Образование', 'color' => '#baa0a0'],
        ['title' => 'Общественный транспорт', 'color' => '#b0aa5e'],
        ['title' => 'Одежда и обувь', 'color' => '#37732d'],
        ['title' => 'Отпуск, путешествия', 'color' => '#b08bb4'],
        ['title' => 'Мультимедия', 'color' => '#ec12f1'],
        ['title' => 'Гипермаркет', 'color' => '#8da251'],
        ['title' => 'Развлечения и праздники', 'color' => '#55335e'],
        ['title' => 'Семья и дети', 'color' => '#ffb0b0'],
        ['title' => 'Строительство и ремонт', 'color' => '#6a3535'],
        ['title' => 'Хобби и увлечения', 'color' => '#ff8000'],
        ['title' => 'Штрафы, налоги, комиссии', 'color' => '#fe4747'],
        ['title' => 'Другое', 'color' => '#6c6c6c'],
        ['title' => 'Благотворительность', 'color' => '#ffb997'],
        ['title' => 'Прочие расходы', 'color' => '#646464'],
        ['title' => 'Снятие наличных', 'color' => '#c0c0c0']
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
     * @return \yii\db\ActiveQuery
     */
    public function getUser (): \yii\db\ActiveQuery {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }

    /**
     * Gets query for [[Events]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getEvents (): \yii\db\ActiveQuery {
        return $this->hasMany(Event::class, ['category_id' => 'id']);
    }

    /**
     * Gets query for [[PlanningEvents]].
     *
     * @return \yii\db\ActiveQuery
     */
    public function getPlanningEvents (): \yii\db\ActiveQuery {
        return $this->hasMany(PlanningEvent::class, ['category_id' => 'id']);
    }
}
