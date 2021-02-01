<?php


use yii\db\Migration;
use yii\db\Schema;

/**
 * Class m210108_143718_create_profiles_table
 */
class m210108_143718_create_profiles_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp () {
        $this->createTable('{{%profiles}}', [
            'id' => Schema::TYPE_PK,
            'user_id' => Schema::TYPE_INTEGER . ' NOT NULL',
            'balanceRUB' => Schema::TYPE_DECIMAL . '(12.2) DEFAULT 0',
            'balanceUSD' => Schema::TYPE_DECIMAL . '(12.2) DEFAULT 0',
            'balanceEUR' => Schema::TYPE_DECIMAL . '(12.2) DEFAULT 0',
        ]);

        $this->createIndex('idx-profiles-user_id', '{{%profiles}}', 'user_id');
        $this->addForeignKey('fk-profiles-user_id', '{{%profiles}}', 'user_id', '{{%users}}',
            'id', 'CASCADE');
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropIndex('idx-profiles-user_id', '{{%profiles}}');
        $this->dropForeignKey('fk-profiles-user_id', '{{%profiles}}');

        $this->dropTable('{{%profiles}}');
    }
}
