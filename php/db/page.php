<?php
// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// DEFINES A PAGE
// - Has a title, position and is the container 
//   of all Blocks in the page
//   
require_once __DIR__ . '/db.php';

class page
{
    public $title;
    public $name;
    public $parent;
    public $index;
    public $isHome;
}

function create_page_table($db)
{
    $create = !$db->table_exist('page');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `page`  (
				`title` VARCHAR(50) NOT NULL,
				`name` VARCHAR(30) NOT NULL,
				`parent` VARCHAR(30) NOT NULL DEFAULT '',
				`index` INT NOT NULL,
				`ishome` TINYINT NOT NULL,
                PRIMARY KEY (`title`) USING BTREE,
                INDEX `pk` (`title`) USING BTREE
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB"
        );
    }
}

function result_to_page($db, $res)
{
    $page = new page($db);
    $page->title = $res['title'];
    $page->name = $res['name'];
    $page->parent = $res['parent'];
    $page->index = (int)$res['index'];
    $page->isHome = $res['ishome'] != '0';
    return $page;
}


function read_page($db, $where, $order, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM page', $where, $order), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_page($db, $result);
        } else if ($mode === dbmode::multi) {
            $pages  = array();
            foreach ($result as $res) {
                array_push($pages, result_to_page($db, $result));
            }
            return $pages;
        }
    }
    return null;
}

function write_page($db, $page, $where)
{
    if ($db->row_exist('page', $where)) {
        $db->query('UPDATE `page` SET '
            . '`title`=' . db::string($page->title) . ','
            . '`name`=' . db::string($page->name) . ','
            . '`parent`=' . db::string($page->parent) . ','
            . '`index`=' . (int)$page->index . ','
            . '`ishome`=' . $page->isHome ? 1 : 0 . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `page` ('
            . '`title`,'
            . '`name`,'
            . '`parent`,'
            . '`index`,'
            . '`ishome` )'
            . ' VALUES ('
            . db::string($page->title) . ','
            . db::string($page->name) . ','
            . db::string($page->parent) . ','
            . (int)$page->index . ','
            . ($page->isHome ? 1 : 0) . ')');
    }
}

function create_page(
    $db,
    $title,
    $name,
    $parent,
    $index,
    $isHome
) {
    $page = new page($db);
    $page->title = $title;
    $page->name = $name;
    $page->parent = $parent;
    $page->index = (int)$index;
    $page->isHome = $isHome;
    write_page($db, $page, '`title`=' . db::string($title));
}

function drop_page($db)
{
    $db->query('drop table page');
}
