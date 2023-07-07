<?php

require_once __DIR__ . "/db.php";

class Picture {

    public const TABLENAME = 'picture';
    public $id;
    public $block_id;
    public $url;
    public $shadow;
    public $height;
    public $title;
    
    public function __construct($db)    {

        $this->id = 0;
        $create = !$db->tableExist(Picture::TABLENAME);
        if( $create ) {
            $db->query("CREATE TABLE " . Picture::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL DEFAULT '0',
                `url` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
                `title` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `shadow` TINYINT NOT NULL DEFAULT '0',
                `height` INT(11) NOT NULL DEFAULT '30',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where=null, $order=null) {
        $pictures = array();
        $sql = 'SELECT * FROM ' . Picture::TABLENAME ;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $picture = new Picture($db);
                $picture->id = $row['id'];
                $picture->block_id = $row['block_id'];
                $picture->url = DB::string($row['url']);
                $picture->title = DB::string($row['title']);
                $picture->shadow = $row['shadow'];
                $picture->height = $row['height'];
                array_push($pictures, $picture ) ;
            }
        }
        return $pictures;
    }

    public static function write($db, $picture) {
		if ($db->rowExist( Picture::TABLENAME, $picture->id)) {
            $db->query(
                'UPDATE ' . Picture::TABLENAME . ' SET '
                    . '`block_id`=' . $picture->block_id . ','
                    . '`url`=' . DB::string($picture->url) . ','
                    . '`title`=' . DB::string($picture->title) . ','
                    . '`shadow`=' . $picture->shadow . ','
                    . '`height`=' . $picture->height . ' '
                    . 'WHERE `id`=' . $picture->id
            );
        } else {
            $db->query('INSERT INTO ' . Picture::TABLENAME . ' (
				`block_id`,
				`url`,
				`title`,
				`shadow`,
				`height`)
				VALUES ('
                . $picture->block_id . ','
                . DB::string($picture->url) . ','
                . DB::string($picture->title) . ','
                . $picture->shadow . ','
                . $picture->height . ')');
            $picture->id = $db->get_last_id();
        }
	}
	
    public static function delete($db, $where) {
        $db->query(
                'DELETE FROM ' . Picture::TABLENAME . ' WHERE ' . $where);
    }
}

function create_picture($db, $page_id, $pos, 
                        $url, $shadow, $height, $align, $title)
{
    $block_id = create_block($db, 'picture', $page_id, $pos, $align );
    $picture = new Picture($db);
    $picture->block_id = $block_id;
    $picture->url = $url;
    $picture->title = $title;
    $picture->shadow = $shadow;
    $picture->height = $height;
    Picture::write($db,$picture);
    set_block_implementation($db,$block_id,$picture->id);
    return $picture->id;
}

