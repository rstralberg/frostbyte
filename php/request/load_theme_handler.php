<?php 

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/theme.php';

//  input:
//  name - string: name of theme
//
//  output:
//  success - true | false
//  id - id of loaded theme
//
function load_theme_handler()
{
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

    $themes = Theme::read($db, '`name`=' . DB::string($name) );
    if( count($themes) === 0 ) {
        $db->disconnect();
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
    }

    $theme_id = $themes[0]->id;
    generate_style($db,$name);
    $db->disconnect();
    
    $response = [
        'success' => true,
        'id' => $theme_id
    ];
    echo( json_encode($response));

}