<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210108_170310_create_planning_events_table
 */
class m210108_170310_create_planning_events_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->createTable('{{%planning_events}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'category_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'currency' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1',
            'type' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1',
            'amount' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
            'date' => Schema::TYPE_INTEGER . ' NOT NULL',
            'description' => Schema::TYPE_TEXT . ' NULL DEFAULT NULL',
            'view' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 0',
            'status' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1',
        ]);

        $this->createIndex('idx-planning_events-user_id', '{{%planning_events}}', 'user_id');
        $this->addForeignKey('fk-planning_events-user_id', '{{%planning_events}}', 'user_id',
            '{{%users}}', 'id', 'CASCADE');

        $this->createIndex('idx-planning_events-category_id', '{{%planning_events}}', 'category_id');
        $this->addForeignKey('fk-planning_events-category_id', '{{%planning_events}}', 'category_id',
            '{{%categories}}', 'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropForeignKey('fk-planning_events-category_id', '{{%planning_events}}');
        $this->dropIndex('idx-planning_events-category_id', '{{%planning_events}}');

        $this->dropForeignKey('fk-planning_events-user_id', '{{%planning_events}}');
        $this->dropIndex('idx-planning_events-user_id', '{{%planning_events}}');

        $this->dropTable('{{%planning_events}}');

        Yii::$app->cache->flush();
    }
}
