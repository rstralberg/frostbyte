<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/../conf.php";

class Config {

	public const TABLENAME = 'config';
	public $id;
	public $language;
	public $sitename;
	public $siteowner;
	public $theme;
	public $charset;
	public $logo;
	public $showheaders;
	
	public function __construct($db)
	{
		$create = !$db->tableExist(Config::TABLENAME);
		if( $create ) {
			$db->query( 
			"CREATE TABLE " . Config::TABLENAME . " (
				`id` INT(11) NULL DEFAULT '1',
				`language` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`sitename` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`siteowner` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`theme` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`charset` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
				`logo` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_swedish_ci',
				`showheaders` TINYINT(1) NOT NULL
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB");
		}
	}

	public static function read($db) {
		$configs = array();
		$result = $db->query('SELECT * FROM ' . Config::TABLENAME . ' WHERE `id`=1' );
		if( DB::hasRows($result)) {
			while( $row = DB::next($result) ) {
			$config = new Config($db);
			$config->language = $row['language'];
			$config->sitename = $row['sitename'];
			$config->siteowner = $row['siteowner'];
			$config->theme = $row['theme'];
			$config->charset = $row['charset'];
			$config->logo = $row['logo'];
			$config->showheaders = $row['showheaders'];
			array_push($configs,$config);
			}
		}
		return $configs;
	}

	public static function write($db, $config) {
		if( $db->rowExist(Config::TABLENAME,1) ) {
			$db->query('UPDATE ' . Config::TABLENAME . ' SET ' 
			. '`language`=' . DB::string($config->language) . ','
			. '`sitename`=' . DB::string($config->sitename) . ','
			. '`siteowner`=' . DB::string($config->siteowner) . ','
			. '`theme`=' . DB::string($config->theme) . ','
			. '`charset`=' . DB::string($config->charset) . ','
			. '`logo`=' . DB::string($config->logo) . ','
			. '`showheaders`=' . DB::bool($config->showheaders)  . ' ' 
			. 'WHERE `id`=1'); 
		}
		else {
			$db->query('INSERT INTO ' . Config::TABLENAME . ' ('
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
				. DB::string($config->language) . ','
				. DB::string($config->sitename) . ','
				. DB::string($config->siteowner) . ','
 				. DB::string($config->theme) . ','
				. DB::string($config->charset) . ','
				. DB::string($config->logo) . ','
				. DB::bool($config->showheaders) . ')');
			$config->id = $db->get_last_id();
		}
	}
}


function create_config($db, $language, $sitename, $siteowner,
	$theme,	$charset, $logo, $showheaders)
{
	$config = new Config($db);
	$config->language = $language;
	$config->sitename = $sitename;
	$config->siteowner = $siteowner;
	$config->theme = $theme;
	$config->charset = $charset;
	$config->logo = $logo;
	$config->showheaders = $showheaders;
	Config::write($db, $config);
	return $config->id;
}