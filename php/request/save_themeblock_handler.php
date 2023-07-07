<?php
//  input:
//  id - int: id of the theme block
//  values - array: all theme block members
//
//  output:
//  success - boolean: true on success
//  id - int: id of the theme block

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/theme.php';
require_once __DIR__ . '/../utils.php';


function save_theme_block_handler()
{
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
    $jb = json_decode($values);
	if (  $id == null || strlen($id)== 0 ||  $jb == null) {
            $response = [
                'success' => false
            ];
            echo( json_encode($response));
            return;
    }

	$db = new DB();
	$db->connect();

	$block = new ThemeBlock($db);
    $block->id = $jb->id;
    $block->name = remove_quotes($jb->name);
    $block->bg = $jb->bg;
    $block->fg = $jb->fg;
    $block->hover_bg = $jb->hover_bg;
    $block->hover_fg = $jb->hover_fg;
    $block->active_bg = $jb->active_bg;
    $block->active_fg = $jb->active_fg;
    $block->disabled_bg = $jb->disabled_bg;
    $block->disabled_fg = $jb->disabled_fg;
    $block->border = $jb->border;
    $block->radius = $jb->radius;
    $block->font = remove_quotes($jb->font);
    $block->font_size = $jb->font_size;
    $block->font_weight = $jb->font_weight;
    $block->font_style = $jb->font_style;
    $block->shadow = $jb->shadow;
    ThemeBlock::write($db,$block);
	
	$db->disconnect();

    $response = [
        'success' => true,
        'id' => $block->id
    ];
    echo( json_encode($response));
}
