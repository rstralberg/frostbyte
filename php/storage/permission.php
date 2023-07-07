<?php

require_once __DIR__ . "/db.php";


class Permission
{
    public const TABLENAME = 'permission';
    public $id;
    public $pagetitle;
    public $username;

    public function __construct($db)
    {
        $this->id = 0;
        $create = !$db->tableExist(Permission::TABLENAME);
        if ($create) {
            $db->query( "CREATE TABLE " . Permission::TABLENAME . " (
                `id` INT(11) NOT NULL AUTO_INCREMENT,
                `pagetitle` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `username` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                PRIMARY KEY (`id`) USING BTREE
            )
            COLLATE='utf8mb4_swedish_ci'
            ENGINE=InnoDB");
        }
    }

    public static function read($db, $where = null, $order = null)
    {
        $perms = array();
        $sql = 'SELECT * FROM ' . Permission::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $perm = new Permission($db);
                $perm->id = $row['id'];
                $perm->pagetitle = $row['pagetitle'];
                $perm->username = $row['username'];
                array_push($perms, $perm );
            }
        }
        return $perms;
    }

    public static function write($db, $perm)
    {
        if ($db->rowExist(Permission::TABLENAME, $perm->id)) {
            $db->query(
                'UPDATE ' . Permission::TABLENAME . ' SET '
                    . '`pagetitle`=' . DB::string($perm->pagetitle). ','
                    . '`username`=' . DB::string($perm->username) . ' '
                    . 'WHERE `id`=' . $perm->id
            );
        } else {
            $db->query('INSERT INTO ' . Permission::TABLENAME . ' (`pagetitle`,`username`) VALUES ('
                . DB::string($perm->pagetitle) . ','
                . DB::string($perm->username) . ')');
            $perm->id = $db->get_last_id();
        }
    }

    public static function delete($db, $where)
    {
        $db->query(
            'DELETE FROM ' . Permission::TABLENAME . ' WHERE ' . $where
        );
    }
}

function create_permission($db, $pagetitle, $username ) {
    $perm = new Permission($db);
    $perm->pagetitle = $pagetitle;
    $perm->username = $username;
    Permission::write($db,$perm);
    return $perm->id;
}