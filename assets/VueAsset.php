<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * Main application asset bundle.
 *
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class VueAsset extends AssetBundle {

    public $publishOptions = ['forceCopy' => true];
    public $sourcePath = '@webroot/js';
    public $baseUrl = '@web';

    public function init() {
        parent::init();

        $this->js[] = YII_ENV === 'dev' ? 'main.js' : 'main.min.js';
    }

}
