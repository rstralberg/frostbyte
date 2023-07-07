<?php
require_once __DIR__ . '/../lexer.php';

function parse_GET( $parameters ) {
    $reply = array();
    foreach($parameters as $parameter ) {
        if( !isset($_GET[$parameter])) {
            echo( Lexer::ARGUMENT_MISSING . ' ' . $parameter );
            return null;
        }
        else {
            array_push($reply, [ 'name' => $parameter, 'value' => $_GET[$parameter] ]);
        }
    }
    return $reply;
}

function GET_value($parsed, $name) {
    if($parsed && count($parsed)>0) {
        foreach($parsed as $p) {
            if( $p['name'] === $name  ) {
                return $p['value']==='null'? null: $p['value'];
            }
        }
    }
    return null;
}

?>