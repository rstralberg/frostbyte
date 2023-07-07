<?php

require_once __DIR__ . '/php/error.php';
require_once __DIR__ . '/php/create_tables.php';
require_once __DIR__ . '/php/storage/db.php';
require_once __DIR__ . '/php/storage/config.php';
require_once __DIR__ . '/php/storage/block.php';
require_once __DIR__ . '/php/storage/permission.php';
require_once __DIR__ . '/php/storage/user.php';
require_once __DIR__ . '/php/storage/theme.php';
require_once __DIR__ . '/php/lexer.php';
require_once __DIR__ . '/php/conf.php';


session_start();

// Start database and create 
// tables if this is the first time
$db = new DB();
$db->connect();
create_tables($db);

// Load configuration and current state
$configs = Config::read($db);
if( count($configs) === 0) {
    die( 'Could not load configuration');
}
$config = $configs[0];

$login = false;
$logout = false;
$register = false;

$page_id = 0;
if( array_key_exists('REQUEST_URI', $_SERVER) )
{
    $req = ltrim($_SERVER['REQUEST_URI'], '/');
    if( strlen($req) > 0 ) {
        // Check if the user want to login or logout
        if( $req === CONF_LOGIN ) {
            $login = true;
        }
        else if( $req === CONF_REGISTER ) {
            $register = true;
        }
        else if( $req === CONF_LOGOUT) {
            $logout = true;
        }
        else {
            $page_id = (int)$req;
        }
    }
}

// Loading start page if nothing else is given
$page = null;
$block = new Block($db);
if( $page_id === 0 ) {
    $pages = Page::read($db, null, '`pos` asc');
    if( count($pages) > 0) {
        $page = $pages[0];
        $page_id = $pages[0]->id;
    }
}

// Generate header
$header = '<title>' . $config->sitename . '</title>'
    . '<meta charset="'. CONF_CHARSET .'">'
    . '<meta name="viewport" content="width=device-width,initial-scale=1.0">';

// most commom favicons
$favicons = [
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-57x57.png', 'sizes' => '57x57'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-60x60.png', 'sizes' => '60x60'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-72x72.png', 'sizes' => '72x72'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-76x76.png', 'sizes' => '76x76'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-114x114.png', 'sizes' => '114x114'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-120x120.png', 'sizes' => '120x120'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-144x144.png', 'sizes' => '144x144'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-152x152.png', 'sizes' => '152x152'],
    ['rel' => 'apple-touch-icon', 'href' => 'favicons/apple-icon-180x180.png', 'sizes' => '180x180'],
    ['rel' => 'icon', 'href' => 'favicons/android-icon-192x192.png', 'sizes' => '192x192'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-16x16.png', 'sizes' => '16x16'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-32x32.png', 'sizes' => '32x32'],
    ['rel' => 'icon', 'href' => 'favicons/favicon-96x96.png', 'sizes' => '96x96']
];
foreach ($favicons as $favicon) {
    $header .= '<link rel="' . $favicon['rel'] . '"  href="' . $favicon['href'] . '"  sizes="' . $favicon['sizes'] . '" >';
}

// Adding theme from database
$css = generate_css($db,$config->theme);
$fh = fopen('styles/theme.css','w');
fwrite($fh,$css);
fclose($fh);


$styling = generate_style($db,$config->theme);
$fh = fopen('not_used.css','w');
fwrite($fh,$styling);
fclose($fh);
$header .= '<style>' . $styling . '</style>';


// Adding css styles
$styles = glob('../public/styles/*.css');
foreach ($styles as $style) {
    $header .= '<link rel="stylesheet" href="styles/' . basename($style) . '">';
}

// Adding js scripts
$scriptfolders = ['scripts','scripts/impl','scripts/block','scripts/settings', 'scripts/utils', 'scripts/sql'];
foreach($scriptfolders as $folder ) {
    $scripts = glob('../public/' . $folder . '/*.js');
    foreach ($scripts as $script) {
        $header .= '<script type="application/javascript" src="'.$folder.'/' . basename($script) . '"></script>';
    }
}

// Available fonts
$fonts = array();
$fontfiles = glob('../public/fonts/*.ttf');
foreach ($fontfiles as $font) {
    array_push( $fonts, basename($font) );
}


// Check if there is a message
$message = '';
if( array_key_exists('message', $_REQUEST) )
{
    $message = '<div class="popup">'
    . '<div class="popup-container" style="display:inline-flex"><form class="form-container">' 
    . '<div><label>' . $_REQUEST['message'] . '</label></div><div>' 
    . '<button type="submit" class="fixed-width-200 btn">OK</button></div></form></div></div>';
}

$user = null;
if( array_key_exists('username', $_GET) && array_key_exists('password',$_GET)) {
    $users = User::read($db, '`username`=' . DB::string($_GET['username']));
    if( count($users)>0 && $users[0]->password = $_GET['username'] ) {
        $user = $users[0];
    }
}
// !!!! DEVELOPMENT HACK !!!!!
// $userstable = new Users($db);
// $user = $userstable->read('username=' . DB::string('admin'))[0];

// Create skeleton. Jscript will do the rest
echo(
    '<!DOCTYPE html><html class="app" lang="' . $config->language . '"><head>' . $header . '</head><body>'
    . '<div id="main-modal" class="modal"></div>'. $message . '</body>'
    . '<script type="module">addEventListener("DOMContentLoaded", (event) => { ');

$pages = Page::read($db, '`id`=' . $page_id);
if( count($pages) > 0 ) {
    $page = $pages[0];
}

$main_args = json_encode( [
    'login' => $login,
    'register' => $register,
    'user' => $user,
    'page' => $page,
    'config' => $config,
    'fonts' => $fonts
 ]);

echo( 'main('. $main_args . ')');


echo(' });/* window.onclick = hide_modal(); */' );

echo('</script></html>' );

$db->disconnect();
?>
