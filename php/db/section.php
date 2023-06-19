<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Defines A Page Content section 
//   
require_once __DIR__ . '/db.php';

class section
{
    public $id;
    public $page_id;
    public $type;
    public $height;
    public $pos;
    public $content;
}

function create_section_table($db)
{
    $create = !$db->table_exist('section');
    if ($create) {
        $db->query(
            "CREATE TABLE `section` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `page_id` int(11) NOT NULL,
                `type` varchar(30) NOT NULL,
                `height` int(11) NOT NULL DEFAULT 20,
                `pos` int(11) NOT NULL DEFAULT 0,
                `content` text NOT NULL,
                PRIMARY KEY (`id`),
                KEY `section_FK` (`page_id`),
                CONSTRAINT `section_FK` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci"
        );
    }
}

function result_to_section($db, $res)
{
    $section = new section($db);
    $section->id = $res['id'];
    $section->page_id = $res['page_id'];
    $section->type = $res['type'];
    $section->height = $res['height'];
    $section->pos = $res['pos'];
    $section->content = $res['content'];
    return $section;
}

function read_section($db, $where, $pos, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `section`', $where, $pos), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_section($db, $result);
        } else if ($mode === dbmode::multi) {
            $sections  = array();
            foreach ($result as $res) {
                array_push($sections, result_to_section($db, $res));
            }
            return $sections;
        }
    }
    return null;
}

function write_section($db, $section, $where)
{
    if ($db->row_exist('section', $where)) {
        $db->query('UPDATE `section` SET '
            . '`page_id`=' . $section->page_id . ','
            . '`type`=' . db::string($section->type) . ','
            . '`height`=' . $section->height . ','
            . '`pos`=' . $section->pos . ','
            . '`content`=' . db::string($section->content) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `section` ('
            . '`page_id`,'
            . '`type`,'
            . '`height`,'
            . '`pos`,'
            . '`content`'
            . ' ) VALUES ('
            . $section->page_id . ','
            . db::string($section->type) . ','
            . $section->height . ','
            . $section->pos . ','
            . db::string($section->content) . ')');
    }
}

function create_section(
    $db,
    $page_id,
    $type,
    $height,
    $pos,
    $content ) {
    $section = new section($db);
    $section->page_id = $page_id;
    $section->type = $type;
    $section->height = $height;
    $section->pos  = $pos;
    $section->content = $content;
    
    write_section($db, $section, 'id=0');
}

function drop_section($db)
{
    $db->query('drop table `section`');
}
