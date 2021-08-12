<?php

namespace app\api\v1;


use app\api\ApiModule;

class V1Module extends ApiModule {

    public $controllerNamespace = 'app\api\v1\controllers';

    public function init () {
        parent::init();
    }

}
