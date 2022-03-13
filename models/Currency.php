<?php

namespace app\models;


use Yii;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "{{%currency}}".
 *
 * @property int $id
 * @property int $user_id
 * @property string $string_currency
 * @property string $main_currency
 *
 * @property User $user
 */
class Currency extends ActiveRecord {

    const DEFAULT_CURRENCY = [
        'RUB' => ['CharCode' => 'RUB', 'Name' => 'Рубль', 'locale' => 'ru-RU'],
        'USD' => ['CharCode' => 'USD', 'Name' => 'Доллар США', 'locale' => 'en-US'],
        'EUR' => ['CharCode' => 'EUR', 'Name' => 'Евро', 'locale' => 'fr-FR'],
        'AUD' => ['CharCode' => 'AUD', 'Name' => 'Австралийский доллар', 'locale' => 'en-AU'],
        'GBP' => ['CharCode' => 'GBP', 'Name' => 'Фунт стерлингов Соединенного королевства', 'locale' => 'en-GB'],
        'AMD' => ['CharCode' => 'AMD', 'Name' => 'Армянских драмов', 'locale' => 'hy-AM'],
        'BYN' => ['CharCode' => 'BYN', 'Name' => 'Белорусский рубль', 'locale' => 'ru-BY'],
        'BGN' => ['CharCode' => 'BGN', 'Name' => 'Болгарский лев', 'locale' => 'bg-BG'],
        'BRL' => ['CharCode' => 'BRL', 'Name' => 'Бразильский реал', 'locale' => 'pt-BR'],
        'HUF' => ['CharCode' => 'HUF', 'Name' => 'Венгерских форинтов', 'locale' => 'hu-HU'],
        'HKD' => ['CharCode' => 'HKD', 'Name' => 'Гонконгских долларов', 'locale' => 'en-HK'],
        'DKK' => ['CharCode' => 'DKK', 'Name' => 'Датская крона', 'locale' => 'da-DK'],
        'INR' => ['CharCode' => 'INR', 'Name' => 'Индийских рупий', 'locale' => 'as-IN'],
        'KZT' => ['CharCode' => 'KZT', 'Name' => 'Казахстанских тенге', 'locale' => 'ru-KZ'],
        'CAD' => ['CharCode' => 'CAD', 'Name' => 'Канадский доллар', 'locale' => 'en-CA'],
        'KGS' => ['CharCode' => 'KGS', 'Name' => 'Киргизских сомов', 'locale' => 'ru-KG'],
        'CNY' => ['CharCode' => 'CNY', 'Name' => 'Китайский юань', 'locale' => 'bo-CN'],
        'MDL' => ['CharCode' => 'MDL', 'Name' => 'Молдавских леев', 'locale' => 'ru-MD'],
        'NOK' => ['CharCode' => 'NOK', 'Name' => 'Норвежских крон', 'locale' => 'nb-NO'],
        'PLN' => ['CharCode' => 'PLN', 'Name' => 'Польский злотый', 'locale' => 'pl-PL'],
        'RON' => ['CharCode' => 'RON', 'Name' => 'Румынский лей', 'locale' => 'ro-RO'],
        'XDR' => ['CharCode' => 'XDR', 'Name' => 'СДР (специальные права заимствования)', 'locale' => 'en-US'],
        'SGD' => ['CharCode' => 'SGD', 'Name' => 'Сингапурский доллар', 'locale' => 'en-SG'],
        'TJS' => ['CharCode' => 'TJS', 'Name' => 'Таджикских сомони', 'locale' => 'tg-TJ'],
        'TRY' => ['CharCode' => 'TRY', 'Name' => 'Турецких лир', 'locale' => 'ku-TR'],
        'TMT' => ['CharCode' => 'TMT', 'Name' => 'Новый туркменский манат', 'locale' => 'tk-TM'],
        'UZS' => ['CharCode' => 'UZS', 'Name' => 'Узбекских сумов', 'locale' => 'uz-UZ'],
        'UAH' => ['CharCode' => 'UAH', 'Name' => 'Украинских гривен', 'locale' => 'ru-UA'],
        'CZK' => ['CharCode' => 'CZK', 'Name' => 'Чешских крон', 'locale' => 'cs-CZ'],
        'SEK' => ['CharCode' => 'SEK', 'Name' => 'Шведских крон', 'locale' => 'sv-SE'],
        'CHF' => ['CharCode' => 'CHF', 'Name' => 'Швейцарский франк', 'locale' => 'de-CH'],
        'ZAR' => ['CharCode' => 'ZAR', 'Name' => 'Южноафриканских рэндо', 'locale' => 'af-ZA'],
        'KRW' => ['CharCode' => 'KRW', 'Name' => 'Вон Республики Корея', 'locale' => 'ko-KR'],
        'JPY' => ['CharCode' => 'JPY', 'Name' => 'Японских иен', 'locale' => 'ja-JP']
    ];

    /**
     * {@inheritdoc}
     */
    public static function tableName (): string {
        return '{{%currency}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules (): array {
        return [
            [['user_id', 'string_currency', 'main_currency'], 'required'],
            [['user_id'], 'integer'],
            [['string_currency', 'main_currency'], 'string', 'max' => 255],
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
            'string_currency' => 'String currency',
            'main_currency' => 'Main currency'
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
}
