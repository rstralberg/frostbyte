<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Defines A Page Content Block 
// - Holds both common block parameters 
//   and specific type parmeters in Json-format
//   
require_once __DIR__ . '/db.php';

class block
{
    public $id;
    public $page;
    public $divide;
    public $index;
    public $left;
    public $right;
}

function create_block_table($db)
{
    $create = !$db->table_exist('block');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `block`  (
				`id` INT(11) NOT NULL  AUTO_INCREMENT,
				`page` VARCHAR(30) NOT NULL,
                `divide` INT NOT NULL,
                `index` INT NOT NULL,
                `left` TEXT NOT NULL,
                `right` TEXT NOT NULL,
                PRIMARY KEY (`id`) USING BTREE,
                INDEX `pk` (`id`) USING BTREE
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB"
        );
    }
}

function result_to_block($db, $res)
{
    $block = new block($db);
    $block->id = (int)$res['id'];
    $block->page = $res['page'];
    $block->divide = $res['divide'];
    $block->index = $res['index'];
    $block->left= $res['left'];
    $block->right= $res['right'];
    return $block;
}

function read_block($db, $where, $order, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `block`', $where, $order), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_block($db, $result);
        } else if ($mode === dbmode::multi) {
            $blocks  = array();
            foreach ($result as $res) {
                array_push($blocks, result_to_block($db, $res));
            }
            return $blocks;
        }
    }
    return null;
}

function write_block($db, $block, $where)
{
    if ($db->row_exist('block', $where)) {
        $db->query('UPDATE `block` SET '
            . '`page`=' . db::string($block->page) . ','
            . '`divide`=' . $block->divide . ','
            . '`index`=' . $block->index . ','
            . '`left`='  . db::string($block->left) . ','
            . '`right`='  . db::string($block->right) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `block` ('
            . '`page`,'
            . '`divide`,'
            . '`index`,'
            . '`left`,'
            . '`right` )'
            . ' VALUES ('
            . DB::string($block->page) . ','
            . $block->divide . ','
            . $block->index . ','
            . DB::string($block->left) . ','
            . DB::string($block->right) . ')');
    }
}

function create_block(
    $db,
    $page,
    $divide,
    $index,
    $left,
    $right
) {
    $block = new block($db);
    $block->page = $page;
    $block->divide = $divide;
    $block->index = $index;
    $block->left = $left;
    $block->right = $right;
    write_block($db, $block, '`id`=0');
}

function drop_block($db)
{
    $db->query('drop table `block`');
}
