<?php
// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// HELPFUL SQL FUNCTIONS
// - 
// - 
function sql_verify($array,$parameters ) {
    
    $count = 0;
    foreach($parameters as $p ) {
        foreach( $array as $expr) {
            $count += $p->key === $expr ? 1 : 0;
        }
    }
    return $count === count($array);
}

function sql_get($parameters, $name) {
    foreach($parameters as $p ) {
        if( $p->key === $name ) {
            return $p->value;
        }
    }
    throw new Exception('Unknown parameter ' + $name + ' requested');
}

function sql_fail($message) 
{
    return json_encode([
        'success' => false,
        'data' => $message
    ]);
}

function sql_success($data) 
{
    return json_encode([
        'success' => true,
        'data' => $data
    ]);
}

function sql_mode($mode) {
    switch((int)$mode) {
        case 0: return dbmode::single;
        case 1: return dbmode::multi;
        case 2: return dbmode::none;
    }
    throw new Exception('Unknown sql mode ' + $mode + ' in request');
}
?>
