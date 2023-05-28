<?php
// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Create Tables If Needed
// - Checks for existance and creates everthing if needed
// - Deletes all tables

require_once  __DIR__ . '/../config.php';
require_once  __DIR__ . '/config.php';
require_once  __DIR__ . '/user.php';
require_once  __DIR__ . '/page.php';
require_once  __DIR__ . '/block.php';
require_once  __DIR__ . '/theme.php';
require_once  __DIR__ . '/lexer.php';

function create_tables($db)
{
    create_config_table($db);
    if( read_config($db, dbmode::single ) === null) {
        create_config($db,
            CONF_LANGUAGE,
            CONF_SITENAME,
            CONF_SITEOWNER,
            CONF_THEME,
            CONF_CHARSET,
            CONF_LOGO,
            CONF_SHOWHEADERS);
    }    
    $config = read_config($db, dbmode::single );
    
    create_user_table($db);
    if( read_user($db, null, null, dbmode::single) === null) {
        create_user($db,
            CONF_USERNAME,
            CONF_FULLNAME, 
            CONF_EMAIL, 
            CONF_PASSWORD,
            true, true, true);
    }

    create_page_table($db);
    if( read_page($db, null, null, dbmode::single) === null) {
        create_page($db,
            CONF_HOME_TITLE,
            CONF_HOME, 
            '',
            0,
            true);
    }

    create_block_table($db);
    if( read_block($db, null, null, dbmode::single) === null) {
        create_block($db, 
            CONF_HOME, 40, 0,
            json_encode( [
                'type' => 'picture',
                'url' => 'icons/avatar.svg',
                'size' => '256',
                'shadow' => 'true',
                'align' => 'center',
                'title' => 'Admin'
            ]),
            json_encode( [
                'type' => 'text',
                'text' => 'Welcome to FrostByte',
                'align' => 'center'
            ]));
    }

    create_theme_table($db);
    if( read_theme($db, null, null, dbmode::single) === null) {
        create_theme($db, 'Dark',
            // body
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff',
                'font-family' => 'Arial',
                'font-size' => '1em',
                'font-weight' => 'normal',
                'font-style' => 'normal',
                'margin-left' => 'auto',
                'margin-right' => 'auto',
                'margin-top' => '0',
                'margin-bottom' => '0',
            ]),
            // navbar
            json_encode([
                'background' => '#000000',
                'color' => '#c8c18d',
                'font-size' => '1.2em',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#c8c18d',
                'border-radius' => '4px',
                'height' => '8vh',
                'margin-top' => '6px',
                'line-height' => '8vh',
                'position' => 'fixed',
                'width' => '80%'
            ]),
            // navlinks
            json_encode([
                'background' => '#000000',
                'color' => '#e8e1ad',
                'font-size' => '1.2em',
                'font-weight' => 'bold',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#c8c18d',
                'border-radius' => '4px',
                'margin-left' => '0.8em',
                'hover:background' => '#101010',
                'hover:color' => '#ff7010',
                'text-align' => 'left'
            ]),
            // footer
            json_encode([
                'background' => '#000000',
                'color' => '#c8c18d',
                'font-size' => '0.9em',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#ffffff',
                'border-radius' => '4px',
                'font-style' => 'italic',
                'height' => '3vh',
                'line-height' => '3vh',
                'margin-top' => '6px',
                'text-align' => 'center',
                'position' => 'fixed',
                'bottom' => '0px',
                'width' => '80%'
            ]),
            // controls
            json_encode([
                'background' => '#a0a0a0',
                'color' => '#000000',
                'font-size' => '1.1em',
                'border-width' => '2px',
                'border-style' => 'solid',
                'border-color' => '#ffffff',
                'border-radius' => '4px',
                'hover:background'=> '#ffff00',
                'hover:color'=> '#000000',
                'text-align' => 'left'
            ]),
            // inputs                
            json_encode([
                'background' => '#a0a0a0',
                'color' => '#000000',
                'font-size' => '1.1em',
                'border-width' => '2px',
                'border-style' => 'solid',
                'border-color' => '#ffffff',
                'border-radius' => '4px',
                'hover:background'=> '#ffff00',
                'hover:color'=> '#000000'
            ]),
            // blocks                
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff',
                'font-size' => '1.0em',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#ffffff',
                'border-radius' => '4px',
                'width' => '100%',
                'height' => '20vh',
                'margin-top' => '8px',
                'margin-right' => '0px',
                'margin-bottom' => '8px',
                'margin-left' => '0px',
                'text-align' => 'left',
                'overflow' => 'auto',
                'outline-color' => '#a0a0a0',
                'outline-style' => 'solid',
                'outline-width' => '0px',
                'display' => 'flex@content'
            ]),
            // left
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#e0e0e0',
                'border-radius' => '8px',
                'height' => 'inherit',
                'margin-right' => '',
                'overflow' => 'auto',
                'outline-color' => '#a0a0a0',
                'outline-style' => 'dashed',
                'outline-width' => '0px',
                'margin-left' => '4px',
                'margin-top' => '4px',
                'margin-right' => '4px',
                'margin-bottom' => '4px',
            ]),
            // right
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff',
                'border-width' => '0px',
                'border-style' => 'solid',
                'border-color' => '#e0e0e0',
                'border-radius' => '8px',
                'height' => 'inherit',
                'overflow' => 'auto',
                'outline-color' => '#a0a0a0',
                'outline-style' => 'dashed',
                'outline-width' => '0px',
                'margin-left' => '4px',
                'margin-top' => '4px',
                'margin-right' => '4px',
                'margin-bottom' => '4px',
            ]),
            // panel area
            json_encode([
                'display' => 'grid',
                'grid-template-columns' => '10% 80% 10%',
                'width' => '100vw',
                'margin-top' => '0px',
                'margin-left' => '0px',
                'margin-right' => '0px',
                'margin-bottom' => '0px',
                'height' => '100vw',
            ]),
            // center panel
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff'
            ]),
            // side panels
            json_encode([
                'background' => '#202020',
                'color' => '#ffffff',
                'width' => '10vw'
            ]),
            // toolbar
            json_encode([
                'background' => '#202020',
                'color' => '#000000',
                'border-width' => '1px',
                'border-style' => 'solid',
                'border-color' => '#e0e0e0',
                'border-radius' => '8px',
                'height' => '42px',
                'width' => '100%',
            ]),
            // tools
            json_encode([
                'background' => '#ffffff',
                'hover:background' => '#ffff00',
                'border-width' => '2px',
                'border-style' => 'solid',
                'border-color' => '#000000',
                'border-radius' => '8px',
                'height' => '32px',
                'margin-top' => '4px',
                'margin-left' => '4px',
                'margin-right' => '4px',
                'margin-bottom' => '4px',
                'display' => 'inline-block',
            ])
        );
    }

    create_lexer_table($db);
    if( read_lexer($db, null, null, dbmode::single) === null) {
    }
}

function delete_tables($db) {
    drop_config($db);
    drop_user($db);
    drop_page($db);
    drop_block($db);
    drop_theme($db);
    drop_lexer($db);
}
