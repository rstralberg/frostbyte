<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/section.php';

//  input:
//  page_id - int: block id
//  block_id - int: block id
//  impl_id - int: impl id
//  text - string: html
//  align - string: align
//  opt  - string: options
//  pos - int: position
//
//  output:
//  success - true | false
//
function save_section_handler() {

	$values = parse_GET(['page_id', 'block_id', 'impl_id', 'text','align','opt','pos']);
	if ($values == null || count($values) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
    $page_id = GET_value($values, 'page_id');
    $block_id = GET_value($values, 'block_id');
    $impl_id = GET_value($values, 'impl_id');
    $text = GET_value($values, 'text');
    $align = GET_value($values,'align');
    $opt = GET_value($values, 'opt');
    $pos = GET_value($values, 'pos');

    $db = new DB();
    $db->connect();
    
    $text_id = save_section($db, $page_id, $block_id, $impl_id, $pos, $opt, $align, $text);

    $db->disconnect();

    $response = [
            'success' => true,
            'id' => $text_id
        ];
    echo( json_encode($response));
}
