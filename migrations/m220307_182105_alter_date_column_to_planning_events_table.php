<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m220307_182105_alter_date_column_to_planning_events_table
 */
class m220307_182105_alter_date_column_to_planning_events_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->dropColumn('{{%planning_events}}','view');
        $this->alterColumn('{{%planning_events}}','date', Schema::TYPE_DATETIME . ' NOT NULL');
        $this->addColumn('{{%planning_events}}','event_id', Schema::TYPE_INTEGER . ' NULL DEFAULT NULL');

        $this->createIndex('idx-planning_events-event_id', '{{%planning_events}}', 'event_id');
        $this->addForeignKey('fk-planning_events-event_id', '{{%planning_events}}', 'event_id', '{{%events}}',
            'id');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropForeignKey('fk-planning_events-event_id', '{{%planning_events}}');
        $this->dropIndex('idx-planning_events-event_id', '{{%planning_events}}');
        $this->dropColumn('{{%planning_events}}','event_id');

        $this->alterColumn('{{%planning_events}}','date', Schema::TYPE_INTEGER . ' NOT NULL');
        $this->addColumn('{{%planning_events}}','view', Schema::TYPE_SMALLINT . ' NULL DEFAULT 0');

        Yii::$app->cache->flush();
    }
}
