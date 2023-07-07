<?php

require_once __DIR__ . "/db.php";


class User
{
	public const TABLENAME = 'user';
    public $id;
    public $username;
    public $fullname;
    public $password;
    public $email;
    public $pages;
    public $system;
    public $theme;
	
	public function __construct($db)
	{
        $this->id = 0 ;
		$create = !$db->tableExist(User::TABLENAME);
		if ($create) {
			$db->query( "CREATE TABLE " . User::TABLENAME . " (
                `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
                `username` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `fullname` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `password` VARCHAR(256) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `email` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_swedish_ci',
                `pages` TINYINT(1) NOT NULL,
                `system` TINYINT(1) NOT NULL,
                `theme` TINYINT(1) NOT NULL,
                PRIMARY KEY (`id`) USING BTREE
            )
            COLLATE='utf8mb4_swedish_ci'
            ENGINE=InnoDB");
		}
	}

    public static function read($db, $where = null, $order = null)
    {
        $users = array();
        $sql = 'SELECT * FROM ' . User::TABLENAME;
        if ($where) {
            $sql .= ' WHERE ' . $where;
        }
        if ($order) {
            $sql .= ' ORDER BY ' . $order;
        }
        $result = $db->query($sql);
        if (DB::hasRows($result)) {
            while ($row = DB::next($result)) {
                $user = new User($db);
                $user->id = $row['id'];
                $user->username = $row['username'];
                $user->fullname = $row['fullname'];
                $user->email = $row['email'];
                $user->password = $row['password'];
                $user->pages = $row['pages'];
                $user->system = $row['system'];
                $user->theme = $row['theme'];
                array_push($users,$user);
            }
        }
        return $users;
    }

	public static function write($db, $user) {
		if ($db->rowExist(User::TABLENAME, $user->id)) {
            $db->query(
                'UPDATE ' . User::TABLENAME . ' SET '
                    . '`username`=' . DB::string($user->username) . ','
                    . '`fullname`=' . DB::string($user->fullname) . ','
                    . '`password`=' . DB::string(password_hash($user->password, PASSWORD_DEFAULT)) . '.'
                    . '`email`=' . DB::string($user->email) . ','
                    . '`pages`=' . ($user->pages?1:0) . ','
                    . '`system`=' . ($user->system?1:0) . ', '
                    . '`theme`=' . ($user->theme?1:0) . ' '
                    . 'WHERE `id`=' . $user->id
            );
        } else {
            $db->query('INSERT INTO ' . User::TABLENAME . ' (
				`username`,
				`fullname`,
				`password`,
				`email`,
				`pages`, 
				`system`,
                `theme`
				) VALUES ('
                . DB::string($user->username) . ','
                . DB::string($user->fullname) . ','
                . DB::string(password_hash($user->password, PASSWORD_DEFAULT)) . ','
                . DB::string($user->email) . ','
                . ($user->pages?1:0) . ','
                . ($user->system?1:0) . ','
                . ($user->theme?1:0) . ')');
            $user->id = $db->get_last_id();
        }
	}
	
    public static function delete($db, $where) {
        $db->query( 
            'DELETE FROM ' . User::TABLENAME . ' WHERE ' . $where);
    }

	public static function verify($db, $username,$password) {
        $rows = $db->query( 'select password from ' . User::TABLENAME . ' where `username`=' . DB::string($username) );
        if( DB::hasRows($rows) ) {
            $data = DB::next($rows);
            return password_verify($password, $data['password']);
		}
		return false;
	}
	public static function exist($db, $username) {
		$rows = $db->query( 'select `username` forn ' . User::TABLENAME . ' where `username`='.DB::string($username));
		return DB::hasRows($rows);
	}
}

function create_user($db, $username, $fullname,
                    $password, $email, $pages, $system, $theme)
{
    $user = new User($db);
    $user->username = $username;
    $user->fullname = $fullname;
    $user->password = $password;
    $user->email = $email;
    $user->pages = $pages;
    $user->system = $system;
    $user->theme = $theme;
    User::write($db, $user);
    return $user->id;
}