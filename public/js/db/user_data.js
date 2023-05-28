
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


function load_user(username) {
    let user = sql_read('user', user_data.columns(), '`username`=' + sql_string(username)); 
    if( user === null ) {
        return null;
    }
    user.pages = sql_is_true(user.pages);
    user.system = sql_is_true(user.system);
    user.theme = sql_is_true(user.theme);
    return user;
}

function verify_user( username, password ) {
    
    let data = request('verify_user',
    [
        { key: 'username', value: username },
        { key: 'password', value: password }
    ]);

    return data.success ;
}
