<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/media.php';

//  input:
//  page_id - int: page id
//  shadow - int: 0 or 1
//  url - string: media url
//  text - string: comment
//  align - string: left | center | right
//  type - string: audio | youtube | vimeo | video | soundcloud | spotify
//  pos - int: position
//
//  output:
//  success - true | false
//  id - id of created block
//
function create_media_handler() {

	$values = parse_GET(['page_id','shadow', 'align', 'url', 'text', 'type', 'pos']);
	if ($values == null || count($values) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
    $page_id = GET_value($values, 'page_id');
    $shadow = GET_value($values, 'shadow');
    $align = GET_value($values, 'align');
    $url = GET_value($values, 'url');
    $text = GET_value($values, 'text');
    $type = GET_value($values,'type');
    $pos = GET_value($values, 'pos');

    $db = new DB();
    $db->connect();
    
    $id = create_media($db, $page_id, $pos, $shadow, $url, $text, $type, $align);

    $db->disconnect();

    $response = [
            'success' => true,
            'id' => $id
        ];
    echo( json_encode($response));
}
