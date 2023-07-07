<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/section.php';

//  input:
//  id - int: page id
//  text - string: html
//  align - string: align
//  opt  - string: options
//  pos - int: position
//
//  output:
//  success - true | false
//  id - id of created block
//
function create_section_handler() {

	$values = parse_GET(['id','text','align','opt','pos']);
	if ($values == null || count($values) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
    $id = GET_value($values, 'id');
    $text = GET_value($values, 'text');
    $align = GET_value($values,'align');
    $opt = GET_value($values, 'opt');
    $pos = GET_value($values, 'pos');

    $db = new DB();
    $db->connect();
    
    $text_id = create_section($db, $id, $pos, $opt, $align, $text );

    $db->disconnect();

    $response = [
            'success' => true,
            'id' => $text_id
        ];
    echo( json_encode($response));
}
