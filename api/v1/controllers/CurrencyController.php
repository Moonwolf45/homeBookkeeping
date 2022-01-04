<?php

namespace app\api\v1\controllers;


use app\models\Currency;
use Yii;
use yii\caching\TagDependency;
use yii\web\HttpException;
use yii\web\Response;

class CurrencyController extends AllApiController {

    public $modelClass = Currency::class;

    /**
     * @return array
     */
    public function actions (): array {
        $actions = parent::actions();
        unset($actions['create'], $actions['update'], $actions['view']);

        return $actions;
    }

    /**
     * @param $id
     *
     * @return Response
     * @throws HttpException|\yii\base\InvalidConfigException
     */
    public function actionUpdate ($id): Response {
        $changeCurrency = Yii::$app->getRequest()->getBodyParams();

        $editCurrency = Currency::find()->where(['user_id' => $id])->asArray()->one();
        $editCurrency->string_currency = $changeCurrency['name'];
        if ($editCurrency->validate() && $editCurrency->save()) {
            TagDependency::invalidate(Yii::$app->cache, 'currency_' . $editCurrency->user_id);

            return $this->asJson($editCurrency);
        }

        throw new HttpException(400, 'server.errors.unknownError');
    }

    /**
     * @param $id
     *
     * @return Response
     */
    public function actionView ($id): Response {
        $currency = Yii::$app->cache->getOrSet('currency_' . $id, function () use ($id) {
            $currencyModel = Currency::find()->where(['user_id' => $id])->asArray()->one();

            $arrCurrency = explode(',', $currencyModel['string_currency']);
            $currencyModel['currency'] = [];
            foreach ($arrCurrency as $currency) {
                $currencyModel['currency'] = array_merge($currencyModel['currency'], [Currency::DEFAULT_CURRENCY[$currency]]);
            }
            $currencyModel['mainCurrency'] = Currency::DEFAULT_CURRENCY[$currencyModel['main_currency']];

            return $currencyModel;
        }, Yii::$app->params['cacheDuration'], new TagDependency(['tags' => 'currency_' . $id]));

        return $this->asJson($currency);
    }

    /**
     *
     * @return Response
     */
    public function actionAllCurrency (): Response {
        $all_currency =  Yii::$app->cache->getOrSet('currencyAll', function () {
            return Currency::DEFAULT_CURRENCY;
        }, 86400);

        return $this->asJson($all_currency);
    }
}
