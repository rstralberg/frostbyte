<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Sql Insert/Update Request 
// - 
// - 

require_once __DIR__ . '/sql_utils.php';
require_once __DIR__ . '/../db/db.php';

function sql_write($args)
{
    $params = json_decode(json_encode($args));
    if (!sql_verify(['table', 'cols', 'values', 'where'], $params)) {
        return sql_fail('Parameters missing in sql_write');
    }

    $table = sql_get($params, 'table');
    $cols =  sql_get($params, 'cols');
    $values =  sql_get($params, 'values');
    $where =  sql_get($params, 'where');

    $db = new DB();
    $db->connect();

    if ($db->row_exist($table, $where)) {
        try {
            $query = 'update `' . $table . '` set ';
            for ($i = 0; $i < count($cols); $i++) {
                $query .= '`' . $cols[$i] . '`=' . $values[$i] . ',';
            }
            $query[strlen($query) - 1] = ' ';

            if (gettype($where) == 'string' && strlen($where) > 0) {
                $query .= ' where ' . $where;
            }

            $res = $db->query($query, dbmode::none);
            $result = sql_success($res);
        } catch (Exception $e) {
            $result = sql_fail($e->getMessage());
        }
    } else {
        try {
            $query = 'insert into `' . $table . '` (';
            for ($i = 0; $i < count($cols); $i++) {
                $query .= '`' . $cols[$i] . '`,';
            }
            $query[strlen($query) - 1] = ' ';
            $query .= ') values (';
            for ($i = 0; $i < count($cols); $i++) {
                $query .= $values[$i] . ',';
            }
            $query[strlen($query) - 1] = ')';
            $res = $db->query($query, dbmode::none);
            $result = sql_success($res);
        } catch (Exception $e) {
            $result = sql_fail($e->getMessage());
        }
    }

    $db->disconnect();
    return $result;
}
