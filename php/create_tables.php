<?php
require_once __DIR__ . "/conf.php";
require_once __DIR__ . "/lexer.php";
require_once __DIR__ . "/storage/db.php";
require_once __DIR__ . "/storage/config.php";
require_once __DIR__ . "/storage/user.php";
require_once __DIR__ . "/storage/theme.php";
require_once __DIR__ . "/storage/themeblock.php";
require_once __DIR__ . "/storage/block.php";
require_once __DIR__ . "/storage/page.php";
require_once __DIR__ . "/storage/section.php";
require_once __DIR__ . "/storage/media.php";
require_once __DIR__ . "/storage/gallery.php";
require_once __DIR__ . "/storage/picture.php";
require_once __DIR__ . "/storage/permission.php";
require_once __DIR__ . "/storage/header.php";
require_once __DIR__ . "/storage/code.php";
require_once __DIR__ . "/storage/blockquote.php";



function create_tables($db)
{

    new Config($db);
    new Block($db);
    new Gallery($db);
    new Media($db);
    new Page($db);
    new Permission($db);
    new Picture($db);
    new Section($db);
    new Header($db);
    new Theme($db);
    new User($db);
    new Code($db);
    new BlockQuote($db);

    $configs = Config::read($db);
    if (count($configs) === 0) {
        create_config(
            $db,
            CONF_LANGUAGE,
            CONF_SITENAME,
            CONF_SITEOWNER,
            CONF_THEME,
            CONF_CHARSET,
            CONF_LOGO,
            CONF_SHOWHEADERS
        );
    }
    $config = Config::read($db)[0];

    $themes = Theme::read($db);
    if( count($themes) === 0 ) {
        create_theme($db, $config->theme);
    }

    $users = User::read($db);
    if (count($users) === 0) {
        create_user($db, CONF_USERNAME, CONF_FULLNAME, CONF_PASSWORD, CONF_EMAIL, 1, 1, 1);
    }

    // We may need to create a first time default page
    $all_pages = Page::read($db);
    if (count($all_pages) === 0) {
        $page_id = create_page($db, CONF_HOME, 0, CONF_USERNAME, 0);
        create_picture($db, $page_id, 0, CONF_LOGO, 1, 30, 'center', 'Roland Strålberg');
        create_header($db, $page_id, 1, 'center', Lexer::WELCOME);
        create_section($db, $page_id, 2, '', 'center', Lexer::FIRST_PAGE_TEXT);
        
        $perms = Permission::read($db);
        if (count($perms) === 0) {
            create_permission($db, CONF_HOME, CONF_USERNAME);
        }
    }
}
