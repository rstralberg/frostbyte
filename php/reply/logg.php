<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Client writes to logger
// - 
// - 

require_once __DIR__ . '/../logger.php';
require_once __DIR__ . '/../db/user.php';

function logg($msg)
{
    logger_on();
    $res = logger($msg);
    logger_off();
    return $res ? sql_success('') : sql_fail('');
}
