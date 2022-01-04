<p>
    <?= Yii::t('app', 'welcome', ['username' => $this->params['password']]); ?><br>
    <br>
    <?= Yii::t('app', 'mew_password', ['password' => $this->params['username']]); ?><br>
    <br>
    <?= Yii::t('app', 'signature'); ?>
</p>

