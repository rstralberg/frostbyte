<?php

require_once __DIR__ . "/db.php";

class ThemeBlock
{
	public const TABLENAME = 'themeblock';
	public $id;
    public $name;
    public $bg;
    public $fg;
    public $hover_bg;
    public $hover_fg;
    public $active_bg;
    public $active_fg;
    public $disabled_bg;
    public $disabled_fg;
    public $border;
    public $radius;
    public $font;
    public $font_size;
    public $font_weight;
    public $font_style;
    public $shadow;

	public function __construct($db)
	{
		$this->id = 0;
		$create = !$db->tableExist(ThemeBlock::TABLENAME);
		if ($create) {

			$db->query("CREATE TABLE " . ThemeBlock::TABLENAME . " (
				`id` INT(11) NOT NULL AUTO_INCREMENT,
				`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',

				-- Application
				`bg` VARCHAR(30) NOT NULL,
				`fg` VARCHAR(30) NOT NULL,
				`hover_bg` VARCHAR(30) NOT NULL,
				`hover_fg` VARCHAR(30) NOT NULL,
				`active_bg` VARCHAR(30) NOT NULL,
				`active_fg` VARCHAR(30) NOT NULL,
				`disabled_bg` VARCHAR(30) NOT NULL,
				`disabled_fg` VARCHAR(30) NOT NULL,
				`border` VARCHAR(50) NOT NULL,
				`radius` VARCHAR(10) NOT NULL,
				`font` VARCHAR(50) NOT NULL,
				`font_size` VARCHAR(10) NOT NULL,
				`font_weight` VARCHAR(30) NOT NULL,
				`font_style` VARCHAR(30) NOT NULL,
				`shadow` TINYINT NOT NULL,
				
				PRIMARY KEY (`id`) USING BTREE
			)
			COLLATE='utf8mb4_general_ci'
			ENGINE=InnoDB
			AUTO_INCREMENT=3");

		}
	}


	public static function read($db, $where = null, $order = null)
    {
        $blocks = array();
        $sql = 'SELECT * FROM ' . ThemeBlock::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query( $sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $block = new ThemeBlock($db);
				$block->id = $row['id'];
				$block->name = $row['name'];
				$block->bg = $row['bg'];
				$block->fg = $row['fg'];
				$block->hover_bg = $row['hover_bg'];
				$block->hover_fg = $row['hover_fg'];
				$block->active_bg = $row['active_bg'];
				$block->active_fg = $row['active_fg'];
				$block->disabled_bg = $row['disabled_bg'];
				$block->disabled_fg = $row['disabled_fg'];
				$block->border = $row['border'];
				$block->radius = $row['radius'];
				$block->font = $row['font'];
				$block->font_size = $row['font_size'];
				$block->font_weight = $row['font_weight'];
				$block->font_style = $row['font_style'];
				$block->shadow = $row['shadow'];
				array_push($blocks,$block);
			}
		}
        return $blocks;
	}
    
	public static function write($db, $theme)  {
		if ($db->rowExist( ThemeBlock::TABLENAME, $theme->id)) {
            $db->query(
                'UPDATE ' . ThemeBlock::TABLENAME . ' SET ' .
				'`name`=' . DB::string($theme->name) . ',' .
				'`bg`=' . DB::string($theme->bg) . ',' .
				'`fg`=' . DB::string($theme->fg) . ',' .
				'`hover_bg`=' . DB::string($theme->hover_bg) . ',' .
				'`hover_fg`=' . DB::string($theme->hover_fg) . ',' .
				'`active_bg`=' . DB::string($theme->active_bg) . ',' .
				'`active_fg`=' . DB::string($theme->active_fg) . ',' .
				'`disabled_bg`=' . DB::string($theme->disabled_bg) . ',' .
				'`disabled_fg`=' . DB::string($theme->disabled_fg) . ',' .
				'`border`=' . DB::string($theme->border) . ',' .
				'`radius`=' . DB::string($theme->radius) . ',' .
				'`font`=' . DB::string($theme->font) . ',' .
				'`font_size`=' . DB::string($theme->font_size) . ',' .
				'`font_weight`=' . DB::string($theme->font_weight) . ',' .
				'`font_style`=' . DB::string($theme->font_style) . ',' .
				'`shadow`=' . $theme->shadow . ' ' .
				'WHERE `id`=' . $theme->id );
        } else {
            $db->query('INSERT INTO ' . ThemeBlock::TABLENAME . ' (' .
							'`name`,' .
							'`bg`,' .
							'`fg`,' .
							'`hover_bg`,' .
							'`hover_fg`,' .
							'`active_bg`,' .
							'`active_fg`,' .
							'`disabled_bg`,' .
							'`disabled_fg`,' .
							'`border`,' .
							'`radius`,' .
							'`font`,' .
							'`font_size`,' .
							'`font_weight`,' .
							'`font_style`,' .
							'`shadow`)' .
							' VALUES (' .
							DB::string($theme->name) . ',' .
							DB::string($theme->bg) . ',' .
							DB::string($theme->fg) . ',' .
							DB::string($theme->hover_bg) . ',' .
							DB::string($theme->hover_fg) . ',' .
							DB::string($theme->active_bg) . ',' .
							DB::string($theme->active_fg) . ',' .
							DB::string($theme->disabled_bg) . ',' .
							DB::string($theme->disabled_fg) . ',' .
							DB::string($theme->border) . ',' .
							DB::string($theme->radius) . ',' .
							DB::string($theme->font) . ',' .
							DB::string($theme->font_size) . ',' .
							DB::string($theme->font_weight) . ',' .
							DB::string($theme->font_style) . ',' .
							$theme->shadow . ')');

            $theme->id = $db->get_last_id();
        }
	}
	
    public static function delete($db, $where) {
        $db->query(
            'DELETE FROM ' . ThemeBlock::TABLENAME . ' WHERE ' . $where);
    }
}

function create_theme_block($db, $name,
			$bg, $fg,
			$hover_bg,$hover_fg,
			$active_bg, $active_fg,
			$disabled_bg, $disabled_fg,
			$border, $radius,
			$font, $font_size, $font_weight, $font_style,
			$shadow)
{
	$block = new ThemeBlock($db);
	$block->name = $name;
	$block->bg = $bg;
	$block->fg = $fg;
	$block->hover_bg = $hover_bg;
	$block->hover_fg = $hover_fg;
	$block->active_bg = $active_bg;
	$block->active_fg = $active_fg;
	$block->disabled_bg = $disabled_bg;
	$block->disabled_fg = $disabled_fg;
	$block->border = $border;
	$block->radius = $radius;
	$block->font = $font;
	$block->font_size = $font_size;
	$block->font_weight = $font_weight;
	$block->font_style = $font_style;
	$block->shadow = $shadow;
	ThemeBlock::write($db, $block);
	return $block->id;
}

function generate_block_style($blocks) {
	if( count($blocks) === 0) {
		die( 'Cant generate theme styles' );
	}
	$block = $blocks[0];
	$prefix = $block->name;
	$style = '';
	$style .= '--' . $prefix . '_name:' . DB::string($block->name) . ';';
	$style .= '--' . $prefix . '_id:' . $block->id . ';';
	$style .= '--' . $prefix . '_bg:' . $block->bg . ';';
	$style .= '--' . $prefix . '_fg:' . $block->fg . ';';
	$style .= '--' . $prefix . '_hover_bg:' . $block->hover_bg . ';';
	$style .= '--' . $prefix . '_hover_fg:' . $block->hover_fg . ';';
	$style .= '--' . $prefix . '_active_bg:' . $block->active_bg . ';';
	$style .= '--' . $prefix . '_active_fg:' . $block->active_fg . ';';
	$style .= '--' . $prefix . '_disabled_bg:' . $block->disabled_bg . ';';
	$style .= '--' . $prefix . '_disabled_fg:' . $block->disabled_fg . ';';
	$style .= '--' . $prefix . '_border:' . $block->border . ';';
	$style .= '--' . $prefix . '_radius:' . $block->radius . ';';
	$style .= '--' . $prefix . '_font:"' . $block->font . '";';
	$style .= '--' . $prefix . '_font_size:' . $block->font_size . ';';
	$style .= '--' . $prefix . '_font_weight:' . $block->font_weight . ';';
	$style .= '--' . $prefix . '_font_style:' . $block->font_style . ';';
	$style .= '--' . $prefix . '_shadow:' . $block->shadow . ';';
	return $style;
}
