<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%currency}}`.
 */
class m220104_134658_create_currency_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->createTable('{{%currency}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'string_currency' => Schema::TYPE_STRING . ' NOT NULL',
        ]);

        $this->createIndex('idx-currency-user_id', '{{%currency}}', 'user_id');
        $this->addForeignKey('fk-currency-user_id', '{{%currency}}', 'user_id',
            '{{%users}}', 'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropForeignKey('fk-currency-user_id', '{{%currency}}');
        $this->dropIndex('idx-currency-user_id', '{{%currency}}');

        $this->dropTable('{{%currency}}');

        Yii::$app->cache->flush();
    }
}
