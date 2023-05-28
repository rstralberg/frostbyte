<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Sql Select Request 
// - 
// - 

require_once __DIR__ . '/sql_utils.php';
require_once __DIR__ . '/../db/db.php';

function sql_read($args) {
    $params = json_decode(json_encode($args));
    if( !sql_verify(['mode','table','cols','where','order'],$params) ) {
        return sql_fail('Parameters missing in sql_read');
    }

    $mode = sql_mode(sql_get($params,'mode'));
    $table = sql_get($params,'table');
    $cols =  sql_get($params,'cols');
    $where =  sql_get($params,'where');
    $order = sql_get($params, 'order');

    $db = new DB();
    $db->connect();

    try {
        $query = 'select ';
        for( $i = 0; $i < count($cols); $i++ ) {
            $query .= '`' . $cols[$i] . '`,';
        }
        $query[strlen($query)-1] = ' ';
        $query .= ' from ' . $table . ' ';
        if( $where && gettype($where) == 'string' && strlen($where) > 0) {
            $query .= ' where ' . $where;
        }
        if( $order && gettype($order) == 'string' && strlen($order) > 0) {
            $query .= ' order by ' . $order;
        }
    
        $res = $db->query($query, $mode);
        $result = sql_success($res);
    }
    catch( Exception $e) {
        $result = sql_fail($e->getMessage());
    }
    
    $db->disconnect();
    return $result ;
}
