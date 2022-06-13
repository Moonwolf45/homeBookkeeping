<?php

namespace app\api\v1\controllers;


use app\models\Category;
use app\models\Currency;
use app\models\form\LoginForm;
use app\models\traits\MailToUserTrait;
use app\models\User;
use Yii;
use yii\caching\TagDependency;
use yii\filters\auth\HttpBearerAuth;
use yii\httpclient\Client;
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
    public function actions(): array {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['update'], $actions['view'], $actions['delete']);

        return $actions;
    }

    /**
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     * @throws \yii\httpclient\Exception
     */
    public function actionRegistration(): Response {
        $model = new User();
        $newUser = Yii::$app->getRequest()->getBodyParams();

        $client = new Client();
        $response = $client->createRequest()->setMethod('post')
            ->setUrl('https://www.google.com/recaptcha/api/siteverify')
            ->setData(['secret' => Yii::$app->params['keySecret'], 'response' => $newUser['token']])
            ->send();

        if ($response->isOk && $response->data['success']) {
            if (empty(User::findByEmail($newUser['email']))) {
                $transaction = Yii::$app->db->beginTransaction();

                try {
                    $model->username = $newUser['username'];
                    $model->email = $newUser['email'];
                    $model->timeZone = $newUser['timeZone'];
                    $model->setPassword($newUser['password']);
                    $model->generateAuthKey();
                    $model->status = User::STATUS_ACTIVE;
                    $model->language = $newUser['language'];
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
                    } else {
                        $transaction->rollBack();

                        Yii::$app->response->format = Response::FORMAT_JSON;
                        throw new HttpException(422, $model->errors);
                    }
                } catch (\Throwable $e) {
                    $transaction->rollBack();

                    Yii::$app->response->format = Response::FORMAT_JSON;
                    throw new HttpException($e->getCode(), 'server.errors.unknownError');
                }
            }

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(412, 'form.errors.userAlreadyRegister');
        } else {
            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(400, 'form.errors.captchaInvalid');
        }
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

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(422, $login_form->errors);
        }

        Yii::$app->response->format = Response::FORMAT_JSON;
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

            Yii::$app->response->format = Response::FORMAT_JSON;
            throw new HttpException(422, $oneUser->errors);
        }

        Yii::$app->response->format = Response::FORMAT_JSON;
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

    /**
     * @param $id
     *
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate ($id): Response {
        $user = Yii::$app->getRequest()->getBodyParams();

        $oneUser = User::findOne($id);
        if (!empty($oneUser)) {
            $transaction = Yii::$app->db->beginTransaction();

            try {
                $oneUser->username = $user['username'];
                $oneUser->email = $user['email'];
                $oneUser->timeZone = $user['timeZone'];
                $oneUser->language = $user['language'];

                if ($user['changePassword']) {
                    if ($oneUser->validatePassword($user['password'])) {
                        $oneUser->setPassword($user['password']);
                    } else {
                        $transaction->rollBack();

                        Yii::$app->response->format = Response::FORMAT_JSON;
                        throw new HttpException(422, 'server.errors.currentPasswordNotCorrect');
                    }
                }

                $oneUser->generateAuthKey();
                if ($oneUser->validate() && $oneUser->save()) {
                    $currency = Currency::findOne(['user_id' => $oneUser->id]);
                    if (!empty($currency)) {
                        $currency->string_currency = implode(',', $user['currenciesUser']);
                        $currency->main_currency = $user['currency'];
                        if ($currency->validate() && $currency->save()) {
                            TagDependency::invalidate(Yii::$app->cache, 'currency_' . $oneUser->id);

                            $transaction->commit();
                            return $this->asJson(['user' => $oneUser, 'currency' => $currency]);
                        }

                        $transaction->rollBack();

                        Yii::$app->response->format = Response::FORMAT_JSON;
                        throw new HttpException(422, $currency->errors);
                    }
                }

                Yii::$app->response->format = Response::FORMAT_JSON;
                throw new HttpException(422, $oneUser->errors);
            } catch (\Throwable $e) {
                $transaction->rollBack();

                Yii::$app->response->format = Response::FORMAT_JSON;
                throw new HttpException($e->getCode(), 'server.errors.unknownError');
            }
        }
    }

    /**
     * @param $id
     *
     * @return Response
     *
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdateLanguage ($id): Response {
        $user = Yii::$app->getRequest()->getBodyParams();

        $oneUser = User::findOne($id);
        if (!empty($oneUser)) {
            $transaction = Yii::$app->db->beginTransaction();

            try {
                $oneUser->language = $user['language'];

                if ($oneUser->validate() && $oneUser->save()) {
//                    TagDependency::invalidate(Yii::$app->cache, 'currency_' . $oneUser->id);

                    $transaction->commit();
                    return $this->asJson(['user' => $oneUser]);
                }

                Yii::$app->response->format = Response::FORMAT_JSON;
                throw new HttpException(422, $oneUser->errors);
            } catch (\Throwable $e) {
                $transaction->rollBack();

                Yii::$app->response->format = Response::FORMAT_JSON;
                throw new HttpException($e->getCode(), 'server.errors.unknownError');
            }
        }
    }
}
