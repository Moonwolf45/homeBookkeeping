<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%currency}}`.
 */
class m220104_162354_add_main_currency_column_to_currency_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%currency}}', 'main_currency', Schema::TYPE_STRING . ' NOT NULL DEFAULT \'RUB\'');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropColumn('{{%currency}}', 'main_currency');
    }
}
