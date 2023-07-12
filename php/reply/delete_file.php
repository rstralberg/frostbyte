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

function delete_file($req)
{
    $params = json_decode(json_encode($req));
    if( $params  && $params->file ) {

        $parts = explode('/', urldecode($params->file));
//      http://localhost:8080/uploads/1/<file>
//      
        $file = __DIR__ . '/../../public/';
        for( $i=0; $i < count($parts); $i++ ){
            if( $parts[$i] == 'uploads') {
                for( ; $i < count($parts); $i++ ) {
                    $file .= $parts[$i] . '/';
                }
                break;
            }
        }
        $file = substr($file, 0, strlen($file)-1);
        if ( file_exists($file)) {
            if( unlink($file) ) {
                return sql_success($file . ' raderades');
            }
        }
    }
    return sql_fail('Kunde inte hitta eller radera filen ' . $params->file);
}
