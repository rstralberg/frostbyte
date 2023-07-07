<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/block.php";

class Header
{
    public const TABLENAME = 'header';
    public $id;
    public $block_id;
    public $text;

    public function __construct($db)
    {
        $this->id = 0;
        $create = !$db->tableExist(Header::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Header::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `text` VARCHAR(50) NOT NULL  COLLATE 'utf8mb4_swedish_ci',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $headers = array();
        $sql = 'SELECT * FROM ' . Header::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $header = new Header($db);
                $header->id = $row['id'];
                $header->block_id = $row['block_id'];
                $header->text = $row['text'];
                array_push($headers, $header );
            }
        }
        return $headers;
    }

    public static function write($db, $header)
    {
        if ($db->rowExist(Header::TABLENAME, $header->id)) {
            $db->query(
                'UPDATE ' . Header::TABLENAME . ' SET '
                . '`block_id`=' . $header->block_id . ','
                . '`text`=' . DB::string($header->text) . ' '
                . 'WHERE `id`=' . $header->id
            );
            return $header->id;
        } else {
            $db->query('INSERT INTO ' . Header::TABLENAME . ' (
                `block_id`,
                `text`
                ) VALUES (' .
                $header->block_id . ',' .
                DB::string($header->text) . ')');
            $header->id = $db->get_last_id();
            return $header->id;
        }
    }

    public static function delete($db,$where)
    {
        $db->query(
            'DELETE FROM ' . Header::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_header($db, $page_id, $pos, $align, $title )
{
    $block_id = create_block($db, 'header', $page_id, $pos, $align );
    $txt = new Header($db);
    $txt->text = $title;
    $txt->block_id = $block_id;
    Header::write($db,$txt);
    set_block_implementation($db,$block_id,$txt->id);
    return $txt->id;
}

function save_header($db, $page_id, $block_id, $impl_id, $pos, $align, $title )
{
    $block_id = save_block($db, $block_id, $page_id, $impl_id, 'header', $pos, $align );
    $texts = Header::read($db, 'id=' . $impl_id );
    $id = 0 ;
    if( count($texts) === 0 ) {
        $t = new Header($db);
        $t->block_id = $block_id;
        $t->text = $title;
        $id = Header::write($db,$t);
    }
    else {
        $texts[0]->block_id = $block_id;
        $texts[0]->text = $title;
        $id = Header::write($db,$texts[0]);
    }
    set_block_implementation($db,$block_id,$id);
    return $id;
}



