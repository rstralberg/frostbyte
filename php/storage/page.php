<?php

require_once __DIR__ . "/db.php";

class Page
{
    public const TABLENAME = 'page';
    public $id;
    public $parent_id;
    public $pos;
    public $title;
    public $author;

    public function __construct($db)
    {
        $this->id = 0 ;
        $create = !$db->tableExist(Page::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Page::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `parent_id` INT(11) NOT NULL DEFAULT '0',
                `pos` INT(11) NOT NULL DEFAULT '0',
                `title` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `author` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                PRIMARY KEY (`id`) USING BTREE,
                INDEX `FK_parent_id` (`parent_id`) USING BTREE
            )
            COLLATE='utf8mb4_swedish_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $pages = array();
        $sql = 'SELECT * FROM ' . Page::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $page = new Page($db);
                $page->id = $row['id'];
                $page->parent_id = $row['parent_id'];
                $page->pos = $row['pos'];
                $page->title = $row['title'];
                $page->author = $row['author'];
                array_push($pages, $page );
            }
        }
        return $pages;
    }

    public static function write($db, $page)
    {
        if ($db->rowExist(Page::TABLENAME, $page->id)) {
            $db->query(
                'UPDATE ' . Page::TABLENAME . ' SET '
                    . '`parent_id`=' . $page->parent_id . ','
                    . '`pos`=' . $page->pos . ','
                    . '`title`=' . DB::string($page->title) . ','
                    . '`author`=' . DB::string($page->author) . ' '
                    . 'WHERE `id`=' . $page->id
            );
        } else {
            $db->query('INSERT INTO ' . Page::TABLENAME . ' (`parent_id`,`pos`,`title`,`author`) VALUES ('
                . $page->parent_id . ','
                . $page->pos . ','
                . DB::string($page->title) . ','
                . DB::string($page->author) . ')');
            $page->id = $db->get_last_id();
        }
    }

    public static function delete($db, $where)
    {
        $db->query(
            'DELETE FROM ' . Page::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_page($db, $title, $pos, $author, $parent_id) {
    $page = new Page($db);
    $page->parent_id = $parent_id;
    $page->title = $title;
    $page->pos = $pos;
    $page->author = $author;
    Page::write($db,$page);
    return $page->id;
}