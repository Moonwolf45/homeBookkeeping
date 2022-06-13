<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles the creation of table `{{%tokenUser}}`.
 */
class m220220_140446_create_tokenUser_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%events}}','convertAmount', Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00');

        $this->createTable('{{%token_user}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'token' => Schema::TYPE_STRING . '(255) NOT NULL'
        ]);

        $this->createIndex('idx-token_user-user_id', '{{%token_user}}', 'user_id');
        $this->addForeignKey('fk-token_user-user_id', '{{%token_user}}', 'user_id', '{{%users}}',
            'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropForeignKey('fk-token_user-user_id', '{{%token_user}}');
        $this->dropIndex('idx-token_user-user_id', '{{%token_user}}');

        $this->dropTable('{{%token_user}}');

        $this->dropColumn('{{%events}}','convertAmount');

        Yii::$app->cache->flush();
    }
}
