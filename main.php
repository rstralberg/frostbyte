<?php

// ========================================================================
// OEBBY
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// MAIN ENTRY
// - Creates database tables if needed
// - Scans CSS and JS files to include in header
// - Creates theme based CSS file
// - Sends parameters to JScript 'main' which then creates the main page
//

require_once __DIR__ . '/php/config.php';
require_once __DIR__ . '/php/error.php';
require_once __DIR__ . '/php/db/db.php';
require_once __DIR__ . '/php/db/tables.php';
require_once __DIR__ . '/php/db/config.php';
require_once __DIR__ . '/php/db/theme.php';
require_once __DIR__ . '/php/generators/head.php';
require_once __DIR__ . '/php/generators/css.php';
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
$page = CONF_HOME;
$homePage = read_page($db, '`ishome`=1', null, dbmode::single);
if( $homePage ) {
    $page = $homePage->name;
}

// Whats given from browser
$login = false; // by default
if( array_key_exists('REQUEST_URI', $_SERVER) )
{
    $reqPage = ltrim($_SERVER['REQUEST_URI'], '/');
    
    if( strlen($reqPage) > 0 ) {
        if( $reqPage === 'login') {
            $login = true; // not a page!
        } else if ($reqPage[0] !== '?' ){
            $page = $reqPage; // arg was a page!        
        }
    }
}

// Generate a theme.css from database
generate_css($db, $config->theme);

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

// Create skeleton. Jscript will do the rest
$html .= '<body></body>';

$main_args = json_encode( [
    'lang' => $config->language,
    'login' => $login,
    'user' => ($user?$user->username:'roland'),
    'page' => $page,
    'fonts' => $fonts
 ]);

// Call scrips Main to create the site
$html .= '<script type="module">addEventListener("DOMContentLoaded", (event) => { '
    . 'main('. $main_args . ')' . PHP_EOL
    . '})' . PHP_EOL
    . '</script></html>';

echo( $html );
$db->disconnect();
