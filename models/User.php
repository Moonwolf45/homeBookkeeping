<?php

namespace app\models;


use Yii;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveQuery;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;

/**
 * This is the model class for table "users".
 *
 * @property int $id
 * @property string $username
 * @property string $email
 * @property string $password_hash
 * @property string $password_reset_token
 * @property string $auth_key
 * @property string $access_token
 * @property int $status
 * @property int $created_at
 * @property int $updated_at
 * @property string $timeZone
 */
class User extends ActiveRecord implements IdentityInterface {

    const STATUS_DELETED = 0;
    const STATUS_ACTIVE = 10;

    /**
     * {@inheritdoc}
     */
    public static function tableName(): string {
        return '{{%users}}';
    }

    /**
     * @return array[]
     */
    public function behaviors(): array {
        return [
            [
                'class' => TimestampBehavior::class,
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => ['created_at', 'updated_at'],
                    ActiveRecord::EVENT_BEFORE_UPDATE => ['updated_at'],
                ],
            ],
        ];
    }

    public function rules(): array {
        return [
            [['email', 'password_reset_token'], 'unique'],
            [['email', 'password_hash', 'timeZone'], 'required'],
            [['email', 'password_hash', 'username'], 'filter', 'filter' => 'trim'],
            [['email'], 'email'],
            [['timeZone'], 'default', 'value' => 'Europe/Moscow'],
            ['status', 'in', 'range' => [self::STATUS_ACTIVE, self::STATUS_DELETED]],
            ['status', 'default', 'value' => self::STATUS_ACTIVE],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentity($id) {
        return static::findOne($id);
    }

    /**
     * {@inheritdoc}
     */
    public static function findIdentityByAccessToken($token, $type = null) {
        return static::findOne(['access_token' => $token, 'status' => self::STATUS_ACTIVE]);
    }

    /**
     * Finds user by username
     *
     * @param string $username
     *
     * @return static|null
     */
    public static function findByUsername(string $username): ?User {
        return static::findOne(['username' => $username, 'status' => self::STATUS_ACTIVE]);
    }

    /**
     * Finds user by email
     *
     * @param string $email
     *
     * @return static|null
     */
    public static function findByEmail(string $email): ?User {
        return static::findOne(['email' => $email, 'status' => self::STATUS_ACTIVE]);
    }


    /**
     * Finds user by password reset token
     *
     * @param $token
     *
     * @return User|null
     */
    public static function findByPasswordResetToken($token): ?User {
        if (!static::isPasswordResetTokenValid($token)) {
            return null;
        }

        return static::findOne(['password_reset_token' => $token, 'status' => self::STATUS_ACTIVE]);
    }

    /**
     * @param $token
     *
     * @return bool
     */
    public static function isPasswordResetTokenValid($token): bool {
        $time = explode('_', $token);
        if ((int)$time[1] + 3600 > time()) {
            return true;
        }

        return false;
    }

    /**
     * {@inheritdoc}
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthKey(): string {
        return $this->auth_key;
    }

    /**
     * {@inheritdoc}
     */
    public function validateAuthKey($authKey): bool {
        return $this->auth_key === $authKey;
    }

    /**
     * Generates authentication key
     *
     * @return void
     *
     * @throws \yii\base\Exception
     */
    public function generateAuthKey(): void {
        $this->auth_key = Yii::$app->security->generateRandomString();
    }

    /**
     * Generates access token
     *
     * @return void
     */
    public function generateAccessToken(): void {
        $this->access_token = Yii::$app->request->getCsrfToken();
    }

    /**
     * Validates password
     *
     * @param string $password password to validate
     *
     * @return bool if password provided is valid for current user
     */
    public function validatePassword(string $password): bool {
        return Yii::$app->security->validatePassword($password, $this->password_hash);
    }

    /**
     * Generates password hash from password and sets in the model
     *
     * @param $password
     *
     * @return void
     *
     * @throws \yii\base\Exception
     */
    public function setPassword($password): void {
        $this->password_hash = Yii::$app->security->generatePasswordHash($password);
    }

    /**
     * Generates new password reset token
     *
     * @return void
     *
     * @throws \yii\base\Exception
     */
    public function generatePasswordResetToken(): void {
        $this->password_reset_token = Yii::$app->security->generateRandomString() . '_' . time();
    }

    /**
     * Remove password reset token
     */
    public function removePasswordResetToken(): void {
        $this->password_reset_token = null;
    }

    /**
     * Gets query for [[Profile]].
     *
     * @return ActiveQuery
     */
    public function getProfile(): ActiveQuery {
        return $this->hasMany(Bill::class, ['user_id' => 'id']);
    }

    /**
     * Gets query for [[TokenUser]].
     *
     * @return ActiveQuery
     */
    public function getNotificationToken(): ActiveQuery {
        return $this->hasMany(TokenUser::class, ['user_id' => 'id']);
    }

    /**
     * @return string[]
     */
    public function fields(): array {
        $fields = parent::fields();

        unset($fields['password_hash'], $fields['password_reset_token'], $fields['created_at'],
            $fields['updated_at']);

        return $fields;
    }

    /**
     * @param int $length
     *
     * @return string
     */
    public static function generatePassword(int $length = 6): string {
        $password = '';
        $arr = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
        ];

        for ($i = 0; $i < $length; $i++) {
            $password .= $arr[rand(0, count($arr) - 1)];
        }

        return $password;
    }
}
