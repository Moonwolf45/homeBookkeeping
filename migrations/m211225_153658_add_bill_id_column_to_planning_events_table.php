<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%planning_events}}`.
 */
class m211225_153658_add_bill_id_column_to_planning_events_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%planning_events}}', 'bill_id', Schema::TYPE_INTEGER . ' NOT NULL');

        $this->createIndex('idx-planning_events-bill_id', '{{%planning_events}}', 'bill_id');
        $this->addForeignKey('fk-planning_events-bill_id', '{{%planning_events}}', 'bill_id', '{{%bills}}',
            'id', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropIndex('idx-planning_events-bill_id', '{{%planning_events}}');
        $this->dropForeignKey('fk-planning_events-bill_id', '{{%planning_events}}');

        $this->dropColumn('{{%planning_events}}', 'bill_id');
    }
}
