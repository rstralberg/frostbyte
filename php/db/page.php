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
    public $showtitle;
    public $blog;
    public $blogheader;
    public $host;
}

function create_page_table($db)
{
    $create = !$db->table_exist('page');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `page` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `parent` int(11) DEFAULT 0,
                `title` varchar(50) NOT NULL,
                `author` varchar(50) NOT NULL,
                `pos` int(11) NOT NULL,
                `showtitle` tinyint NOT NULL,
                `blog` tinyint NOT NULL,
                `blogheader` text NOT NULL,
                `host` tinyint NOT NULL,
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
    $page->showtitle = $res['showtitle'];
    $page->blog = $res['blog'];
    $page->blogheader = $res['blogheader'];
    $page->host = $res['host'];
    return $page;
}

function get_first_page($db) {
    $result = $db->query('SELECT * FROM page ORDER BY `pos` LIMIT 1', dbmode::single);
    if ($result) {
        return result_to_page($db, $result);
    }
    return null;

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
            . '`pos`=' . $page->pos . ','
            . '`showtitle`=' . $page->showtitle . ','
            . '`blog`=' . $page->blog . ','
            . '`blogheader`=' . $page->blogheader . ','
            . '`host`=' . $page->host . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `page` ('
            . '`parent`,'
            . '`title`,'
            . '`author`,'
            . '`pos`,'        
            . '`showtitle`,'        
            . '`blog`,'        
            . '`blogheader`,'        
            . '`host`'        
            . ' ) VALUES ('
            . $page->parent . ','
            . db::string($page->title) . ','
            . db::string($page->author) . ','
            . $page->pos . ','
            . ($page->showtitle?1:0) . ','
            . ($page->blog?1:0) . ','
            . db::string($page->blogheader) . ','
            . ($page->host?1:0) . ')');
    }
}

function create_page(
    $db,
    $parent,
    $title,
    $author,
    $pos, 
    $blog,
    $blogheader,
    $showtitle,
    $host ) {
    $page = new page($db);
    $page->parent = $parent;
    $page->title = $title;
    $page->author = $author;
    $page->pos = $pos;
    $page->blog = $blog;
    $page->blogheader = $blogheader;
    $page->showtitle = $showtitle;
    $page->host = $host;
    write_page($db, $page, 'id=0');
    return $db->get_last_id();
}

function drop_page($db)
{
    $db->query('drop table page');
}
