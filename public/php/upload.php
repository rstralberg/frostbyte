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


if( $_FILES) {

    if( !isset($_POST['page']) ) {
        echo( json_encode( [
            'success' => false,
            'data' => 'Page is missing in upload. Each upload must belong to a page'
        ]));
        exit(0); 
    }
    $page = $_POST['page'];

    if( !isset($_POST['title']) ) {
        echo( json_encode( [
            'success' => false,
            'data' => 'Title is missing in upload. Each upload must have a title'
        ]));
        exit(0); 
    }
    $title = $_POST['title'];

    if( !isset($_FILES['file']['name']) ) {
        echo( json_encode( [
            'success' => false,
            'data' => 'No file is given in upload!'
        ]));
        exit(0); 
    }

    $filename = $_FILES['file']['name'];
    $filetmp = $_FILES['file']['tmp_name'];

    $media = __DIR__ . '/../uploads/';
    if( !is_dir($media)) {
        mkdir($media);
    }
    $media .= $page . '/';
    if( !is_dir($media)) {
        mkdir($media);
    }
    $ext = pathinfo(basename($filename), PATHINFO_EXTENSION);
    $to = $media . $title . '.' . strtolower($ext);
    $success = move_uploaded_file($filetmp, $to) ;
    echo( json_encode([
        'success' => $success,
        'data' => 'uploads/' . $page . '/' . $title . '.' . strtolower($ext)
    ]));
    exit(0);
}
