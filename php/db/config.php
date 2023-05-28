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
    public $charset;
    public $logo;
    public $showheaders;
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
				`charset` VARCHAR(50) NOT NULL,
				`logo` VARCHAR(255) NOT NULL,
				`showheaders` TINYINT(1) NOT NULL
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
        $config->charset = $result['charset'];
        $config->logo = $result['logo'];
        $config->showheaders = $result['showheaders'];
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
            . '`sitename`=' . db::string($config->sitename) . ','
            . '`siteowner`=' . db::string($config->siteowner) . ','
            . '`theme`=' . db::string($config->theme) . ','
            . '`charset`=' . db::string($config->charset) . ','
            . '`logo`=' . db::string($config->logo) . ','
            . '`showheaders`=' . db::bool($config->showheaders)  . ' '
            . 'WHERE `id`=1');
    } else {
        $db->query('INSERT INTO config ('
            . '`id`,'
            . '`language`,'
            . '`sitename`,'
            . '`siteowner`,'
            . '`theme`,'
            . '`charset`,'
            . '`logo`,'
            . '`showheaders` )'
            . ' VALUES ('
            . '1,'
            . db::string($config->language) . ','
            . db::string($config->sitename) . ','
            . db::string($config->siteowner) . ','
            . db::string($config->theme) . ','
            . db::string($config->charset) . ','
            . db::string($config->logo) . ','
            . db::bool($config->showheaders) . ')');
        $config->id = $db->get_last_id();
    }
}

function create_config(
    $db,
    $language,
    $sitename,
    $siteowner,
    $theme,
    $charset,
    $logo,
    $showheaders
) {
    $config = new config($db);
    $config->language = $language;
    $config->sitename = $sitename;
    $config->siteowner = $siteowner;
    $config->theme = $theme;
    $config->charset = $charset;
    $config->logo = $logo;
    $config->showheaders = $showheaders;
    write_config($db, $config);
    return $config->id;
}

function drop_config($db)
{
    $db->query('drop table config');
}
