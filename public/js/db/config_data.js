
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
