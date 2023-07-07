<?php
require_once __DIR__ . '/../lexer.php';
require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../../php/storage/user.php';


function login_handler() {
    $values = parse_GET(['username','password']);
    if($values) {
        $db = new DB();
        $db->connect();
        
        $username = GET_value($values,'username');
        $password = GET_value($values,'password');
        
        
        $users = User::read($db, 'username=' . DB::string($username));
        
        $reply = array('success' => false, 'message' => Lexer::SOMETHING_WRONG, 'user' => null) ;
        if( count($users) > 0 ) {
            $user = $users[0];
            if( User::verify($db, $username, $password) ) {
                $reply = array('success' => true, 'message' => Lexer::WELCOME . ' ' . $user->fullname, 'user' => $user);
            }
            else {
                $reply = array('result' => false, 'message' => Lexer::WRONG_PASSWORD, 'user' => null);
            }
        } 
        else {
            if( GET_value($values,'username') ) {
                $reply = array('result' => false, 'message' => $username . ' ' . Lexer::NOT_REGISTERED, 'user' => null);
            }
            else  {
                $reply = array('result' => false, 'message' => Lexer::USERNAME_MISSING, 'user' => null);
            }
        }
        $db->disconnect();
        echo( json_encode($reply) );
    }

}

