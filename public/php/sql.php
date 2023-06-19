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

require_once __DIR__ . '/../../php/utils.php';
require_once __DIR__ . '/../../php/reply/sql.php';
require_once __DIR__ . '/../../php/reply/verify_user.php';


$requestBody = file_get_contents('php://input');
$req = json_decode($requestBody, true);

$type = $req['type'];
if($type===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'SQL fråga saknar type']);
    exit(0);
}

$query = $req['query'];
if($query===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'SQL frågan har inget innehåll']);
    exit(0);
}

try {
    $response = sql($type,$query);
    header('Content-Type: application/json');
    echo json_encode($response);
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
