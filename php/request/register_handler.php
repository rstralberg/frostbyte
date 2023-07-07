<?php

require_once __DIR__ . '/get.php';
require_once __DIR__ . '/../storage/db.php';
require_once __DIR__ . '/../storage/user.php';

function register_handler()
{
    $values = parse_GET(['username','fullname','email','password']);
    if( $values === null ) {
        return;
    }

    $username = GET_value($values,'username');
    $fullname = GET_value($values,'fullname');
    $email = GET_value($values,'email');
    $password = GET_value($values,'password');

    $db = new DB();
    $db->connect();

    $users = User::read('username=' . DB::string($username));
    if( count($users)>0) {
        $db->disconnect();
        $reply = [ 'success' => false, 'message' => Lexer::USER_ALREADY_EXIST];
        echo( json_encode( $reply ) );
        return;
    }

    create_user($db,$username, $fullname, $password, $email, 0, 0, 0 );

    $db->disconnect();

    $reply = [ 'success' => true, 'message' => $username . ' ' . Lexer::REGISTERED] ;
    echo( json_encode( $reply ) );
}
