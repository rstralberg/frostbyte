<?php

// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Generate Header
// - Generates a comple HTML header
// - Scans CSS and JS files to include in header
//

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db/config.php';
require_once __DIR__ . '/../db/theme.php';
require_once __DIR__ . '/favicons.php';
require_once __DIR__ . '/scripts.php';
require_once __DIR__ . '/style.php';
require_once __DIR__ . '/css.php';

function generate_head($db, $config)
{
    $html = '<head>' 
    . '<title>' . $config->sitename . '</title>'
    . '<meta charset="'. CONF_CHARSET .'">'
    . '<meta name="viewport" content="width=device-width,initial-scale=1.0">';

    $html .= generate_favicons($config);
    $html .= generate_style($db, 'Dark');
    $html .= generate_scripts();
    $html .= scanCss();

    $html .= '</head>';
    return $html;
}
// // $STYLING = generate_style($DB,$CONFIG->THEME);
// // $FH = FOPEN('NOT_USED.CSS','W');
// // FWRITE($FH,$STYLING);
// // FCLOSE($FH);
// // $HEADER .= '<STYLE>' . $STYLING . '</STYLE>';


// // // ADDING CSS STYLES
// // $STYLES = GLOB('../PUBLIC/STYLES/*.CSS');
// // FOREACH ($STYLES AS $STYLE) {
// //     $HEADER .= '<LINK REL="STYLESHEET" HREF="STYLES/' . BASENAME($STYLE) . '">';
// // }

// // // ADDING JS SCRIPTS
// // $SCRIPTFOLDERS = [
// //     'SCRIPTS',
// //     'SCRIPTS/IMPL',
// //     'SCRIPTS/SETTINGS', 
// //     'SCRIPTS/UTILS', 
// //     'SCRIPTS/STORAGE', 
// //     'SCRIPTS/FRAMEWORK', 
// //     'SCRIPTS/FORM'];

// // FOREACH($SCRIPTFOLDERS AS $FOLDER ) {
// //     $SCRIPTS = GLOB('../PUBLIC/' . $FOLDER . '/*.JS');
// //     FOREACH ($SCRIPTS AS $SCRIPT) {
// //         $HEADER .= '<SCRIPT TYPE="APPLICATION/JAVASCRIPT" SRC="'.$FOLDER.'/' . BASENAME($SCRIPT) . '"></SCRIPT>';
// //     }
// // }

// // Available fonts
// $fonts = array();
// $fontfiles = glob('../public/fonts/*.ttf');
// foreach ($fontfiles as $font) {
//     array_push( $fonts, basename($font) );
// }


// // Check if there is a message
// $message = '';
// if( array_key_exists('message', $_REQUEST) )
// {
//     $message = '<div class="popup">'
//     . '<div class="popup-container" style="display:inline-flex"><form class="form-container">' 
//     . '<div><label>' . $_REQUEST['message'] . '</label></div><div>' 
//     . '<button type="submit" class="fixed-width-200 btn">OK</button></div></form></div></div>';
// }

// $user = null;
// if( array_key_exists('username', $_GET) && array_key_exists('password',$_GET)) {
//     $users = stUser::read($db, '`username`=' . DB::string($_GET['username']));
//     if( count($users)>0 && $users[0]->password = $_GET['username'] ) {
//         $user = $users[0];
//     }
// }
// // !!!! DEVELOPMENT HACK !!!!!
// // $userstable = new stUsers($db);
// // $user = $userstable->read('username=' . DB::string('admin'))[0];

// // Create skeleton. Jscript will do the rest
// echo(
//     '<!DOCTYPE html><html class="app" lang="' . $config->language . '"><head>' . $header . '</head><body>'
//     . '<div id="main-modal" class="modal"></div>'. $message . '</body>'
//     . '<script type="module">addEventListener("DOMContentLoaded", (event) => { ');

// $pages = stPage::read($db, '`title`=' . DB::string($pageTitle));
// if( count($pages) > 0 ) {
//     $page = $pages[0];
// }

// $main_args = json_encode( [
//     'login' => $login,
//     'register' => $register,
//     'user' => ($user?$user->username:'roland'),
//     'page' => $page->title,
//     'fonts' => $fonts
//  ]);

// echo( 'main('. $main_args . ')');


// echo(' });/* window.onclick = hide_modal(); */' );

// echo('</script></html>' );

// $db->disconnect();
// }
