<?php
// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// LEXICON OF SENTENCES IN DIFFRENT LANGUAGES
//
require_once __DIR__ . '/db.php';

class lexer
{
    public $lang;
    public $tag;
    public $eng;
    public $txt;
}

function create_lexer_table($db)
{
    $create = !$db->table_exist('lexer');
    if ($create) {
        $db->query(
            "CREATE TABLE `lexer` (
                `lang` varchar(10) DEFAULT NULL,
                `tag` varchar(30) DEFAULT NULL,
                `eng` varchar(255) DEFAULT NULL,
                `txt` varchar(255) DEFAULT NULL,
                KEY `lexer_lang_IDX` (`lang`) USING BTREE,
                KEY `lexer_tag_IDX` (`tag`) USING BTREE
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_swedish_ci;"
        );
    }
}

function result_to_lexer($db, $res)
{
    $lexer = new lexer($db);
    $lexer->lang = $res['lang'];
    $lexer->tag = $res['tag'];
    $lexer->eng = $res['eng'];
    $lexer->txt = $res['txt'];
    return $lexer;
}

function read_lexer($db, $where, $order, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `lexer`', $where, $order), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_lexer($db, $result);
        } else if ($mode === dbmode::multi) {
            $lexers  = array();
            foreach ($result as $res) {
                array_push($lexers, result_to_block($db, $res));
            }
            return $lexers;
        }
    }
    return null;
}

function write_lexer($db, $lexer, $where)
{
    if ($db->row_exist('lexer', $where)) {
        $db->query('UPDATE `lexer` SET '
            . '`lang`=' . db::string($lexer->lang) . ','
            . '`tag`=' . db::string($lexer->tag) . ','
            . '`eng`=' . db::string($lexer->eng) . ','
            . '`txt`=' . db::string($lexer->txt) . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `lexer` ('
            . '`lang`,'
            . '`tag`,'
            . '`eng`,'
            . '`txt`)'
            . ' VALUES ('
            . db::string($lexer->lang) . ','
            . db::string($lexer->tag) . ','
            . db::string($lexer->eng) . ','
            . db::string($lexer->txt) . ')');
    }
}

function create_lexer( $db, $lang, $tag, $eng, $txt) {
    $lexer = new lexer($db);
    $lexer->lang = $lang;
    $lexer->tag = $tag;
    $lexer->eng = $eng;
    $lexer->txt = $txt;
    write_lexer($db, $lexer, '`lang`=' . db::string($lang) . ' and `tag`=' . db::string($tag));
}

function create_lexer_from_file($db, $lang ) 
{
    $file = glob(__DIR__ . '/../data/lexer-' . $lang . '.txt');
    $fh = fopen($file[0], 'r');
    if($fh) {
        $data = fread($fh,filesize($file[0]));
        fclose($fh);

        $separator = PHP_EOL;
        $line = strtok($data, $separator);

        while ($line !== false) {

            $parts = explode('^',$line);
            if(count($parts) > 2) {
                create_lexer($db, $lang, $parts[0], htmlentities($parts[1]), htmlentities($parts[2]));
            }
            $line = strtok( $separator );
        }
    }
}

function drop_lexer($db)
{
    $db->query('drop table `lexer`');
}
