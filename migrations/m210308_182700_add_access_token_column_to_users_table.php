<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%users}}`.
 */
class m210308_182700_add_access_token_column_to_users_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%users}}','access_token', Schema::TYPE_STRING . ' NULL DEFAULT NULL');

        $this->createIndex('idx-users-access_token', '{{%users}}', 'access_token');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropIndex('idx-users-access_token', '{{%users}}');

        $this->dropColumn('{{%users}}','access_token');
    }
}
