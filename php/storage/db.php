<?php
require_once __DIR__ . '/../lexer.php';
require_once __DIR__ . '/../conf.php';

class DB {

	public $myscli;

	public function connect() {
		$myscli = mysqli_connect(CONF_HOST, CONF_DBUSER, CONF_DBPASSW);
		
		if ($myscli===null)
			die(Lexer::FAILED_TO_OPEN_DATABASE);
		mysqli_query($myscli, "CREATE DATABASE IF NOT EXISTS " . CONF_DATABASE);
		$myscli->close();
		$myscli = mysqli_connect(CONF_HOST, CONF_DBUSER, CONF_DBPASSW, CONF_DATABASE);
		if ($myscli->connect_error) {
			die(json_encode( ['error' => Lexer::FAILED_TO_OPEN_DATABASE . ': ' . $myscli->connect_error]));
		}
		
		mysqli_query($myscli, "USE " . CONF_DATABASE);
		$this->myscli = $myscli;
		return $myscli;
	}

	public function disconnect() {
		try {
			$this->myscli->close();
		}
		catch( Exception $e) {
			print_r($e->getMessage());
		}
	}

	public function get_last_id()
	{
		return $this->myscli->insert_id;
	}

	public function query($sql) {
		try {
			$res = mysqli_query($this->myscli, $sql);
			if ($res === FALSE) {
				return json_encode(['error' => Lexer::DATABASE_QUERY_FAILED . ': ' . $sql . ' ' . Lexer::ERROR . ': ' . $this->myscli->error]);
			}
			return $res;
		} 
		catch ( Exception $e) {
			return json_encode(['error' => Lexer::DATABASE_QUERY_FAILED . ': ' . $sql . ' ' . Lexer::ERROR . ': ' .  $e->getMessage()]);
		} 
	}

	public static function hasRows($query_result) {
		return $query_result && mysqli_num_rows($query_result) > 0;
	}

	public static function next($result) {
		return mysqli_fetch_assoc($result);
	}

	public function rowExist($table,$id) {
		$result = $this->query("SELECT COUNT(*) AS `numrows` FROM " . $table . " WHERE `id`=" . $id );
		$rows = $this->next($result);
		return (int)$rows["numrows"] > 0;
	}

	public function tableExist($table ) {
		$res = $this->query(
		'SELECT COUNT(*) as num
		FROM information_schema.TABLES 
		WHERE 
		TABLE_SCHEMA = "'.CONF_DATABASE.'" AND 
		TABLE_TYPE = "BASE TABLE" AND
		TABLE_NAME = '.DB::string($table) );

		if( $this->hasRows($res)) {
			$r = $this->next($res);
			return $r['num'] !== '0';
		}
		else {
			return false ;
		}
	}

	public static function nullSafe($value) {
		return $value === null ? 'NULL' : $value;
	}

	public static function string($str) {
		if( is_array($str) || is_object($str)) {
			die( Lexer::STRING_CONVERSION_FAILED . ': ' . var_export($str) );
		}
		if( $str ) return "'".$str."'";
		else return "'NULL'";
	}

	public static function bool($value) {
		return $value ? 'true' : 'false';
	}
}
