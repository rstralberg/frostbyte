<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/page.php';
require_once __DIR__ . '/../storage/section.php';

//  input:
//  name - string: name of page
//  text - string: defailt text in page
//
//  output:
//  success - true | false
//  id - id of created page
//

function new_page_handler() {

	$values = parse_GET(['title','pos','username','text','parent_id']);
	if ($values == null || count($values) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
    $title = GET_value($values, 'title');
    $pos = GET_value($values, 'pos');
    $username = GET_value($values, 'usename');
    $text = GET_value($values, 'text');
    $parent_id = GET_value($values, 'parent_id');

    $db = new DB();
    $db->connect();

    $page_id = create_page($db, $title, $pos, $username, $parent_id);
    create_section($db,$page_id,0,'','left',$text);
    
    $db->disconnect();

    $response = [
            'success' => true,
            'id' => $page_id
        ];
    echo( json_encode($response));
}



?>