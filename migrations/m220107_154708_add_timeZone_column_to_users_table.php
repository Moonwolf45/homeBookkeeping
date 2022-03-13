<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%user}}`.
 */
class m220107_154708_add_timeZone_column_to_users_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%users}}','timeZone', Schema::TYPE_STRING . ' NULL DEFAULT "Europe/Moscow"');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropColumn('{{%users}}','timeZone');

        Yii::$app->cache->flush();
    }
}
