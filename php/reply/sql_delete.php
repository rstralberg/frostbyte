<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Sql Delete Request 
// - 
// - 

require_once __DIR__ . '/sql_utils.php';
require_once __DIR__ . '/../db/db.php';

function sql_delete($args)
{
    $params = json_decode(json_encode($args));
    if (!sql_verify(['table', 'where'], $params)) {
        return sql_fail('Parameters missing in sql_delete');
    }

    $table = sql_get($params, 'table');
    $where =  sql_get($params, 'where');

    $db = new DB();
    $db->connect();

    try {
        $query = 'delete from `' . $table . '` ';
        if (gettype($where) == 'string' && strlen($where) > 0) {
            $query .= ' where ' . $where;
        }

        $res = $db->query($query, dbmode::none);
        $result = sql_success($res);
    } catch (Exception $e) {
        $result = sql_fail($e->getMessage());
    }

    $db->disconnect();
    return $result;
}
