<?php
namespace app\models\form;

use app\models\User;
use Yii;
use yii\base\Model;

class LoginForm extends Model {

    public string $email;
    public string $password;

    private $_user = false;

    /**
     * @return array the validation rules.
     */
    public function rules(): array {
        return [
            [['email', 'password'], 'required'],
            [['email', 'password'], 'filter', 'filter' => 'trim'],
            ['email', 'filter', 'filter' => 'strtolower'],
            ['password', 'validatePassword']
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword(string $attribute, array $params) {
        if (!$this->hasErrors()) {
            $user = $this->getUser();

            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError($attribute, 'Incorrect username or password.');
            }
        }
    }

    /**
     * Finds user by [[username]]
     *
     * @return User|null
     */
    public function getUser(): ?User {
        if ($this->_user === false) {
            $this->_user = User::findByEmail($this->email);
        }

        return $this->_user;
    }

    /**
     * Logs in a user using the provided username and password.
     *
     * @param $user
     *
     * @return bool whether the user is logged in successfully
     */
    public static function login($user): bool {
        if ($user->validate()) {
            return Yii::$app->user->login($user, 3600 * 24 * 30);
        }

        return false;
    }

}
