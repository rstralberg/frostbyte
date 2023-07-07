<?php

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';

function sql_update_handler() {
    if(isset($_GET['query'])  
    && str_starts_with( strtolower($_GET['query']), 'update')) {
        $db = new DB();
        $db->connect();

        $db->query($_GET['query']);

        $db->disconnect();

        $response = [
            'success' => true
        ];
        echo( json_encode($response));
    }
}


?>
