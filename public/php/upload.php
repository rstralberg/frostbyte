<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Handle A Upload Of A File
// - se public/js/upload.js

function upload_response($success, $message)
{
    header('Content-Type: application/json');
    $response = ['success' => $success, 'data' => $message];
    echo (json_encode($response));
}

if (!isset($_FILES['file'])) {
    upload_response(false, 'No file is given in upload!');
    return;
}

if (!isset($_POST['page'])) {
    upload_response(false, 'Page is missing in upload. Each upload must belong to a page');
    return;
}
$page = $_POST['page'];

if (!isset($_POST['title'])) {
    upload_response(false, 'Title is missing in upload. Each upload must have a title');
    return;
}

$title = $_POST['title'];

$filename = $_FILES['file']['name'];
$filetmp = $_FILES['file']['tmp_name'];

$media = __DIR__ . '/../uploads/';
if (!is_dir($media)) {
    mkdir($media);
}   
$subdir = $page == 0 ? 'shared/' : $page . '/';;
$media .= $subdir;
if (!is_dir($media)) {
    mkdir($media);
}

$to = $media . $title ;
$success = move_uploaded_file($filetmp, $to);
upload_response($success, '/uploads' . '/' . $subdir . $title );
