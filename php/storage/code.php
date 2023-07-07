<?php

require_once __DIR__ . "/db.php";
require_once __DIR__ . "/block.php";

class Code
{
    public const TABLENAME = 'code';
    public $id;
    public $block_id;
    public $code;

    public function __construct($db)
    {
        $this->id = 0;
        $create = !$db->tableExist(Code::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Code::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `code` TEXT NOT NULL  COLLATE 'utf8mb4_general_ci',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $codes = array();
        $sql = 'SELECT * FROM ' . Code::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $code = new Code($db);
                $code->id = $row['id'];
                $code->block_id = $row['block_id'];
                $code->code = $row['code'];
                array_push($codes, $code );
            }
        }
        return $codes;
    }

    public static function write($db, $code)
    {
        if ($db->rowExist(Code::TABLENAME, $code->id)) {
            $db->query(
                'UPDATE ' . Code::TABLENAME . ' SET '
                . '`block_id`=' . $code->block_id . ','
                . '`code`=' . DB::string($code->code) . ' '
                . 'WHERE `id`=' . $code->id
            );
            return $code->id;
        } else {
            $db->query('INSERT INTO ' . Code::TABLENAME . ' (
                `block_id`,
                `code`
                ) VALUES (' .
                $code->block_id . ',' .
                DB::string($code->code) . ')');
            $code->id = $db->get_last_id();
            return $code->id;
        }
    }

    public static function delete($db,$where)
    {
        $db->query(
            'DELETE FROM ' . Code::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_code($db, $page_id, $pos, $align, $title )
{
    $block_id = create_block($db, 'code', $page_id, $pos, $align );
    $code = new Code($db);
    $code->code = $title;
    $code->block_id = $block_id;
    $id = Code::write($db,$code);
    set_block_implementation($db,$block_id,$id);
    return $id;
}

function save_code($db, $page_id, $block_id, $impl_id, $pos, $align, $title )
{
    $block_id = save_block($db, $block_id, $page_id, $impl_id, 'code', $pos, $align );
    $codes = Code::read($db, 'id=' . $impl_id );
    $id = 0 ;
    if( count($codes) === 0 ) {
        $t = new Code($db);
        $t->block_id = $block_id;
        $t->code = $title;
        $id = Code::write($db,$t);
    }
    else {
        $codes[0]->block_id = $block_id;
        $codes[0]->code = $title;
        $id = Code::write($db,$codes[0]);
    }
    set_block_implementation($db,$block_id,$id);
    return $id;
}



