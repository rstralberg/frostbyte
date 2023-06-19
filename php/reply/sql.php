<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Pure Sql QUERY Request 
// - 
// - 

require_once __DIR__ . '/../utils.php';
require_once __DIR__ . '/sql_utils.php';
require_once __DIR__ . '/../db/db.php';

function sql($query)
{
    $db = new DB();
    $db->connect();

    try {
        $res = $db->query($query,  dbmode::multi);
        if ($res === null && str_starts_with($query,'select') )
            $result = sql_fail($res);
        else
            $result = sql_success($res);
    } catch (Exception $e) {
        dump($e->getMessage());
        $result = sql_fail($e->getMessage());
    }

    $db->disconnect();
    return $result;
}
