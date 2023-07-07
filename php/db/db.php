<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Database Managent
// - Create Database and Tables
// - Add and Delete Tables
// - Execute Querys on Tables

require_once __DIR__ . '/../config.php';

enum dbmode
{
	case single;
	case multi;
	case none;
};

class db
{

	private $myscli;

	public function connect()
	{
		$myscli = mysqli_connect(CONF_HOST, CONF_USER, CONF_DBPASSW);

		if ($myscli === null) {
			throw new Exception('MySQL connection failed');
		}
		mysqli_query($myscli, "CREATE DATABASE IF NOT EXISTS " . CONF_DATABASE);
		$myscli->close();
		$myscli = mysqli_connect(CONF_HOST, CONF_USER, CONF_DBPASSW, CONF_DATABASE);
		if ($myscli->connect_error) {
			throw new Exception('Failed to open database ' . CONF_DATABASE . ': ' . $myscli->connect_error);
		}

		mysqli_query($myscli, "USE " . CONF_DATABASE);
		$this->myscli = $myscli;
		return $myscli;
	}

	public function disconnect()
	{
		$this->myscli->close();
	}

	public function get_last_id()
	{
		return $this->myscli->insert_id;
	}

	public function query($sql, $mode = dbmode::none)
	{
		$res = null;
		try {
			$res = mysqli_query($this->myscli, $sql);
		} catch (Exception $e) {
			dump('PHP: Undantagsfel i databasen för  [' . $sql . '] ' . $e->getMessage());
			return null;
		}
		if ($res === false)
			return null;

		if (str_starts_with($sql, 'update') || str_starts_with($sql, 'delete')) {
			return true;
		}
		if (str_starts_with($sql, 'insert')) {
			return $this->get_last_id();
		}
		if ($mode == dbmode::single) {
			return mysqli_fetch_assoc($res);
		} else if ($mode == dbmode::multi) {
			$rows = array();
			while ($row = mysqli_fetch_assoc($res)) {
				array_push($rows, $row);
			}
			return $rows;
		}
	}

	public static function has_rows($query_result)
	{
		return $query_result && mysqli_num_rows($query_result) > 0;
	}

	public static function next($result)
	{
		return mysqli_fetch_assoc($result);
	}

	public function row_exist($table, $where)
	{
		$result = mysqli_query($this->myscli, "SELECT COUNT(*) AS `numrows` FROM " . $table . " WHERE " . $where);
		if ($result === false) return false;
		return (int)mysqli_fetch_assoc($result)['numrows'] > 0;
	}

	public function table_exist($table)
	{
		$res = mysqli_query($this->myscli, "SELECT count(*)
		FROM information_schema.tables
		WHERE table_schema = '" . CONF_DATABASE . "' 
		AND table_name = '" . $table . "'");
		if ($res === false) return false;
		if (mysqli_num_rows($res) === 0) return false;
		$data = mysqli_fetch_assoc($res);
		if ($data === null) return false;
		return $data['count(*)'] > 0;
	}

	public static function null_safe($value)
	{
		return $value === null ? 'NULL' : $value;
	}

	public static function string($str)
	{
		if (is_array($str) || is_object($str)) {
			throw new Exception('String conversion failed : ' . $str);
		}
		if ($str) return "'" . $str . "'";
		else return "'NULL'";
	}

	public static function encode_string($str) {
		return db::string(rawurlencode($str));
	}

	public static function decode_string($str) {
		return rawurldecode($str);
	}

	public static function bool($value)
	{
		return $value ? 'true' : 'false';
	}

	public static function build_query($stmt, $where = null, $order = null)
	{
		$query = $stmt;
		if ($where != null) {
			$query .= ' where ' . $where;
		}
		if ($order != null) {
			$query .= ' order by ' . $order;
		}
		return $query;
	}
}
