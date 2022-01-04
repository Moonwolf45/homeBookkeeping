<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210404_163416_rename_profiles_table
 */
class m210404_163416_rename_profiles_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->renameTable('{{%profiles}}', '{{%bills}}');
        $this->renameColumn('{{%bills}}', 'balanceRUB', 'balance');
        $this->dropColumn('{{%bills}}', 'balanceUSD');
        $this->dropColumn('{{%bills}}', 'balanceEUR');

        $this->addColumn('{{%bills}}', 'name', Schema::TYPE_STRING . '(255) NOT NULL');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropColumn('{{%bills}}', 'name');
        $this->addColumn('{{%bills}}', 'balanceEUR', Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00');
        $this->addColumn('{{%bills}}', 'balanceUSD', Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00');
        $this->renameColumn('{{%bills}}', 'balance', 'balanceRUB');

        $this->renameTable('{{%bills}}', '{{%profiles}}');
    }
}
