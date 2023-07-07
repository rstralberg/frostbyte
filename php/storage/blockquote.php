<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/block.php";

class Blockquote
{
    public const TABLENAME = 'blockquote';
    public $id;
    public $block_id;
    public $quote;

    public function __construct($db)
    {
        $this->id = 0;
        $create = !$db->tableExist(Blockquote::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Blockquote::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `quote` TEXT NOT NULL  COLLATE 'utf8mb4_swedish_ci',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $blockquotes = array();
        $sql = 'SELECT * FROM ' . Blockquote::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $blockquote = new Blockquote($db);
                $blockquote->id = $row['id'];
                $blockquote->block_id = $row['block_id'];
                $blockquote->quote = $row['quote'];
                array_push($blockquotes, $blockquote );
            }
        }
        return $blockquotes;
    }

    public static function write($db, $blockquote)
    {
        if ($db->rowExist(Blockquote::TABLENAME, $blockquote->id)) {
            $db->query(
                'UPDATE ' . Blockquote::TABLENAME . ' SET '
                . '`block_id`=' . $blockquote->block_id . ','
                . '`quote`=' . DB::string($blockquote->quote) . ' '
                . 'WHERE `id`=' . $blockquote->id
            );
            return $blockquote->id;
        } else {
            $db->query('INSERT INTO ' . Blockquote::TABLENAME . ' (
                `block_id`,
                `quote`
                ) VALUES (' .
                $blockquote->block_id . ',' .
                DB::string($blockquote->quote) . ')');
            $blockquote->id = $db->get_last_id();
            return $blockquote->id;
        }
    }

    public static function delete($db,$where)
    {
        $db->query(
            'DELETE FROM ' . Blockquote::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_blockquote($db, $page_id, $pos, $align, $quote )
{
    $block_id = create_block($db, 'blockquote', $page_id, $pos, $align );
    $blockquote = new Blockquote($db);
    $blockquote->quote = $quote;
    $blockquote->block_id = $block_id;
    $id = Blockquote::write($db,$blockquote);
    set_block_implementation($db,$block_id,$id);
    return $id;
}

function save_blockquote($db, $page_id, $block_id, $impl_id, $pos, $align, $quote )
{
    $block_id = save_block($db, $block_id, $page_id, $impl_id, 'blockquote', $pos, $align );
    $blockquotes = Blockquote::read($db, 'id=' . $impl_id );
    $id = 0 ;
    if( count($blockquotes) === 0 ) {
        $t = new Blockquote($db);
        $t->block_id = $block_id;
        $t->quote = $quote;
        $id = Blockquote::write($db,$t);
    }
    else {
        $blockquotes[0]->block_id = $block_id;
        $blockquotes[0]->quote = $quote;
        $id = Blockquote::write($db,$blockquotes[0]);
    }
    set_block_implementation($db,$block_id,$id);
    return $id;
}



