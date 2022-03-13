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
            'balanceRUB' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
            'balanceUSD' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
            'balanceEUR' => Schema::TYPE_DECIMAL . '(12,2) NOT NULL DEFAULT 0.00',
        ]);

        $this->createIndex('idx-profiles-user_id', '{{%profiles}}', 'user_id');
        $this->addForeignKey('fk-profiles-user_id', '{{%profiles}}', 'user_id', '{{%users}}',
            'id', 'CASCADE');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown () {
        $this->dropForeignKey('fk-profiles-user_id', '{{%profiles}}');
        $this->dropIndex('idx-profiles-user_id', '{{%profiles}}');

        $this->dropTable('{{%profiles}}');

        Yii::$app->cache->flush();
    }
}
