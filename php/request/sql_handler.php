<?php

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';

/*
    table: string
    cols: columns [{ "name": <column>, "value": <value> }]
    where: where condition  [{ "name": <column>, "value": <value> }] without 'where'
    order: '' or order condition without 'order by' 
*/
function sql_handler()
{

    $values = parse_GET(['action', 'table', 'cols', 'where', 'order']);
    if ($values == null || count($values) == 0) {
        $response = [
            'success' => false
        ];
        echo (json_encode($response));
        return;
    }
    $action = GET_value($values, 'action');
    $table = GET_value($values, 'table');
    $cols = json_decode(GET_value($values, 'cols'));
    $where = json_decode(GET_value($values, 'where'));
    $order = json_decode(GET_value($values, 'order'));


    $db = new DB();
    $db->connect();

    $response = null;
    switch ($action) {
        case 'insert':
            $response = sql_insert($db, $table, $cols);
            break;

        case 'update':
            $response = sql_update($db, $table, $cols, $where);
            break;

        case 'delete':
            $response = sql_delete($db, $table, $where);
            break;

        case 'select':
            $response = sql_select($db, $table, $cols, $where, $order);
            break;

        default:
            $response = [
                'success' => false,
                'message' => 'SQL: Unknown action ' . $action
            ];
            break;
    }
    $db->disconnect();
    echo (json_encode($response));
}

function sql_insert($db, $table, $cols)
{
    if ($table === null or strlen($table) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant INSERT without a table name'
        ];
    }

    if ($cols === null || count($cols) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant INSERT without any column values'
        ];
    }

    $query = 'insert into ' . sql_name($table) . ' (';
    foreach ($cols as $c) {
        $query .= sql_name($c['name']) . ',';
    }
    $query = substr($query, 0, strlen($query) - 1);
    $query .= ') values (';

    foreach ($cols as $c) {
        $query .= sql_value($c) . ',';
    }
    $query = substr($query, 0, strlen($query) - 1);
    $query .= ')';

    $db->query($query);
    $id = $db->get_last_id();

    return [
        'success' => true,
        'message' => ['id' => $id]
    ];
}

function sql_update($db, $table, $cols, $where)
{
    if ($table === null || strlen($table) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant UPDATE without a table name'
        ];
    }

    if ($cols === null || count($cols) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant UPDATE without any column values'
        ];
    }

    $query = 'update ' . sql_name($table) . ' set ';
    foreach ($cols as $c) {
        $query .= sql_name($c->name) . '=' . sql_value($c) . ',';
    }
    $query = substr($query, 0, strlen($query) - 1);
    
    if ($where === null || count($where) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant UPDATE without a where clause'
        ];
    }
    $query .= sql_where($where);

    $db->query($query);
    return [
        'success' => true,
        'message' => ''
    ];
}

function sql_delete($db, $table, $where)
{
    if ($table === null or strlen($table) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant DELETE without a table name'
        ];
    }

    if ($where === null || count($where) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant DELETE without a where clause'
        ];
    }

    $query = 'delete from ' . sql_name($table) . ' ';
    $query .= sql_where($where);

    $db->query($query);
    return [
        'success' => true,
        'message' => ''
    ];
}

function sql_select($db, $table, $cols, $where, $order)
{
    if ($table === null || strlen($table) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant SELECT without a table name'
        ];
    }

    if ($cols === null || count($cols) === 0) {
        return [
            'success' => false,
            'message' => 'SQL: Cant SELECT without any column values'
        ];
    }

    $query = '';
    if ($cols[0]->name === '*') {
        $query .= 'select *';    
    }
    else {
        $query .= 'select ' ;
        foreach ($cols as $c) {
            $query .= sql_name($c->name)  . ',';
        }
        $query = substr($query, 0, strlen($query) - 1);
    }
    $query .= ' from ' . sql_name($table) . ' ';
    
    if( $where !== null && count($where)>0) {
        $query .= sql_where($where);
    }

    if ($order !== null && count($order) > 0) {
        $query .= sql_order_by($order);
    }

    $res = $db->query($query);
        if( !DB::hasRows($res) ) {
        return [
            'success' => false,
            'message' => ''
        ];
    }
    $ar = array();
    while( $data = DB::next($res) )
    {
        array_push($ar, $data);
    }

    return [
        'success' => true,
        'message' => json_encode($ar)
    ];
}

function sql_name($name)
{
    return '`' . $name . '`';
}

function sql_value($v) {
    switch( $v->type ) {
        case 'number':
            return (int)$v->value;
            
        default:
        case 'string':
            return DB::string($v->value);
    }
}

 
function sql_where($where)
{
    if( $where === null || count($where) === 0 ) {
        return '';
    }

    $query = ' where ';
    $last_w = null;
    foreach($where as $w) {
        $query .= sql_name($w->name) . '=' . sql_value($w) . ' ' . $w->next . ' ';
        $last_w = $w;
    }
    $query = substr($query, 0, strlen($query) - strlen($last_w->next) - 2  );
    return $query;
}

function sql_order_by($order)
{
    if( $order === null || count($order) === 0 ) {
        return '';
    }

    $query = ' order by ';
    foreach($order as $w) {
        $query .= sql_name($w->name) . ' ' . $w->sort . ',';
    }
    $query = substr($query, 0, strlen($query) - 1  );
    return $query;
}