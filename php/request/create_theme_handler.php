<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/theme.php';

//  input:
//  name - string: name of theme
//
//  output:
//  success - true | false
//  id - id of created theme
//
function create_theme_handler() {

	$values = parse_GET(['name']);
	if ($values == null || count($values) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
    $name = GET_value($values, 'name');

    $db = new DB();
    $db->connect();
    $theme_id = create_theme_and_blocks($db, $name);
    generate_style($db, $name);
    $db->disconnect();

    $response = [
            'success' => true,
            'id' => $theme_id
        ];
    echo( json_encode($response));
}
