<?php

require_once __DIR__ . "/db.php";

class Media
{
    public const TABLENAME = 'media';
    public $id;
    public $block_id;
    public $shadow;
    public $url;
    public $title;
    public $type;

    public function __construct($db)
    {
        $this->id = 0 ;
        $create = !$db->tableExist(Media::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Media::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `block_id` INT(11) NOT NULL,
                `shadow` TINYINT NOT NULL,
                `url` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
                `title` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `type` ENUM('mp3','youtube','vimeo','spotify','video','soundcloud') NOT NULL COLLATE 'utf8mb4_general_ci',
                INDEX `pk` (`id`) USING BTREE
            )
            COLLATE='utf8mb4_general_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $medias = array();
        $sql = 'SELECT * FROM ' . Media::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $media = new Media($db);
                $media->id = $row['id'];
                $media->block_id = $row['block_id'];
                $media->shadow = $row['shadow'];
                $media->url = $row['url'];
                $media->title = $row['title'];
                $media->type = $row['type'];
                array_push($medias, $media);
            }
        }
        return $medias;
    }

    public static function write($db, $media)
    {
        if ($db->rowExist(Media::TABLENAME, $media->id)) {
            $db->query(
                'UPDATE ' . Media::TABLENAME . ' SET '
                    . '`block_id`=' . $media->block_id . ','
                    . '`shadow`=' . $media->shadow . ','
                    . '`url`=' . DB::string($media->url) . ','
                    . '`title`=' . DB::string($media->title) . ','
                    . '`type`=' . DB::string($media->type) . ' '
                    . 'WHERE `id`=' . $media->id
            );
        } else {
            $db->query('INSERT INTO ' . Media::TABLENAME . ' (
                `block_id`,
                `shadow`,
                `url`,
                `title`,
                `type` 
                ) VALUES (' .
                $media->block_id . ',' .
                $media->shadow . ',' .
                DB::string($media->url) . ',' .
                DB::string($media->title) . ',' .
                DB::string($media->type) . ')');
            $media->id = $db->get_last_id();
        }
    }

    public static function delete($db,$where)
    {
        $db->query(
            'DELETE FROM ' . Media::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_media($db, $page_id, $pos, $shadow,
                      $url, $title, $type, $align ) 
{
    $block_id = create_block($db, 'media', $page_id, $pos, $align);
    $media = new Media($db);
    $media->url = $url;
    $media->title = $title;
    $media->shadow = $shadow;
    $media->block_id = $block_id;
    $media->type = $type;
    Media::write($db, $media);
    set_block_implementation($db,$block_id,$media->id);
    return $media->id;
}

