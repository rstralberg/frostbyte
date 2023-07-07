<?php

require_once __DIR__ . "/db.php";

class Gallery
{
    public const TABLENAME = 'gallery';
    public $id;
    public $block_id;
    public $images;

    public function __construct($db)
    {
        $this->id = 0 ;
        $create = !$db->tableExist(Gallery::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Gallery::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `images` TEXT NOT NULL,
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $gallerys = array();
        $sql = 'SELECT * FROM ' . Gallery::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $gallery = new Gallery($db);
                $gallery->id = $row['id'];
                $gallery->block_id = $row['block_id'];
                $gallery->images = $row['images'];
                array_push($gallerys, $gallery );
            }
        }
        return $gallerys;
    }

    public static function write($db,$gallery)
    {
        if ($db->rowExist( Gallery::class, $gallery->id)) {
            $db->query(
                'UPDATE ' . Gallery::TABLENAME . ' SET '
                . '`block_id`=' . $gallery->block_id . ' '
                . '`images`=' . DB::string($gallery->images) . ' '
                . 'WHERE `id`=' . $gallery->id
            );
        } else {
            $db->query('INSERT INTO ' . Gallery::TABLENAME . ' (
                `block_id`
                `title`,
                `images`,
                ) VALUES (' 
                . $gallery->block_id . ',' 
                . DB::string($gallery->images) . ')');
            $gallery->id = $db->get_last_id();
        }
    }

    public static function delete($db, $where)
    {
        $db->query(
            'DELETE FROM ' . Gallery::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_gallery($db, $page_id, $pos,
                        $title, $images = '' ) 
{
    $block_id = create_block($db, 'gallery', $page_id, $pos, 'center', $title);
    $gallery = new Gallery($db);
    $gallery->block_id = $block_id;
    $gallery->images = $images;
    Gallery::write($db, $gallery);
    set_block_implementation($db,$block_id,$gallery->id);
    return $gallery->id;
}

