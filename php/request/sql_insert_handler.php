<?php

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';

function sql_insert_handler() {
    if(isset($_GET['query'])  
    && str_starts_with( strtolower($_GET['query']), 'insert')) {
        $db = new DB();
        $db->connect();

        $id = 0 ;
        if( $db->query($_GET['query'])) {
            $id = $db->get_last_id();
        }
        $db->disconnect();
        $response = [
            'success' => $id > 0 ,
            'id' => $id
        ];
        echo( json_encode($response ) );
        exit(0);
    }
}


?>
