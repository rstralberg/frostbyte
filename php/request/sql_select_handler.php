<?php

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';


function sql_select_handler() {
    if(isset($_GET['query'])  
    && str_starts_with( strtolower($_GET['query']), 'select')) {
        $db = new DB();
        $db->connect();

        $rows = array();
        $res = $db->query($_GET['query']);
        if( DB::hasRows($res)) {
            while( $row = DB::next($res)) {
                array_push($rows, $row);
            }
        }
        $db->disconnect();
        $result = [
            'success' => true,
            'rows' => $rows
        ];
        echo( json_encode($result));
    }
}

?>
