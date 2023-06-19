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

function verify_user($req)
{
    $params = json_decode(json_encode($req));
    
    $result = sql_fail('Login failed');
    $db = new DB();
    $db->connect();
    if( verifyPassword($db, $params->username, $params->password) ) {
        $user = read_user($db, null, null, dbmode::single);
        if( $user ) {
            $result = sql_success($user->username);
        }
    }
    $db->disconnect();
    return $result;
}
