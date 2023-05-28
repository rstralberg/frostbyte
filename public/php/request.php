
<?php

require_once __DIR__ . '/../../php/reply/sql_read.php';
require_once __DIR__ . '/../../php/reply/sql_write.php';
require_once __DIR__ . '/../../php/reply/sql_delete.php';
require_once __DIR__ . '/../../php/reply/verify_user.php';


$requestBody = file_get_contents('php://input');
$req = json_decode($requestBody, true);

$func = $req['func'];
if($func===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'Function name missing i server request']);
    exit(0);
}

$args = $req['args'];
if($args===null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'data' => 'Arguments missing i server request']);
    exit(0);
}

try {
    $response = $func($args);
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
