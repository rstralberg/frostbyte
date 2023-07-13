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
            CONF_LOGO,
            CONF_DEBUG);
    }    
    
    create_user_table($db);
    if( read_user($db, null, null, dbmode::single) === null) {
        create_user($db,
            CONF_USERNAME,
            CONF_FULLNAME, 
            CONF_EMAIL, 
            CONF_PASSWORD,
            true);
    }

    create_page_table($db);
    $page_id = 0;
    if( read_page($db, null, null, dbmode::single) === null) {
        $page_id = create_page($db, 0, CONF_HOME_TITLE, CONF_USERNAME, 0, false, '', true, false);
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
            '#202020',// background
            '#ffffff',// color
            '#000000',// bars_background
            '#c8c880',// bars_color
            '#202020',// intense_background
            '#ffffff',// intense_color
            'Arial',// font
            '1.0em',// fsize
            '#c8c880',// links
            '#f5deb3',// titles_background
            '#202020',// titles_color
            '#ffeec3',// ctl_background_hover
            '#101010',// ctl_color_hover
            '#a89a7f',// ctl_background_active
            '#000000',// ctl_color_active
            '#303030',// section_background
            '#ffffff',// section_color
            '#404040',// section_selected_background
            '#ffffff',// section_selected_color
            '#2d5279',// button_background
            '#ffffff',// button_color
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
            '#C0BFBC',
            '#000000',
            '#000000',
            '#c8c880',
            '#202020',
            '#ffffff',
            'Arial',
            '1.0em',
            '#c8c880',
            '#f5deb3',
            '#202020',
            '#ffeec3',
            '#101010',
            '#a89a7f',
            '#000000',
            '#303030',
            '#ffffff',
            '#404040',
            '#ffffff',
            '#2d5279',
            '#ffffff',
            '1.2em',
            'bold',
            '0px solid #7f7f7f',
            '0px solid #7f7f7f',
            '0px solid #7f7f7f',
            '8px',
            '8px',
            '8px',
            '32px',
            'transparent',
            'transparent',
            'transparent',
            '0.8em',
            'italic',
            '#c8c880',
            '#00000');
    }
}

function delete_tables($db) {
    drop_config($db);
    drop_user($db);
    drop_page($db);
    drop_section($db);
    drop_theme($db);
}
