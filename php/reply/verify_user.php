<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Verify User Request 
// - 
// - 

require_once __DIR__ . '/sql_utils.php';
require_once __DIR__ . '/../db/db.php';
require_once __DIR__ . '/../db/user.php';

function verify_user($args)
{
    $params = json_decode(json_encode($args));
    if (!sql_verify(['username', 'password'], $params)) {
        return sql_fail('Parameters missing in verify_user');
    }

    $username = sql_get($params, 'username');
    $password =  sql_get($params, 'password');
    
    $result = sql_fail('Login failed');
    $db = new DB();
    $db->connect();
    if( verifyPassword($db, $username, $password) ) {
        $result = sql_success('');
    }
    $db->disconnect();
    return $result;
}
