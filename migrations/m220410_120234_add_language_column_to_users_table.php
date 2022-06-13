<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%users}}`.
 */
class m220410_120234_add_language_column_to_users_table extends Migration {

    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%users}}', 'language', Schema::TYPE_STRING . '(5) NOT NULL DEFAULT "ru"');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropColumn('{{%users}}', 'language');

        Yii::$app->cache->flush();
    }
}
