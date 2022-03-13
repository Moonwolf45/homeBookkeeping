<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210108_163439_create_categories_table
 */
class m210108_163439_create_categories_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->createTable('{{%categories}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'title' => Schema::TYPE_STRING . ' NOT NULL',
            'color' => Schema::TYPE_STRING . ' NOT NULL',
        ]);

        $this->createIndex('idx-categories-user_id', '{{%categories}}', 'user_id');
        $this->addForeignKey('fk-categories-user_id', '{{%categories}}', 'user_id',
            '{{%users}}', 'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropForeignKey('fk-categories-user_id', '{{%categories}}');
        $this->dropIndex('idx-categories-user_id', '{{%categories}}');

        $this->dropTable('{{%categories}}');

        Yii::$app->cache->flush();
    }
}
