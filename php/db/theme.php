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
    public $bg1;
    public $fg1;

    // navbar, footer 
    public $bg2;
    public $fg2;

    // hover colors
    public $bg3;
    public $fg3;

    // font
    public $font;
    public $fsize;

    // links
    public $links;

    // writable field colors
    public $bg4;
    public $fg4;
    public $bg4h;
    public $fg4h;

    // section colors
    public $bg5;
    public $fg5;
    public $bg5s;
    public $fg5s;

    // some specifics
    public $nav_fsize;
    public $nav_fweight;
    public $nav_border;
    public $footer_border;
    public $main_border;
    public $nav_shadow;
    public $footer_shadow;
    public $main_shadow;
    public $footer_fsize;
    public $footer_fstyle;
    public $title_fg;
}

function create_theme_table($db)
{
    $create = !$db->table_exist('theme');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `theme`  (
            `name` VARCHAR(50) NOT NULL,
            `bg1` VARCHAR(10) NOT NULL,
            `fg1` VARCHAR(10) NOT NULL,
            `bg2` VARCHAR(10) NOT NULL,
            `fg2` VARCHAR(10) NOT NULL,
            `bg3` VARCHAR(10) NOT NULL,
            `fg3` VARCHAR(10) NOT NULL,
            `font` VARCHAR(50) NOT NULL,
            `fsize` VARCHAR(10) NULL,
            `links` VARCHAR(10) NOT NULL,
            `bg4` VARCHAR(10) NOT NULL,
            `fg4` VARCHAR(10) NOT NULL,
            `bg4h` VARCHAR(10) NOT NULL,
            `fg4h` VARCHAR(10) NOT NULL,
            `bg5` VARCHAR(10) NOT NULL,
            `fg5` VARCHAR(10) NOT NULL,
            `bg5s` VARCHAR(10) NOT NULL,
            `fg5s` VARCHAR(10) NOT NULL,
            `nav_fsize` VARCHAR(10) NOT NULL,
            `nav_fweight` VARCHAR(10) NOT NULL,
            `nav_border` VARCHAR(10) NOT NULL,
            `footer_border` VARCHAR(10) NOT NULL,
            `main_border` VARCHAR(10) NOT NULL,
            `main_shadow` VARCHAR(30) NOT NULL,
            `nav_shadow` VARCHAR(30) NOT NULL,
            `footer_shadow` VARCHAR(30) NOT NULL,
            `footer_fsize` VARCHAR(10) NOT NULL,
            `footer_fstyle` VARCHAR(10) NOT NULL,
            `title_fg` VARCHAR(10) NOT NULL,
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
    $theme->bg1 = $res['bg1'];
    $theme->fg1 = $res['fg1'];
    $theme->bg2 = $res['bg2'];
    $theme->fg2 = $res['fg2'];
    $theme->bg3 = $res['bg3'];
    $theme->fg3 = $res['fg3'];
    $theme->font = $res['font'];
    $theme->fsize = $res['fsize'];
    $theme->links = $res['links'];
    $theme->bg4 = $res['bg4'];
    $theme->fg4 = $res['fg4'];
    $theme->bg4h = $res['bg4h'];
    $theme->fg4h = $res['fg4h'];
    $theme->bg5 = $res['bg5'];
    $theme->fg5 = $res['fg5'];
    $theme->bg5s = $res['bg5s'];
    $theme->fg5s = $res['fg5s'];
    $theme->nav_fsize = $res['nav_fsize'];
    $theme->nav_fweight = $res['nav_fweight'];
    $theme->nav_border = $res['nav_border'];
    $theme->footer_border = $res['footer_border'];
    $theme->main_border = $res['main_border'];
    $theme->nav_shadow = $res['nav_shadow'];
    $theme->footer_shadow = $res['footer_shadow'];
    $theme->main_shadow = $res['main_shadow'];
    $theme->footer_fsize = $res['footer_fsize'];
    $theme->footer_fstyle = $res['footer_fstyle'];
    $theme->title_fg = $res['title_fg'];
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
            . '`bg1`=' . db::string($theme->bg1) . ','
            . '`fg1`=' . db::string($theme->fg1) . ','
            . '`bg2`=' . db::string($theme->bg2) . ','
            . '`fg2`=' . db::string($theme->fg2) . ','
            . '`bg3`=' . db::string($theme->bg3) . ','
            . '`fg3`=' . db::string($theme->fg3) . ','
            . '`font`=' . db::string($theme->font) . ','
            . '`fsize`=' . db::string($theme->fsize) . ','
            . '`links`=' . db::string($theme->links) . ','
            . '`bg4`=' . db::string($theme->bg4) . ','
            . '`fg4`=' . db::string($theme->fg4) . ','
            . '`bg4h`=' . db::string($theme->bg4h) . ','
            . '`fg4h`=' . db::string($theme->fg4h) . ','
            . '`bg5`=' . db::string($theme->bg5) . ','
            . '`fg5`=' . db::string($theme->fg5) . ','
            . '`bg5s`=' . db::string($theme->bg5s) . ','
            . '`fg5s`=' . db::string($theme->fg5s) . ','
            . '`nav_fsize`=' . db::string($theme->nav_fsize) . ','
            . '`nav_fweight`=' . db::string($theme->nav_fweight) . ','
            . '`nav_border`=' . db::string($theme->nav_border) . ','
            . '`footer_border`=' . db::string($theme->footer_border) . ','
            . '`main_border`=' . db::string($theme->main_border) . ','
            . '`nav_shadow`=' . db::string($theme->nav_shadow) . ','
            . '`footer_shadow`=' . db::string($theme->footer_shadow) . ','
            . '`main_shadow`=' . db::string($theme->main_shadow) . ','
            . '`footer_fsize`=' . db::string($theme->footer_fsize) . ','
            . '`footer_fstyle`=' . db::string($theme->footer_fstyle) . ','
            . '`title_fg`=' . db::string($theme->title_fg) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `theme` ('
            . '`name`,'
            . '`bg1`,'
            . '`fg1`,'
            . '`bg2`,'
            . '`fg2`,'
            . '`bg3`,'
            . '`fg3`,'
            . '`font`,'
            . '`fsize`,'
            . '`links`,'
            . '`bg4`,'
            . '`fg4`,'
            . '`bg4h`,'
            . '`fg4h`,'
            . '`bg5`,'
            . '`fg5`,'
            . '`bg5s`,'
            . '`fg5s`,'
            . '`nav_fsize`,'
            . '`nav_fweight`,'
            . '`nav_border`,'
            . '`footer_border`,'
            . '`main_border`,'
            . '`nav_shadow`,'
            . '`footer_shadow`,'
            . '`main_shadow`,'
            . '`footer_fsize`,'
            . '`footer_fstyle`,'
            . '`title_fg`'
            . ' ) VALUES ('
            . db::string($theme->name) . ','
            . db::string($theme->bg1) . ','
            . db::string($theme->fg1) . ','
            . db::string($theme->bg2) . ','
            . db::string($theme->fg2) . ','
            . db::string($theme->bg3) . ','
            . db::string($theme->fg3) . ','
            . db::string($theme->font) . ','
            . db::string($theme->fsize) . ','
            . db::string($theme->links) . ','
            . db::string($theme->bg4) . ','
            . db::string($theme->fg4) . ','
            . db::string($theme->bg4h) . ','
            . db::string($theme->fg4h) . ','
            . db::string($theme->bg5) . ','
            . db::string($theme->fg5) . ','
            . db::string($theme->bg5s) . ','
            . db::string($theme->fg5s) . ','
            . db::string($theme->nav_fsize) . ','
            . db::string($theme->nav_fweight) . ','
            . db::string($theme->nav_border) . ','
            . db::string($theme->footer_border) . ','
            . db::string($theme->main_border) . ','
            . db::string($theme->nav_shadow) . ','
            . db::string($theme->footer_shadow) . ','
            . db::string($theme->main_shadow) . ','
            . db::string($theme->footer_fsize) . ','
            . db::string($theme->footer_fstyle) . ','
            . db::string($theme->title_fg) . ')');
    }
}

function create_theme(
    $db,
    $name,
    $bg1,
    $fg1,
    $bg2,
    $fg2,
    $bg3,
    $fg3,
    $font,
    $fsize,
    $links,
    $bg4,
    $fg4,
    $bg4h,
    $fg4h,
    $bg5,
    $fg5,
    $bg5s,
    $fg5s,
    $nav_fsize,
    $nav_fweight,
    $nav_border,
    $footer_border,
    $main_border,
    $nav_shadow,
    $footer_shadow,
    $main_shadow,
    $footer_fsize,
    $footer_fstyle,
    $title_fg
) {

    $theme = new theme($db);
    $theme->name = $name;
    $theme->bg1 = $bg1;
    $theme->fg1 = $fg1;
    $theme->bg2 = $bg2;
    $theme->fg2 = $fg2;
    $theme->bg3 = $bg3;
    $theme->fg3 = $fg3;
    $theme->font = $font;
    $theme->fsize = $fsize;
    $theme->links = $links;
    $theme->bg4 = $bg4;
    $theme->fg4 = $fg4;
    $theme->bg4h = $bg4h;
    $theme->fg4h = $fg4h;
    $theme->bg5 = $bg5;
    $theme->fg5 = $fg5;
    $theme->bg5s = $bg5s;
    $theme->fg5s = $fg5s;
    $theme->nav_fsize = $nav_fsize;
    $theme->nav_fweight = $nav_fweight;
    $theme->nav_border = $nav_border;
    $theme->footer_border = $footer_border;
    $theme->main_border = $main_border;
    $theme->nav_shadow = $nav_shadow;
    $theme->footer_shadow = $footer_shadow;
    $theme->main_shadow = $main_shadow;
    $theme->footer_fsize = $footer_fsize;
    $theme->footer_fstyle = $footer_fstyle;
    $theme->title_fg = $title_fg;
    write_theme($db, $theme, '`name`=' . db::string($name));
}

function drop_theme($db)
{
    $db->query('drop table `theme`');
}
