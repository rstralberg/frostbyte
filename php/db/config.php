<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Configuration Table
// - Basic configuration for FrostByte
require_once __DIR__ . '/db.php';

class config
{
    public $id;
    public $language;
    public $sitename;
    public $siteowner;
    public $theme;
    public $logo;
}

function create_config_table($db)
{
    $create = !$db->table_exist('config');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `config`  (
				`id` INT(11) NULL DEFAULT '1',
				`language` VARCHAR(10) NOT NULL,
				`sitename` VARCHAR(100) NOT NULL,
				`siteowner` VARCHAR(100) NOT NULL,
				`theme` VARCHAR(100) NOT NULL,
				`logo` VARCHAR(255) NOT NULL
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB"
        );
    }
}

function read_config($db)
{
    $result = $db->query('SELECT * FROM config WHERE `id`=1', dbmode::single);
    if ($result) {
        $config = new config($db);
        $config->id = $result['id'];
        $config->language = $result['language'];
        $config->sitename = $result['sitename'];
        $config->siteowner = $result['siteowner'];
        $config->theme = $result['theme'];
        $config->logo = $result['logo'];
        return $config;
    } else {
        return null;
    }
}

function write_config($db, $config)
{
    if ($db->row_exist('config', 'id=1')) {
        $db->query('UPDATE config SET '
            . '`language`=' . db::string($config->language) . ','
            . '`sitename`=' . db::encode_string($config->sitename) . ','
            . '`siteowner`=' . db::encode_string($config->siteowner) . ','
            . '`theme`=' . db::encode_string($config->theme) . ','
            . '`logo`=' . db::encode_string($config->logo) . ' '
            . 'WHERE `id`=1');
    } else {
        $db->query('INSERT INTO config ('
            . '`id`,'
            . '`language`,'
            . '`sitename`,'
            . '`siteowner`,'
            . '`theme`,'
            . '`logo` )'
            . ' VALUES ('
            . '1,'
            . db::string($config->language) . ','
            . db::encode_string($config->sitename) . ','
            . db::encode_string($config->siteowner) . ','
            . db::encode_string($config->theme) . ','
            . db::encode_string($config->logo) . ')');
        $config->id = $db->get_last_id();
    }
}

function create_config(
    $db,
    $language,
    $sitename,
    $siteowner,
    $theme,
    $logo
) {
    $config = new config($db);
    $config->language = $language;
    $config->sitename = $sitename;
    $config->siteowner = $siteowner;
    $config->theme = $theme;
    $config->logo = $logo;
    write_config($db, $config);
    return $config->id;
}

function drop_config($db)
{
    $db->query('drop table config');
}
