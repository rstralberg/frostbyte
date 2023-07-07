<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/block.php";

class Section
{
    public const TABLENAME = 'section';
    public $id;
    public $block_id;
    public $text;
    public $opt;

    public function __construct($db)
    {
        $this->id = 0;
        $create = !$db->tableExist(Section::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Section::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `text` TEXT NOT NULL  COLLATE 'utf8mb4_swedish_ci',
                `opt` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $texts = array();
        $sql = 'SELECT * FROM ' . Section::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $text = new Section($db);
                $text->id = $row['id'];
                $text->block_id = $row['block_id'];
                $text->text = $row['text'];
                $text->opt = $row['opt'];
                array_push($texts, $text );
            }
        }
        return $texts;
    }

    public static function write($db, $section)
    {
        if ($db->rowExist(Section::TABLENAME, $section->id)) {
            $db->query(
                'UPDATE ' . Section::TABLENAME . ' SET '
                . '`block_id`=' . $section->block_id . ','
                . '`text`=' . DB::string($section->text) . ' '
                . '`opt`=' . DB::string($section->opt) . ' '
                . 'WHERE `id`=' . $section->id
            );
            return $section->id;
        } else {
            $db->query('INSERT INTO ' . Section::TABLENAME . ' (
                `block_id`,
                `text`,
                `opt` 
                ) VALUES (' .
                $section->block_id . ',' .
                DB::string($section->text) . ',' .
                DB::string($section->opt) . ')');
            $section->id = $db->get_last_id();
            return $section->id;
        }
    }

    public static function delete($db,$where)
    {
        $db->query(
            'DELETE FROM ' . Section::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_section($db, $page_id, $pos, 
                    $opt, $align, $text )
{
    $block_id = create_block($db, 'section', $page_id, $pos, $align );
    $section = new Section($db);
    $section->text = $text;
    $section->block_id = $block_id;
    $section->opt = $opt;
    $id = Section::write($db,$section);
    set_block_implementation($db,$block_id,$id);
    return $id;
}

function save_section($db, $page_id, $block_id, $impl_id, $pos, 
                    $opt, $align, $text )
{
    $block_id = save_block($db, $block_id, $page_id, $impl_id, 'text', $pos, $align );
    $sections = Section::read($db, 'id=' . $impl_id );
    $id = 0 ;
    if( count($sections) === 0 ) {
        $section = new Section($db);
        $section->block_id = $block_id;
        $section->opt = $opt;
        $section->text = $text;
        $id = Section::write($db,$section);
    }
    else {
        $section = $sections[0];
        $section->block_id = $block_id;
        $section->opt = $opt;
        $section->text = $text;
        $id = Section::write($db,$section);
    }
    set_block_implementation($db,$block_id,$id);
    return $id;
}



