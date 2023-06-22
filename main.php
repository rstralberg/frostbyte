<?php

// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Main Entry
// - Creates database tables if needed
// - Scans CSS and JS files to include in header
// - Creates theme based CSS file
// - Sends parameters to JScript 'main' which then creates the main page
//

require_once __DIR__ . '/php/logger.php';
require_once __DIR__ . '/php/config.php';
require_once __DIR__ . '/php/error.php';
require_once __DIR__ . '/php/db/db.php';
require_once __DIR__ . '/php/db/tables.php';
require_once __DIR__ . '/php/db/config.php';
require_once __DIR__ . '/php/db/theme.php';
require_once __DIR__ . '/php/generators/head.php';
require_once __DIR__ . '/php/generators/fonts.php';


session_start();

// Start database and create 
// tables if this is the first time
$db = new db();
$db->connect();
create_tables($db);

// Load configuration 
$config = read_config($db);
if( $config == null) {
    die( 'Could not load configuration');
}

// Default page if nothing else given

// Or maybe some other page 
$homePage = get_first_page($db, '`title`=' . db::string(CONF_HOME_TITLE), null, dbmode::single);
$page = $homePage->id;
if(isset($_SERVER['REQUEST_URI'])) {
    $req = $_SERVER['REQUEST_URI'];
    if( strlen($req) > 1 ) {
        $page = substr($req,1);
    }
}


// Whats given from browser
$login = false; // by default
if( array_key_exists('REQUEST_URI', $_SERVER) )
{
    $reqPage = ltrim($_SERVER['REQUEST_URI'], '/');
    
    if( strlen($reqPage) > 0 ) {
        if( $reqPage === 'login') {
            $login = true; // not a page!
        } else if ($reqPage[0] !== '?' && $reqPage[strlen($reqPage)-1] !== '?' ){
            $page = $reqPage; // arg was a page!        
        }
    }
}

// Scan and generate font declarations
$fonts = generate_fonts();

// Lets generate the basic HTML code holding the framework
$html  = '<!DOCTYPE html><html lang="' . $config->language . '">';
$html  .= generate_head($db,$config);


// Load current user if any
$user = null;
if( array_key_exists('username', $_GET) && array_key_exists('password',$_GET)) {
    $user = read_user($db, '`username`=' . db::string($_GET['username']), null, dbmode::single);
}

$main_args = json_encode( [
    'lang' => $config->language,
    'login' => $login,
    'user' => ($user?$user->username:'roland'),
    'page' => $page,
    'fonts' => $fonts
 ]);


// Create skeleton. Jscript will do the rest
$html .= 
'<body><div class="left"></div><nav></nav>
<main></main><footer></footer><div class="right"></div>
</body><script type="module">addEventListener("DOMContentLoaded", (event) => {
main('. $main_args . ');})</script></html>';

echo( $html );
$db->disconnect();

