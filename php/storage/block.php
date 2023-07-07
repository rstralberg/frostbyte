<?php

require_once __DIR__ . "/db.php";

class Block
{
    public const TABLENAME = 'block';
    public $id;
    public $type;
    public $page_id;
    public $impl_id;
    public $pos;
    public $align;
    public $style;
    
    public function __construct($db)
    {
        $this->id = 0 ;
        $create = !$db->tableExist('block');
        if ($create) {
            $db->query( 
                'CREATE TABLE `block` (
                    `id` int(11) NOT NULL AUTO_INCREMENT,
                    `type` enum(\'section\',\'media\',\'picture\',\'gallery\',\'header\',\'code\',\'blockquote\') NOT NULL,
                    `pos` int(11) NOT NULL,
                    `align` varchar(10) NOT NULL,
                    `page_id` int(11) NOT NULL,
                    `impl_id` int(11) NOT NULL,
                    `style` text NOT NULL DEFAULT \'{"background":"rgb(32,32,32)","color":"rgb(255,255,255)","fontFamily":"Arial, Helvetica, sans-serif","fontSize":"1em"}\',
                    PRIMARY KEY (`id`) USING BTREE
                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci');
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $blocks = array();
        $sql = 'SELECT * FROM ' . Block::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $block = new Block($db);
                $block->id = $row['id'];
                $block->type = $row['type'];
                $block->pos = $row['pos'];
                $block->align = $row['align'];
                $block->page_id = $row['page_id'];
                $block->impl_id = $row['impl_id'];
                $block->style = $row['style'];
                array_push($blocks, $block);
            }
        }
        return $blocks;
    }

    public static function write($db, $block)
    {
        if ($db->rowExist(Block::TABLENAME, $block->id)) {
            $db->query(
                'UPDATE ' . Block::TABLENAME . ' SET '
                    . '`id`=' . $block->id . ','
                    . '`type`=' . DB::string($block->type) . ','
                    . '`pos`=' . $block->pos . ','
                    . '`align`=' . DB::string($block->align) . ','
                    . '`page_id`=' . $block->page_id . ','
                    . '`impl_id`=' . $block->impl_id . ','
                    . '`style`=' . DB::string($block->style) . ' '
                    . 'WHERE `id`=' . $block->id
            );
        } else {
            $db->query('INSERT INTO ' . Block::TABLENAME . ' (
                `type`,
                `pos`,
                `align`,
                `page_id`,
                `impl_id`,
                `style`) 
                VALUES (' .
                DB::string($block->type) . ',' .
                $block->pos . ',' .
                DB::string($block->align) . ',' .
                $block->page_id . ',' .
                $block->impl_id . ',' .
                DB::string($block->style) . ')');
            $block->id = $db->get_last_id();
        }
    }

    public static function delete($db, $where)
    {
        $db->query(
            'DELETE FROM ' . Block::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_block($db, $type, $page_id, $pos, $align) {

    $style = json_encode( [
        'background' => 'rgb(32,32,32',
        'color' => 'rgb(255,255,255)',
        'fontFamily' => 'Arial, Helvetica, sans-serif',
        'fontSize' => '1em']);


    $block = new Block($db);
    $block->type = $type;
    $block->page_id = $page_id;
    $block->impl_id = 0;
    $block->pos = $pos;
    $block->align = $align;
    $block->style = $style;
    Block::write($db,$block);
    return $block->id;
}

function save_block($db, $id, $page_id, $impl_id, $type, $pos, $align, $style = null) {
    $block = new Block($db);
    $block->id = $id;
    $block->type = $type;
    $block->page_id = $page_id;
    $block->impl_id = $impl_id;
    $block->pos = $pos;
    $block->align = $align;
    if($style) $block->style = $style;
    else $style = json_encode( [
        'background' => 'rgb(32,32,32',
        'color' => 'rgb(255,255,255)',
        'fontFamily' => 'Arial, Helvetica, sans-serif',
        'fontSize' => '1em']);
    Block::write($db,$block);
    return $block->id;
}

function set_block_implementation($db,$block_id,$impl_id)
{
    $blocks = Block::read($db, 'id=' . $block_id);
    if( count($blocks) > 0 ) {
        $blocks[0]->impl_id = $impl_id;
        Block::write($db,$blocks[0]);
    }
}
