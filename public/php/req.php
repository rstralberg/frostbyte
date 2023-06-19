<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Request From Jscript Client
// - se public/js/request.js

require_once __DIR__ . '/../../php/reply/logg.php';
require_once __DIR__ . '/../../php/reply/sql.php';
require_once __DIR__ . '/../../php/reply/verify_user.php';
require_once __DIR__ . '/../../php/reply/upload.php';

$requestBody = file_get_contents('php://input');
$reqbody = json_decode($requestBody, true);

$func = $reqbody['func'];
if($func===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'Func missing i server req request']);
    exit(0);
}

$req = $reqbody['req'];
if($req===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'Req missing i server req request']);
    exit(0);
}

try {
    $response = $func($req);
    header('Content-Type: application/json');
    echo $response;
    exit(0);
}
catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode( [
        'success' => false,
        'data' => $e->getMessage()
    ]);
    exit(0);
}
