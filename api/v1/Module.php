<?php

namespace app\api\v1;

use app\api\Module as HomeModule;

/**
 * api module definition class
 */
class Module extends HomeModule {

    /**
     * {@inheritdoc}
     */
    public $controllerNamespace = 'app\api\v1\controllers';

}
