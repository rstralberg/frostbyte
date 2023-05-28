// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// JS version of PHP User database table
//

class user_data
{
    username = '';
    fullname = '';
    email = '';
    password = '';
    pages = false;
    system = false;
    theme = false;

    static columns() { return ['username','fullname','email',
        'password', 'pages', 'system', 'theme' ];}
}

function decode_user_data(data) {
    if( typeof data === 'undefined') {
        return null;
    }
    if( data != null ) {
        data.pages = sql_is_true(data.pages);
        data.system = sql_is_true(data.system);
        data.theme = sql_is_true(data.theme);
    }
    return data;
}

function load_user(username) {
    return decode_user_data(sql_read('`user`', user_data.columns(), '`username`=' + sql_string(username))); 
}

function verify_user( username, password ) {
    
    let data = request('verify_user',
    [
        { key: 'username', value: username },
        { key: 'password', value: password }
    ]);

    return data.success ;
}
