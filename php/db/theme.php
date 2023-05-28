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
    public $body;
    public $navbar;
    public $navlinks;
    public $footer;
    public $controls;
    public $inputs;
    public $block;
    public $left;
    public $right;
    public $panelarea;
    public $centerpanel;
    public $sidepanels;
    public $toolbar;
    public $tools;
}

function create_theme_table($db)
{
    $create = !$db->table_exist('theme');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `theme`  (
				`name` VARCHAR(30) NOT NULL,
				`body` TEXT NOT NULL,
				`navbar` TEXT NOT NULL,
				`navlinks` TEXT NOT NULL,
                `footer` TEXT NOT NULL,
                `controls` TEXT NOT NULL,
                `inputs` TEXT NOT NULL,
                `block` TEXT NOT NULL,
                `left` TEXT NOT NULL,
                `right` TEXT NOT NULL,
                `panelarea` TEXT NOT NULL,
                `centerpanel` TEXT NOT NULL,
                `sidepanels` TEXT NOT NULL,
                `toolbar` TEXT NOT NULL,
                `tools` TEXT NOT NULL,
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
    $theme->body = $res['body'];
    $theme->navbar = $res['navbar'];
    $theme->navlinks = $res['navlinks'];
    $theme->footer = $res['footer'];
    $theme->controls = $res['controls'];
    $theme->inputs = $res['inputs'];
    $theme->block = $res['block'];
    $theme->left = $res['left'];
    $theme->right = $res['right'];
    $theme->panelarea = $res['panelarea'];
    $theme->centerpanel = $res['centerpanel'];
    $theme->sidepanels = $res['sidepanels'];
    $theme->toolbar = $res['toolbar'];
    $theme->tools = $res['tools'];
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
            . '`body`=' . db::string($theme->body) . ','
            . '`navbar`=' . db::string($theme->navbar) . ','
            . '`navlinks`=' . db::string($theme->navlinks) . ','
            . '`footer`=' . db::string($theme->footer) . ','
            . '`controls`=' . db::string($theme->controls) . ','
            . '`inputs`=' . db::string($theme->inputs) . ','
            . '`block`=' . db::string($theme->block) . ','
            . '`left`=' . db::string($theme->left) . ','
            . '`right`=' . db::string($theme->right) . ','
            . '`panelarea`=' . db::string($theme->panelarea) . ','
            . '`centerpanel`=' . db::string($theme->centerpanel) . ','
            . '`sidepanels`=' . db::string($theme->sidepanels) . ','
            . '`toolbar`=' . db::string($theme->toolbar) . ','
            . '`tools`=' . db::string($theme->tools) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `theme` ('
            . '`name`,'
            . '`body`,'
            . '`navbar`,'
            . '`navlinks`,'
            . '`footer`,'
            . '`controls`,'
            . '`inputs`,'
            . '`block`,'
            . '`left`,'
            . '`right`,'
            . '`panelarea`,'
            . '`centerpanel`,'
            . '`sidepanels`,'
            . '`toolbar`,'
            . '`tools` )'
            . ' VALUES ('
            . db::string($theme->name) . ','
            . db::string($theme->body) . ','
            . db::string($theme->navbar) . ','
            . db::string($theme->navlinks) . ','
            . db::string($theme->footer) . ','
            . db::string($theme->controls) . ','
            . db::string($theme->inputs) . ','
            . db::string($theme->block) . ','
            . db::string($theme->left) . ','
            . db::string($theme->right) . ','
            . db::string($theme->panelarea) . ','
            . db::string($theme->centerpanel) . ','
            . db::string($theme->sidepanels) . ','
            . db::string($theme->toolbar) . ','
            . db::string($theme->tools) . ')');
    }
}

function create_theme(
    $db,
    $name,
    $body,
    $navbar,
    $navlinks,
    $footer,
    $controls,
    $inputs,
    $block,
    $left,
    $right,
    $panelarea,
    $centerpanel,
    $sidepanels,
    $toolbar,
    $tools,
) {
    $theme = new theme($db);
    $theme->name = $name;
    $theme->body = $body;
    $theme->navbar = $navbar;
    $theme->navlinks = $navlinks;
    $theme->footer = $footer;
    $theme->controls = $controls;
    $theme->inputs = $inputs;
    $theme->block = $block;
    $theme->left = $left;
    $theme->right = $right;
    $theme->panelarea = $panelarea;
    $theme->centerpanel = $centerpanel;
    $theme->sidepanels = $sidepanels;
    $theme->toolbar = $toolbar;
    $theme->tools = $tools;
    write_theme($db, $theme, '`name`=' . db::string($name));
}

function drop_theme($db)
{
    $db->query('drop table `theme`');
}


