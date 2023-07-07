//
// id: int
// language: string
// sitename: string
// siteowner: string
// theme: string
// charset: string
// logo: string
// showheaders: boolean

function sql_load_config() {
    let rows = sql_select('select * from config where id=1');
    if( rows.length > 0 ) {
        let config = rows[0];
        config.id = parseInt(config.id);
        config.showheaders = config.showheaders === '1';
        return rows[0];
    }
    else {
        return null;
    }
}

function sql_update_config(language, sitename, siteowner, theme, charset, logo, showheaders ) {
    sql_update('update config set '
        + 'language=' + sql_string(language) + ','
        + 'sitename=' + sql_string(sitename) + ','
        + 'siteowner=' + sql_string(siteowner) + ','
        + 'theme=' + sql_string(theme) + ','
        + 'charset=' + sql_string(charset) + ','
        + 'logo=' + sql_string(logo) + ','
        + 'showheaders=' + (showheaders?1:0) + ' '
        + 'where id=1');
}

function sql_update_config_showheaders(show) {
    sql_update('update config set '
        + 'showheaders=' + (show?1:0) + ' '
        + 'where id=1');
}