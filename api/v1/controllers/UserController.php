<?php

namespace app\api\v1\controllers;


use app\models\Category;
use app\models\Event;
use app\models\form\LoginForm;
use app\models\Profile;
use app\models\User;
use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\web\HttpException;
use yii\web\Response;

class UserController extends AllApiController {

    public $modelClass = User::class;

    /**
     * @return array|array[]
     */
    public function behaviors(): array {
        $behaviors = parent::behaviors();

        $availableToEveryone = ['options', 'login', 'registration', 'auto-login'];

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
        unset($actions['index'], $actions['create']);

        return $actions;
    }

    /**
     * @return Response
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
}
