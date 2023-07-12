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
require_once  __DIR__ . '/section.php';
require_once  __DIR__ . '/theme.php';


function create_tables($db)
{
    create_config_table($db);
    if( read_config($db, dbmode::single ) === null) {
        create_config($db,
            CONF_LANGUAGE,
            CONF_SITENAME,
            CONF_SITEOWNER,
            CONF_THEME,
            CONF_LOGO);
    }    
    
    create_user_table($db);
    if( read_user($db, null, null, dbmode::single) === null) {
        create_user($db,
            rawurlencode(CONF_USERNAME),
            rawurlencode(CONF_FULLNAME), 
            rawurlencode(CONF_EMAIL), 
            CONF_PASSWORD,
            true);
    }

    create_page_table($db);
    $page_id = 0;
    if( read_page($db, null, null, dbmode::single) === null) {
        $page_id = create_page($db, 0, CONF_HOME_TITLE, CONF_USERNAME, 0, true, false);
    }

    create_section_table($db);
    if( read_section($db, null, null, dbmode::single) === null) {
        $content = json_encode( [
            'align' => 'left',
            'text' => rawurlencode('Välkommen till Frostbyte')
        ]);
        create_section($db, $page_id, 'text', '20vh', 0, $content );
    }

    create_theme_table($db);
    if( read_theme($db, null, null, dbmode::single) === null) {
        create_theme($db, 'Dark',
            '#202020',// bg1
            '#ffffff',// fg1
            '#000000',// bg2
            '#c8c880',// fg2
            '#202020',// bg3
            '#ffffff',// fg3
            'Arial',// font
            '1.0em',// fsize
            '#c8c880',// links
            '#f5deb3',// bg4
            '#202020',// fg4
            '#ffeec3',// bg4h
            '#101010',// fg4h
            '#a89a7f',// bg4l
            '#000000',// fg4l
            '#303030',// bg5
            '#ffffff',// fg5
            '#404040',// bg5s
            '#ffffff',// fg5s
            '#2d5279',// bg6
            '#ffffff',// fg6
            '1.2em',// nav_fsize
            'bold',// nav_fweight
            '0px solid #7f7f7f',// nav_border
            '0px solid #7f7f7f',// footer_border
            '0px solid #7f7f7f',// main_border
            '8px',// nav_radius
            '8px',// footer_radius
            '8px',// main_radius
            '32px',// shadow_size
            'transparent',// nav_shadow
            'transparent',// footer_shadow
            'transparent',// main_shadow
            '0.8em',// footer_fsize
            'italic',// footer_fstyle
            '#c8c880',// title_fg
            '#000000' // more_shadow
        );

        create_theme($db, 'Light',
            '#202020',// bg1
            '#ffffff',// fg1
            '#000000',// bg2
            '#c8c880',// fg2
            '#202020',// bg3
            '#ffffff',// fg3
            'Arial',// font
            '1.0em',// fsize
            '#c8c880',// links
            '#f5deb3',// bg4
            '#202020',// fg4
            '#ffeec3',// bg4h
            '#101010',// fg4h
            '#a89a7f',// bg4l
            '#000000',// fg4l
            '#303030',// bg5
            '#ffffff',// fg5
            '#404040',// bg5s
            '#ffffff',// fg5s
            '#2d5279',// bg6
            '#ffffff',// fg6
            '1.2em',// nav_fsize
            'bold',// nav_fweight
            '0px solid #7f7f7f',// nav_border
            '0px solid #7f7f7f',// footer_border
            '0px solid #7f7f7f',// main_border
            '8px',// nav_radius
            '8px',// footer_radius
            '8px',// main_radius
            '32px',// shadow_size
            'transparent',// nav_shadow
            'transparent',// footer_shadow
            'transparent',// main_shadow
            '0.8em',// footer_fsize
            'italic',// footer_fstyle
            '#c8c880',// title_fg
            '#000000' // more_shadow
        );
    }
}

function delete_tables($db) {
    drop_config($db);
    drop_user($db);
    drop_page($db);
    drop_section($db);
    drop_theme($db);
}
