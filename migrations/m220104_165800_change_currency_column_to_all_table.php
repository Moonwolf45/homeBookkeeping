<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m220104_165800_change_currency_column_to_all_table
 */
class m220104_165800_change_currency_column_to_all_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->alterColumn('{{%bills}}', 'currency', Schema::TYPE_STRING . ' NOT NULL DEFAULT \'RUB\'');
        $this->alterColumn('{{%events}}', 'currency', Schema::TYPE_STRING . ' NOT NULL DEFAULT \'RUB\'');
        $this->alterColumn('{{%planning_events}}', 'currency', Schema::TYPE_STRING . ' NOT NULL DEFAULT \'RUB\'');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->alterColumn('{{%planning_events}}', 'currency', Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1');
        $this->alterColumn('{{%events}}', 'currency', Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1');
        $this->alterColumn('{{%bills}}', 'currency', Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1');

        Yii::$app->cache->flush();
    }
}
