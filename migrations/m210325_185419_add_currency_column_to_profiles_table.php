<?php

use yii\db\Migration;
use yii\db\Schema;

/**
 * Handles adding columns to table `{{%profiles}}`.
 */
class m210325_185419_add_currency_column_to_profiles_table extends Migration {
    /**
     * {@inheritdoc}
     */
    public function safeUp() {
        $this->addColumn('{{%profiles}}','currency', Schema::TYPE_SMALLINT . '(1) NOT NULL DEFAULT 1');

        Yii::$app->cache->flush();
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropColumn('{{%profiles}}','currency');

        Yii::$app->cache->flush();
    }
}
