<?php
//  input:
//  id - int: id of the theme
//  values - array: all theme members
//
//  output:
//  success - boolean: true on success
//  id - int: id of the theme

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/theme.php';

function save_theme_handler() {
    
    $tokens = parse_GET(['id', 'values']);
	if ($tokens == null || count($tokens) == 0 ) {
        $response = [
            'success' => false
        ];
        echo( json_encode($response));
        return;
	}
		
	$id = GET_value($tokens, 'id');
	$values = GET_value($tokens, 'values');
	if (  $id == null || strlen($id)== 0 || 
		  $values == null || count($values) == 0) {
            $response = [
                'success' => false
            ];
            echo( json_encode($response));
            return;
    }

	$db = new DB();
	$db->connect();

	$theme  = new Theme($db);
    $theme->id = $values['id'];
    $theme->name = $values['name'];
    $theme->app = $values['app'];
    $theme->bar = $values['bar'];
    $theme->top = $values['top'];
    $theme->main = $values['main'];
    $theme->footer = $values['footer'];
    $theme->dlg = $values['dlg'];
    $theme->inp = $values['inp'];
    $theme->content_btn = $values['content_btn'];
    $theme->dialog_btn = $values['dialog_btn'];
    $theme->text = $values['text'];
    $theme->picture = $values['picture'];
    $theme->media = $values['media'];
    $theme->content_title = $values['content_title'];
    $theme->dialog_title = $values['dialog_title'];
    $theme->quote = $values['quote'];
    $theme->code = $values['code'];
    $theme->app_width = $values['app_width'];
    $theme->top_height = $values['top_height'];
    $theme->bottom_height = $values['bottom_height'];
	Theme::write($db, $theme);
	$db->disconnect();

    $response = [
        'success' => true,
        'id' => $theme->id
    ];
    echo( json_encode($response));
}


?>