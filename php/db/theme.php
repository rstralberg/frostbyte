<?php

// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Defines Web Site Theme
// - Implemented by setting css --variables
// - Generates css file theme.css
// - Each theme col is in Json-format

require_once __DIR__ . '/db.php';

class theme
{
    public $name;

    // overall colors
    public $background;
    public $color;

    // navbar, footer 
    public $bars_background;
    public $bars_color;

    // hover colors
    public $intense_background;
    public $intense_color;

    // font
    public $font;
    public $fsize;

    // links
    public $links;

    // writable field colors
    public $titles_background;
    public $titles_color;
    public $ctl_background_hover;
    public $ctl_color_hover;
    public $ctl_background_active;
    public $ctl_color_active;

    // section colors
    public $section_background;
    public $section_color;
    public $section_selected_background;
    public $section_selected_color;

    // blog colors
    public $button_background;
    public $button_color;

    // some specifics
    public $nav_fsize;
    public $nav_fweight;
    public $nav_border;
    public $footer_border;
    public $main_border;
    public $nav_radius;
    public $footer_radius;
    public $main_radius;
    public $shadow_size;
    public $nav_shadow;
    public $footer_shadow;
    public $main_shadow;
    public $footer_fsize;
    public $footer_fstyle;
    public $title_fg;
    public $more_shadow;
}

function create_theme_table($db)
{
    $create = !$db->table_exist('theme');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `theme`  (
            `name` VARCHAR(50) NOT NULL,
            `background` VARCHAR(10) NOT NULL,
            `color` VARCHAR(10) NOT NULL,
            `bars_background` VARCHAR(10) NOT NULL,
            `bars_color` VARCHAR(10) NOT NULL,
            `intense_background` VARCHAR(10) NOT NULL,
            `intense_color` VARCHAR(10) NOT NULL,
            `font` VARCHAR(50) NOT NULL,
            `fsize` VARCHAR(10) NULL,
            `links` VARCHAR(10) NOT NULL,
            `titles_background` VARCHAR(10) NOT NULL,
            `titles_color` VARCHAR(10) NOT NULL,
            `ctl_background_hover` VARCHAR(10) NOT NULL,
            `ctl_color_hover` VARCHAR(10) NOT NULL,
            `ctl_background_active` VARCHAR(10) NOT NULL,
            `ctl_color_active` VARCHAR(10) NOT NULL,
            `section_background` VARCHAR(10) NOT NULL,
            `section_color` VARCHAR(10) NOT NULL,
            `section_selected_background` VARCHAR(10) NOT NULL,
            `section_selected_color` VARCHAR(10) NOT NULL,
            `button_background` VARCHAR(10) NOT NULL,
            `button_color` VARCHAR(10) NOT NULL,
            `nav_fsize` VARCHAR(10) NOT NULL,
            `nav_fweight` VARCHAR(10) NOT NULL,
            `nav_border` VARCHAR(50) NOT NULL,
            `footer_border` VARCHAR(50) NOT NULL,
            `main_border` VARCHAR(50) NOT NULL,
            `nav_radius` VARCHAR(10) NOT NULL,
            `footer_radius` VARCHAR(10) NOT NULL,
            `main_radius` VARCHAR(10) NOT NULL,
            `shadow_size` VARCHAR(10) NOT NULL,
            `main_shadow` VARCHAR(30) NOT NULL,
            `nav_shadow` VARCHAR(30) NOT NULL,
            `footer_shadow` VARCHAR(30) NOT NULL,
            `footer_fsize` VARCHAR(10) NOT NULL,
            `footer_fstyle` VARCHAR(10) NOT NULL,
            `title_fg` VARCHAR(10) NOT NULL,
            `more_shadow` VARCHAR(10) NOT NULL,
            PRIMARY KEY (`name`) USING BTREE,
            INDEX `pk` (`name`) USING BTREE
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB"
        );
    }
}

function result_to_theme($db, $res)
{
    $theme = new theme($db);
    $theme->name = $res['name'];
    $theme->background = $res['background'];
    $theme->color = $res['color'];
    $theme->bars_background = $res['bars_background'];
    $theme->bars_color = $res['bars_color'];
    $theme->intense_background = $res['intense_background'];
    $theme->intense_color = $res['intense_color'];
    $theme->font = $res['font'];
    $theme->fsize = $res['fsize'];
    $theme->links = $res['links'];
    $theme->titles_background = $res['titles_background'];
    $theme->titles_color = $res['titles_color'];
    $theme->ctl_background_hover = $res['ctl_background_hover'];
    $theme->ctl_color_hover = $res['ctl_color_hover'];
    $theme->ctl_background_active = $res['ctl_background_active'];
    $theme->ctl_color_active = $res['ctl_color_active'];
    $theme->section_background = $res['section_background'];
    $theme->section_color = $res['section_color'];
    $theme->section_selected_background = $res['section_selected_background'];
    $theme->section_selected_color = $res['section_selected_color'];
    $theme->button_background = $res['button_background'];
    $theme->button_color = $res['button_color'];
    $theme->nav_fsize = $res['nav_fsize'];
    $theme->nav_fweight = $res['nav_fweight'];
    $theme->nav_border = $res['nav_border'];
    $theme->footer_border = $res['footer_border'];
    $theme->main_border = $res['main_border'];
    $theme->nav_radius = $res['nav_radius'];
    $theme->footer_radius = $res['footer_radius'];
    $theme->main_radius = $res['main_radius'];
    $theme->shadow_size = $res['shadow_size'];
    $theme->nav_shadow = $res['nav_shadow'];
    $theme->footer_shadow = $res['footer_shadow'];
    $theme->main_shadow = $res['main_shadow'];
    $theme->footer_fsize = $res['footer_fsize'];
    $theme->footer_fstyle = $res['footer_fstyle'];
    $theme->title_fg = $res['title_fg'];
    $theme->more_shadow = $res['more_shadow'];
    return $theme;
}

function read_theme($db, $where, $order, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `theme`', $where, $order), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_theme($db, $result);
        } else if ($mode === dbmode::multi) {
            $themes  = array();
            foreach ($result as $res) {
                array_push($themes, result_to_theme($db, $res));
            }
            return $themes;
        }
    }
    return null;
}

function write_theme($db, $theme, $where)
{
    if ($db->row_exist('`theme`', $where)) {
        $db->query('UPDATE `theme` SET '
            . '`name`=' . db::string($theme->name) . ','
            . '`background`=' . db::string($theme->background) . ','
            . '`color`=' . db::string($theme->color) . ','
            . '`bars_background`=' . db::string($theme->bars_background) . ','
            . '`bars_color`=' . db::string($theme->bars_color) . ','
            . '`intense_background`=' . db::string($theme->intense_background) . ','
            . '`intense_color`=' . db::string($theme->intense_color) . ','
            . '`font`=' . db::string($theme->font) . ','
            . '`fsize`=' . db::string($theme->fsize) . ','
            . '`links`=' . db::string($theme->links) . ','
            . '`titles_background`=' . db::string($theme->titles_background) . ','
            . '`titles_color`=' . db::string($theme->titles_color) . ','
            . '`ctl_background_hover`=' . db::string($theme->ctl_background_hover) . ','
            . '`ctl_color_hover`=' . db::string($theme->ctl_color_hover) . ','
            . '`ctl_background_active`=' . db::string($theme->ctl_background_active) . ','
            . '`ctl_color_active`=' . db::string($theme->ctl_color_active) . ','
            . '`section_background`=' . db::string($theme->section_background) . ','
            . '`section_color`=' . db::string($theme->section_color) . ','
            . '`section_selected_background`=' . db::string($theme->section_selected_background) . ','
            . '`section_selected_color`=' . db::string($theme->section_selected_color) . ','
            . '`button_background`=' . db::string($theme->button_background) . ','
            . '`button_color`=' . db::string($theme->button_color) . ','
            . '`nav_fsize`=' . db::string($theme->nav_fsize) . ','
            . '`nav_fweight`=' . db::string($theme->nav_fweight) . ','
            . '`nav_border`=' . db::string($theme->nav_border) . ','
            . '`footer_border`=' . db::string($theme->footer_border) . ','
            . '`main_border`=' . db::string($theme->main_border) . ','
            . '`nav_radius`=' . db::string($theme->nav_radius) . ','
            . '`footer_radius`=' . db::string($theme->footer_radius) . ','
            . '`main_radius`=' . db::string($theme->main_radius) . ','
            . '`shadow_size`=' . db::string($theme->shadow_size) . ','
            . '`nav_shadow`=' . db::string($theme->nav_shadow) . ','
            . '`footer_shadow`=' . db::string($theme->footer_shadow) . ','
            . '`main_shadow`=' . db::string($theme->main_shadow) . ','
            . '`footer_fsize`=' . db::string($theme->footer_fsize) . ','
            . '`footer_fstyle`=' . db::string($theme->footer_fstyle) . ','
            . '`title_fg`=' . db::string($theme->title_fg) . ','
            . '`more_shadow`=' . db::string($theme->more_shadow) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `theme` ('
            . '`name`,'
            . '`background`,'
            . '`color`,'
            . '`bars_background`,'
            . '`bars_color`,'
            . '`intense_background`,'
            . '`intense_color`,'
            . '`font`,'
            . '`fsize`,'
            . '`links`,'
            . '`titles_background`,'
            . '`titles_color`,'
            . '`ctl_background_hover`,'
            . '`ctl_color_hover`,'
            . '`ctl_background_active`,'
            . '`ctl_color_active`,'
            . '`section_background`,'
            . '`section_color`,'
            . '`section_selected_background`,'
            . '`section_selected_color`,'
            . '`button_background`,'
            . '`button_color`,'
            . '`nav_fsize`,'
            . '`nav_fweight`,'
            . '`nav_border`,'
            . '`footer_border`,'
            . '`main_border`,'
            . '`nav_radius`,'
            . '`footer_radius`,'
            . '`main_radius`,'
            . '`shadow_size`,'
            . '`nav_shadow`,'
            . '`footer_shadow`,'
            . '`main_shadow`,'
            . '`footer_fsize`,'
            . '`footer_fstyle`,'
            . '`title_fg`,'
            . '`more_shadow`'
            . ' ) VALUES ('
            . db::string($theme->name) . ','
            . db::string($theme->background) . ','
            . db::string($theme->color) . ','
            . db::string($theme->bars_background) . ','
            . db::string($theme->bars_color) . ','
            . db::string($theme->intense_background) . ','
            . db::string($theme->intense_color) . ','
            . db::string($theme->font) . ','
            . db::string($theme->fsize) . ','
            . db::string($theme->links) . ','
            . db::string($theme->titles_background) . ','
            . db::string($theme->titles_color) . ','
            . db::string($theme->ctl_background_hover) . ','
            . db::string($theme->ctl_color_hover) . ','
            . db::string($theme->ctl_background_active) . ','
            . db::string($theme->ctl_color_active) . ','
            . db::string($theme->section_background) . ','
            . db::string($theme->section_color) . ','
            . db::string($theme->section_selected_background) . ','
            . db::string($theme->section_selected_color) . ','
            . db::string($theme->button_background) . ','
            . db::string($theme->button_color) . ','
            . db::string($theme->nav_fsize) . ','
            . db::string($theme->nav_fweight) . ','
            . db::string($theme->nav_border) . ','
            . db::string($theme->footer_border) . ','
            . db::string($theme->main_border) . ','
            . db::string($theme->nav_radius) . ','
            . db::string($theme->footer_radius) . ','
            . db::string($theme->main_radius) . ','
            . db::string($theme->shadow_size) . ','
            . db::string($theme->nav_shadow) . ','
            . db::string($theme->footer_shadow) . ','
            . db::string($theme->main_shadow) . ','
            . db::string($theme->footer_fsize) . ','
            . db::string($theme->footer_fstyle) . ','
            . db::string($theme->title_fg) . ','
            . db::string($theme->more_shadow) . ')');
    }
}

function create_theme(
    $db,
    $name,
    $background,
    $color,
    $bars_background,
    $bars_color,
    $intense_background,
    $intense_color,
    $font,
    $fsize,
    $links,
    $titles_background,
    $titles_color,
    $ctl_background_hover,
    $ctl_color_hover,
    $ctl_background_active,
    $ctl_color_active,
    $section_background,
    $section_color,
    $section_selected_background,
    $section_selected_color,
    $button_background,
    $button_color,
    $nav_fsize,
    $nav_fweight,
    $nav_border,
    $footer_border,
    $main_border,
    $nav_radius,
    $footer_radius,
    $main_radius,
    $shadow_size,
    $nav_shadow,
    $footer_shadow,
    $main_shadow,
    $footer_fsize,
    $footer_fstyle,
    $title_fg,
    $more_shadow,
) {

    $theme = new theme($db);
    $theme->name = $name;
    $theme->background = $background;
    $theme->color = $color;
    $theme->bars_background = $bars_background;
    $theme->bars_color = $bars_color;
    $theme->intense_background = $intense_background;
    $theme->intense_color = $intense_color;
    $theme->font = $font;
    $theme->fsize = $fsize;
    $theme->links = $links;
    $theme->titles_background = $titles_background;
    $theme->titles_color = $titles_color;
    $theme->ctl_background_hover = $ctl_background_hover;
    $theme->ctl_color_hover = $ctl_color_hover;
    $theme->ctl_background_active = $ctl_background_active;
    $theme->ctl_color_active = $ctl_color_active;
    $theme->section_background = $section_background;
    $theme->section_color = $section_color;
    $theme->section_selected_background = $section_selected_background;
    $theme->section_selected_color = $section_selected_color;
    $theme->button_background = $button_background;
    $theme->button_color = $button_color;
    $theme->nav_fsize = $nav_fsize;
    $theme->nav_fweight = $nav_fweight;
    $theme->shadow_size = $shadow_size;
    $theme->nav_border = $nav_border;
    $theme->footer_border = $footer_border;
    $theme->main_border = $main_border;
    $theme->nav_radius = $nav_radius;
    $theme->footer_radius = $footer_radius;
    $theme->main_radius = $main_radius;
    $theme->nav_shadow = $nav_shadow;
    $theme->footer_shadow = $footer_shadow;
    $theme->main_shadow = $main_shadow;
    $theme->footer_fsize = $footer_fsize;
    $theme->footer_fstyle = $footer_fstyle;
    $theme->title_fg = $title_fg;
    $theme->more_shadow = $more_shadow;
    write_theme($db, $theme, '`name`=' . db::string($name));
}

function drop_theme($db)
{
    $db->query('drop table `theme`');
}
