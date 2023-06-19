<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Defines A Page
// - Has a title, position and is the container 
//   of all sections in the page
//   
require_once __DIR__ . '/db.php';

class page
{
    public $id;
    public $parent;
    public $title;
    public $author;
    public $pos;
}

function create_page_table($db)
{
    $create = !$db->table_exist('page');
    if ($create) {
        $db->query(
            "CREATE TABLE `page` (
                 `id` int(11) NOT NULL AUTO_INCREMENT,
                `parent` int(11) DEFAULT 0,
                `title` varchar(50) NOT NULL,
                `author` varchar(50) NOT NULL,
                `pos` int(11) NOT NULL,
                PRIMARY KEY (`id`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci"
        );
    }
}

function result_to_page($db, $res)
{
    $page = new page($db);
    $page->id = $res['id'];
    $page->parent = $res['parent'];
    $page->title = $res['title'];
    $page->author = $res['author'];
    $page->pos = $res['pos'];
    return $page;
}


function read_page($db, $where, $pos, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM page', $where, $pos), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_page($db, $result);
        } else if ($mode === dbmode::multi) {
            $pages  = array();
            foreach ($result as $res) {
                array_push($pages, result_to_page($db, $res));
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
            . '`parent`=' . $page->parent . ','
            . '`title`=' . db::string($page->title) . ','
            . '`author`=' . db::string($page->author) . ','
            . '`pos`=' . $page->pos . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `page` ('
            . '`parent`,'
            . '`title`,'
            . '`author`,'
            . '`pos`'        
            . ' ) VALUES ('
            . $page->parent . ','
            . db::string($page->title) . ','
            . db::string($page->author) . ','
            . $page->pos . ')');
    }
}

function create_page(
    $db,
    $parent,
    $title,
    $author,
    $pos ) {
    $page = new page($db);
    $page->parent = $parent;
    $page->title = $title;
    $page->author = $author;
    $page->pos = $pos;
    write_page($db, $page, 'id=0');
    return $db->get_last_id();
}

function drop_page($db)
{
    $db->query('drop table page');
}
