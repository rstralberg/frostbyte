
window.cfg = null;

function set_config(conf) {
    window.cfg = conf;
}

function get_config() {
    return window.cfg;
}


function config() {


    let config = sql_load_config();

    iform(Lexer.SETTINGS, Lexer.SAVE, [], [
        new iParam('config-sitename', 'text', Lexer.SITE_NAME, config.sitename, [], null ),
        new iParam('config-siteowner', 'text', Lexer.SITE_OWNER, config.siteowner, [], null ),
        new iParam('config-theme', 'text', Lexer.THEME, config.theme, [], null ),
        new iParam('config-logo', 'text', Lexer.LOGO, config.logo, [], null )
    ],
    (values) => {

        sql_update_config(config.language,
            iform_get(values, 'config-sitename'),
            iform_get(values, 'config-siteowner'),
            iform_get(values, 'config-theme'),
            config.charset,
            iform_get(values, 'config-logo'),
            config.showheaders );
    });
}



