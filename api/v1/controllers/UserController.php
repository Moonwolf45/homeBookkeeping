<?php

namespace app\api\v1\controllers;


use app\models\Category;
use app\models\Currency;
use app\models\form\LoginForm;
use app\models\traits\MailToUserTrait;
use app\models\User;
use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\web\HttpException;
use yii\web\Response;

class UserController extends AllApiController {
    use MailToUserTrait;

    public $modelClass = User::class;

    /**
     * @return array|array[]
     */
    public function behaviors(): array {
        $behaviors = parent::behaviors();

        $availableToEveryone = ['options', 'login', 'registration', 'forgot-password', 'user-exists'];

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => $availableToEveryone
        ];

        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update'], $actions['view'], $actions['delete']);

        return $actions;
    }

    /**
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionRegistration(): Response {
        $model = new User();

        $newUser = Yii::$app->getRequest()->getBodyParams();
        if (empty(User::findByEmail($newUser['email']))) {
            $transaction = Yii::$app->db->beginTransaction();

            try {
                $model->username = $newUser['username'];
                $model->email = $newUser['email'];
                $model->setPassword($newUser['password']);
                $model->generateAuthKey();
                $model->status = User::STATUS_ACTIVE;
                if ($model->validate() && $model->save()) {
                    foreach (Category::DEFAULT_CATEGORY as $category) {
                        $newUserCategory = new Category();
                        $newUserCategory->user_id = $model->id;
                        $newUserCategory->title = $category['title'];
                        $newUserCategory->color = $category['color'];
                        $newUserCategory->save();
                    }

                    $newCurrency = new Currency();
                    $newCurrency->user_id = $model->id;
                    $newCurrency->string_currency = 'RUB,USD,EUR';
                    $newCurrency->main_currency = 'RUB';
                    $newCurrency->save();

                    $transaction->commit();
                    return $this->asJson($model);
                }

                throw new HttpException(422, $model->errors);
            } catch (\Throwable $e) {
                $transaction->rollBack();

                throw new HttpException($e->getCode(), 'server.errors.unknownError');
            }

        }

        throw new HttpException(412, 'form.errors.userAlreadyRegister');
    }

    /**
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\Exception
     * @throws \yii\base\InvalidConfigException
     */
    public function actionLogin(): Response {
        $user = Yii::$app->getRequest()->getBodyParams();

        $oneUser = User::findByEmail($user['email']);
        if (!empty($oneUser)) {
            $login_form = new LoginForm();
            $login_form->load($user, '');
            if ($login_form->validate()) {
                $oneUser->generateAuthKey();
                $oneUser->generateAccessToken();
                if ($oneUser->validate() && $oneUser->save()) {
                    $login_form->login($oneUser);

                    return $this->asJson($oneUser);
                }
            }

            throw new HttpException(422, $login_form->errors);
        }

        throw new HttpException(412, 'form.errors.userNoRegister');
    }

    /**
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\Exception
     * @throws \yii\base\InvalidConfigException
     */
    public function actionForgotPassword(): Response {
        $user = Yii::$app->getRequest()->getBodyParams();

        $oneUser = User::findByEmail($user['email']);
        if (!empty($oneUser)) {
            $new_pass = User::generatePassword();
            $oneUser->setPassword($new_pass);
            $oneUser->generateAuthKey();
            $oneUser->generateAccessToken();
            if ($oneUser->save()) {
                if ($user['language'] == 'ru') {
                    Yii::$app->language = 'ru_RU';
                } else {
                    Yii::$app->language = 'en_US';
                }
                $this->sendMailToUser($oneUser->email, 'newPassword', Yii::t('app',
                    'passwordRecovery'), [ 'password' => $new_pass, 'username' => $oneUser->username ]);

                return $this->asJson(['result' => 'ok']);
            }

            throw new HttpException(422, ['result' => 'error', 'errors' => $oneUser->errors]);
        }

        throw new HttpException(412, 'form.errors.userNoRegister');
    }

    /**
     * @return Response
     *
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUserExists(): Response {
        $user = Yii::$app->getRequest()->getBodyParams();

        $oneUser = User::findByEmail($user['email']);
        if (!empty($oneUser)) {
            return $this->asJson(['result' => true]);
        } else {
            return $this->asJson(['result' => false, 'message' => 'auth.errors.notUserEmailIsExists']);
        }
    }
}
