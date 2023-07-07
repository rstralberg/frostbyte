//  id: int
//  username: string
//  fullname: string
//  password: string
//  email: string
//  pages: boolean
//  system: boolean
//  theme: boolean

function sql_load_users() {
    let rows = sql_select('select * from user order by username asc');
    rows.forEach(user => {
        user.id = parseInt(user.id);
        user.pages = parseInt(user.pages) != 0;
        user.system = parseInt(user.system) != 0;
        user.theme = parseInt(user.theme) != 0;
    });
    return rows;
}

function sql_load_user(username) {
    let rows = sql_select('select * from user where username=' + sql_string(username));
    if (rows.length > 0) {
        let user = rows[0];
        user.id = parseInt(user.id);
        user.pages = parseInt(user.pages) != 0;
        user.system = parseInt(user.system) != 0;
        user.theme = parseInt(user.theme) != 0;
        return user;
    }
    else {
        return null;
    }
}

// returns stored user.id
function sql_add_user(username, fullname, email, password) {
    return sql_insert('insert into user ('
        + 'username,'
        + 'fullname,'
        + 'email,'
        + 'password,'
        + 'pages,'
        + 'system,'
        + 'theme )'
        + 'values ('
        + sql_string(username) + ','
        + sql_string(fullname) + ','
        + sql_string(email) + ','
        + sql_string(password) + ','
        + '0,'
        + '0,'
        + '0)');
}

function sql_update_user(username, fullname, email, pages, system, theme) {
    sql_update('update user set '
        + 'fullname=' + sql_string(fullname) + ','
        + 'email=' + sql_string(email) + ','
        + 'pages=' + (pages ? 1 : 0) + ','
        + 'system=' + (system ? 1 : 0) + ','
        + 'theme=' + (theme ? 1 : 0) + ' '
        + 'where username=' + sql_string(username));
}

function sql_delete_user(username) {
    sql_delete('delete from user where username=' + sql_string(username));
}
