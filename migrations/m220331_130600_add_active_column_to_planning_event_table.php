<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%planning_event}}`.
 */
class m220331_130600_add_active_column_to_planning_event_table extends Migration {

    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->addColumn('{{%planning_events}}', 'active', Schema::TYPE_SMALLINT . ' NOT NULL DEFAULT 1');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropColumn('{{%planning_events}}', 'active');

        Yii::$app->cache->flush();
    }
}
