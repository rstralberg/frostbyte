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

function upload($req)
{
    
    if ($_FILES) {

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

        if (!isset($_FILES['file'])) {
            upload_response(false, 'No file is given in upload!');
            return;
        }

        $filename = $_FILES['file']['name'];
        $filetmp = $_FILES['file']['tmp_name'];

        $media = __DIR__ . '/../uploads/';
        if (!is_dir($media)) {
            mkdir($media);
        }
        $media .= $page . '/';
        if (!is_dir($media)) {
            mkdir($media);
        }
        $ext = pathinfo(basename($filename), PATHINFO_EXTENSION);
        $to = $media . $title . '.' . strtolower($ext);
        $success = move_uploaded_file($filetmp, $to);
        upload_response( $success, 'uploads/' . $page . '/' . $title . '.' . strtolower($ext));
    }
}
