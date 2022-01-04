<?php

namespace app\models;


use Yii;
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
        'AUD' => ['CharCode' => 'AUD', 'Name' => 'Австралийский доллар', 'locale' => 'en_AU'],
        'GBP' => ['CharCode' => 'GBP', 'Name' => 'Фунт стерлингов Соединенного королевства', 'locale' => 'en_GB'],
        'AMD' => ['CharCode' => 'AMD', 'Name' => 'Армянских драмов', 'locale' => 'hy_AM'],
        'BYN' => ['CharCode' => 'BYN', 'Name' => 'Белорусский рубль', 'locale' => 'ru_BY'],
        'BGN' => ['CharCode' => 'BGN', 'Name' => 'Болгарский лев', 'locale' => 'bg_BG'],
        'BRL' => ['CharCode' => 'BRL', 'Name' => 'Бразильский реал', 'locale' => 'pt_BR'],
        'HUF' => ['CharCode' => 'HUF', 'Name' => 'Венгерских форинтов', 'locale' => 'hu_HU'],
        'HKD' => ['CharCode' => 'HKD', 'Name' => 'Гонконгских долларов', 'locale' => 'en_HK'],
        'DKK' => ['CharCode' => 'DKK', 'Name' => 'Датская крона', 'locale' => 'da_DK'],
        'INR' => ['CharCode' => 'INR', 'Name' => 'Индийских рупий', 'locale' => 'as_IN'],
        'KZT' => ['CharCode' => 'KZT', 'Name' => 'Казахстанских тенге', 'locale' => 'ru_KZ'],
        'CAD' => ['CharCode' => 'CAD', 'Name' => 'Канадский доллар', 'locale' => 'en_CA'],
        'KGS' => ['CharCode' => 'KGS', 'Name' => 'Киргизских сомов', 'locale' => 'ru_KG'],
        'CNY' => ['CharCode' => 'CNY', 'Name' => 'Китайский юань', 'locale' => 'bo_CN'],
        'MDL' => ['CharCode' => 'MDL', 'Name' => 'Молдавских леев', 'locale' => 'ru_MD'],
        'NOK' => ['CharCode' => 'NOK', 'Name' => 'Норвежских крон', 'locale' => 'nb_NO'],
        'PLN' => ['CharCode' => 'PLN', 'Name' => 'Польский злотый', 'locale' => 'pl_PL'],
        'RON' => ['CharCode' => 'RON', 'Name' => 'Румынский лей', 'locale' => 'ro_RO'],
        'XDR' => ['CharCode' => 'XDR', 'Name' => 'СДР (специальные права заимствования)', 'locale' => 'en-US'],
        'SGD' => ['CharCode' => 'SGD', 'Name' => 'Сингапурский доллар', 'locale' => 'en_SG'],
        'TJS' => ['CharCode' => 'TJS', 'Name' => 'Таджикских сомони', 'locale' => 'tg_TJ'],
        'TRY' => ['CharCode' => 'TRY', 'Name' => 'Турецких лир', 'locale' => 'ku_TR'],
        'TMT' => ['CharCode' => 'TMT', 'Name' => 'Новый туркменский манат', 'locale' => 'tk_TM'],
        'UZS' => ['CharCode' => 'UZS', 'Name' => 'Узбекских сумов', 'locale' => 'uz_UZ'],
        'UAH' => ['CharCode' => 'UAH', 'Name' => 'Украинских гривен', 'locale' => 'ru_UA'],
        'CZK' => ['CharCode' => 'CZK', 'Name' => 'Чешских крон', 'locale' => 'cs_CZ'],
        'SEK' => ['CharCode' => 'SEK', 'Name' => 'Шведских крон', 'locale' => 'sv_SE'],
        'CHF' => ['CharCode' => 'CHF', 'Name' => 'Швейцарский франк', 'locale' => 'de_CH'],
        'ZAR' => ['CharCode' => 'ZAR', 'Name' => 'Южноафриканских рэндо', 'locale' => 'af_ZA'],
        'KRW' => ['CharCode' => 'KRW', 'Name' => 'Вон Республики Корея', 'locale' => 'ko_KR'],
        'JPY' => ['CharCode' => 'JPY', 'Name' => 'Японских иен', 'locale' => 'ja_JP']
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
     * @return \yii\db\ActiveQuery
     */
    public function getUser (): \yii\db\ActiveQuery {
        return $this->hasOne(User::class, ['id' => 'user_id']);
    }
}
