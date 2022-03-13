<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210108_125604_create_users_table
 */
class m210108_125604_create_users_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->createTable('{{%users}}', [
            'id' => Schema::TYPE_PK,
            'username' => Schema::TYPE_STRING . ' NULL UNIQUE DEFAULT NULL',
            'email' => Schema::TYPE_STRING . ' NOT NULL UNIQUE',
            'password_hash' => Schema::TYPE_STRING . ' NOT NULL',
            'password_reset_token' => Schema::TYPE_STRING . ' NULL UNIQUE DEFAULT NULL',
            'auth_key' => Schema::TYPE_STRING . '(255) NOT NULL',

            'status' => Schema::TYPE_SMALLINT . ' NOT NULL DEFAULT 10',
            'created_at' => Schema::TYPE_INTEGER . ' NOT NULL',
            'updated_at' => Schema::TYPE_INTEGER . ' NOT NULL',
        ]);

        $this->createIndex('idx-users-username', '{{%users}}', 'username', true);
        $this->createIndex('idx-users-email', '{{%users}}', 'email', true);
        $this->createIndex('idx-users-password_reset_token', '{{%users}}', 'password_reset_token',
            true);

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        echo "m210108_125604_crate_users_table cannot be reverted.\n";

        Yii::$app->cache->flush();

        return false;
    }
}
