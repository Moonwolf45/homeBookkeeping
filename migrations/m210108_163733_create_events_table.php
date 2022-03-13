<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210108_163733_create_events_table
 */
class m210108_163733_create_events_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->createTable('{{%events}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'category_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'currency' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1',
            'type' => Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1',
            'amount' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
            'amount' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
            'date' => Schema::TYPE_INTEGER . ' NOT NULL',
            'description' => Schema::TYPE_TEXT . ' NULL DEFAULT NULL',
        ]);

        $this->createIndex('idx-events-user_id', '{{%events}}', 'user_id');
        $this->addForeignKey('fk-events-user_id', '{{%events}}', 'user_id', '{{%users}}',
            'id', 'CASCADE');

        $this->createIndex('idx-events-category_id', '{{%events}}', 'category_id');
        $this->addForeignKey('fk-events-category_id', '{{%events}}', 'category_id',
            '{{%categories}}', 'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropForeignKey('fk-events-category_id', '{{%events}}');
        $this->dropIndex('idx-events-category_id', '{{%events}}');

        $this->dropForeignKey('fk-events-user_id', '{{%events}}');
        $this->dropIndex('idx-events-user_id', '{{%events}}');

        $this->dropTable('{{%events}}');

        Yii::$app->cache->flush();
    }

}
