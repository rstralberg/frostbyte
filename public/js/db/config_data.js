// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// JS version of PHP Config database table
//

class config_data
{
    language = '';
    sitename = '';
    siteowner = '';
    theme = '';
    charset = '';
    logo = '';
    showheaders = false;

    static get data() { return config_data._data;} 
    
    static columns() {return [
        'id',
        'language',
        'sitename',
        'siteowner',
        'theme',
        'charset',
        'logo',
        'showheaders']; }
}

function load_config()  {
    config_data._data = sql_read('`config`', config_data.columns(), '`id`=1', '', sql_mode.single);
    return config_data.data;
}

function update_config_value(col,value) {
    sql_write('config', [col], [sql_string(value)], 'id=1');
}

