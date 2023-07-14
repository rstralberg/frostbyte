<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
require_once __DIR__ . '/db.php';

class translation
{
    public function __construct($id, $code,$tag,$exp)
    {
        $this->id = $id;
        $this->code = $code;
        $this->tag = $tag;
        $this->exp = $exp;    
    }
    
    public $id;
    public $code;
    public $tag;
    public $exp;
};

function create_translation_table($db)
{
    $create = !$db->table_exist(`translation`);
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `translation` (
                `id` int(11) NOT NULL AUTO_INCREMENT,
                `code` varchar(10) NOT NULL,
                `tag` varchar(50) NOT NULL,
                `exp` varchar(500) NOT NULL,
                PRIMARY KEY (`id`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci"
        );
    }
}

function result_to_translation($db, $res)
{
    return new translation($res['id'], $res['code'],$res['tag'],$res['exp']);
}

function read_translation($db, $where, $pos, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `translation`', $where, $pos), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_translation($db, $result);
        } else if ($mode === dbmode::multi) {
            $langs  = array();
            foreach ($result as $res) {
                array_push($langs, result_to_translation($db, $res));
            }
            return $langs;
        }
    }
    return null;
}

function write_translation($db, $lang, $where)
{
    if ($db->row_exist('translation', $where)) {
        $db->query('UPDATE `translation` SET '
            . '`code`=' . db::string($lang->code) . ','
            . '`tag`=' . db::string($lang->tag) . ','
            . '`exp`=' . db::encode_string($lang->exp) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `translation` ('
            . '`code`,'
            . '`tag`,'
            . '`exp` '  
            . ' ) VALUES ('
            . db::string($lang->code) . ','
            . db::string($lang->tag) . ','
            . db::encode_string($lang->exp) . ')');
    }
}

function create_translation($db,$code) {
    
    $path = __DIR__ . '/trans/' . $code . '.txt';
    $fh = fopen($path, 'r');
    if( $fh ) {
        $linecount = 1;
        while( !feof($fh)) {
            $line = fgets($fh);
            if( strpos($line, '^') ) {
            
            $words = explode('^', $line);
            if( count($words) === 2 && $words[0][0] != ';' ) {
                
                $tag = trim($words[0]);
                $exp = trim($words[1]);
    
                $translation = new translation( 0, $code, $tag, $exp);

                write_translation($db, $translation, 'tag=' . db::string($translation->tag) . ' and code=' . db::string($translation->code));
            }
            $linecount++;
        }
            
        }
        fclose($fh);
    }
}

function drop_translation($db)
{
    $db->query('drop table translation');
}

