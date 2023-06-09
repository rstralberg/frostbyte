<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Defines User And Specific Type Parmeters In Json-Format
// - Username, Full name, Email and Password
// - Also some flags for permissions
//   
require_once __DIR__ . '/db.php';

class user
{
    public $username;
    public $fullname;
    public $email;
    public $password;
    public $power;
}

function create_user_table($db)
{
    $create = !$db->table_exist('user');
    if ($create) {
        $db->query(
            "CREATE TABLE IF NOT EXISTS `user`  (
				`username` VARCHAR(30) NOT NULL,
				`fullname` VARCHAR(50) NOT NULL,
				`email` VARCHAR(50) NOT NULL,
                `password` VARCHAR(256) NOT NULL,
                `power` TINYINT NOT NULL,
                PRIMARY KEY (`username`) USING BTREE,
                INDEX `pk` (`username`) USING BTREE
			)
			COLLATE='utf8mb4_swedish_ci'
			ENGINE=InnoDB"
        );
    }
}

function result_to_user($db, $res)
{
    $user = new user($db);
    $user->username = $res['username'];
    $user->fullname = $res['fullname'];
    $user->email = $res['email'];
    $user->password = $res['password'];
    $user->power = $res['power'] == '1';
    return $user;
}

function read_user($db, $where, $order, $mode)
{
    $result = $db->query(db::build_query('SELECT * FROM `user`', $where, $order), $mode);
    if ($result) {
        if ($mode === dbmode::single) {
            return result_to_user($db, $result);
        } else if ($mode === dbmode::multi) {
            $blocks  = array();
            foreach ($result as $res) {
                array_push($blocks, result_to_user($db, $res));
            }
            return $blocks;
        }
    }
    return null;
}

function write_user($db, $user, $where)
{
    if ($db->row_exist('user', $where)) {
        $db->query('UPDATE `user` SET '
            . '`username`=' . db::string($user->username) . ','
            . '`fullname`=' . db::string($user->fullname) . ','
            . '`email`=' . db::string($user->email) . ','
            . '`password`=' . db::string(password_hash($user->password, PASSWORD_DEFAULT)) . ','
            . '`power`=' . ($user->power ? 1 : 0)  . ' '
            . 'where ' . $where);
    } else {
        $db->query('INSERT INTO `user` ('
            . '`username`,'
            . '`fullname`,'
            . '`email`,'
            . '`password`,'
            . '`power`)'
            . ' VALUES ('
            . db::string($user->username) . ','
            . db::string($user->fullname) . ','
            . db::string($user->email) . ','
            . db::string(password_hash($user->password, PASSWORD_DEFAULT)) . ','
            . ($user->power ? 1 : 0) . ')');
    }
}

function create_user(
    $db,
    $username,
    $fullname,
    $email,
    $password,
    $power
) {
    $user = new user($db);
    $user->username = $username;
    $user->fullname = $fullname;
    $user->email = $email;
    $user->password = $password;
    $user->power = $power;
    write_user($db, $user, '`username`=' . db::string($username));
}

function drop_user($db)
{
    $db->query('drop table user');
}

function verifyPassword($db, $username, $password)
{
    $user = $db->query('select `password` from user where `username`=' . db::string($username), dbmode::single);
    return $user ? password_verify($password, $user['password']) : false;
}
