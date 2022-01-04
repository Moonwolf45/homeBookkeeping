<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%events}}`.
 */
class m211225_152632_add_bill_id_column_to_events_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%events}}', 'bill_id', Schema::TYPE_INTEGER . ' NOT NULL');

        $this->createIndex('idx-events-bill_id', '{{%events}}', 'bill_id');
        $this->addForeignKey('fk-events-bill_id', '{{%events}}', 'bill_id', '{{%bills}}',
            'id', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropForeignKey('fk-events-bill_id', '{{%events}}');
        $this->dropIndex('idx-events-bill_id', '{{%events}}');

        $this->dropColumn('{{%events}}', 'bill_id');
    }
}
