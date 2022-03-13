<?php

namespace app\api\v1\controllers;


use app\models\Category;
use Yii;
use yii\caching\TagDependency;
use yii\web\HttpException;
use yii\web\Response;

class CategoryController extends AllApiController {

    public $modelClass = Category::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['create'], $actions['update'], $actions['view'], $actions['delete']);

        return $actions;
    }

    /**
     * @return Response
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionCreate (): Response {
        $category = Yii::$app->getRequest()->getBodyParams();

        $newCategory = new Category();
        $newCategory->user_id = $category['user_id'];
        $newCategory->title = $category['title'];
        $newCategory->color = $category['color'];
        if ($newCategory->validate() && $newCategory->save()) {
            TagDependency::invalidate(Yii::$app->cache, 'category_' . $newCategory->user_id);

            return $this->asJson($newCategory);
        } else {
            return $this->asJson($newCategory->errors);
        }
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate ($id): Response {
        $category = Yii::$app->getRequest()->getBodyParams();

        $editCategory = Category::findOne($id);
        $editCategory->user_id = $category['user_id'];
        $editCategory->title = $category['title'];
        $editCategory->color = $category['color'];
        if ($editCategory->validate() && $editCategory->save()) {
            TagDependency::invalidate(Yii::$app->cache, 'category_' . $editCategory->user_id);

            return $this->asJson($editCategory);
        }

        throw new HttpException(400, 'server.errors.unknownError');
    }

    /**
     * @param $id
     *
     * @return Response
     */
    public function actionView ($id): Response {
        $categories = Yii::$app->cache->getOrSet('category_' . $id, function () use ($id) {
            return Category::find()->where(['user_id' => $id])->asArray()->all();
        }, Yii::$app->params['cacheDuration'], new TagDependency(['tags' => 'category_' . $id]));

        return $this->asJson($categories);
    }
}
