
function permissions() {

    let pages = sql_select('select title from page order by title asc');
    let pagenames = new Array();
    for (let i = 0; i < pages.length; i++) {
        pagenames.push( pages[i].title );
    }

    let users = sql_load_users();
    let usernames = new Array();
    for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
    }

    iform(Lexer.PAGE_PERMISSIONS, null, [], [
        new iParam('perm-pages', 'select', Lexer.PAGES, pagenames, [], page_selected),
        new iParam('perm-users', 'select', Lexer.USERS, usernames, [], user_selected),
        new iParam('perm-edit', 'checkbox', Lexer.CAN_EDIT, false, [], perm_changed )
    ]);

    function page_selected(id,value) {
        let username = document.getElementById('perm-users').value;
        let res = sql_select('select * from permission where '
            + 'username=' + sql_string(username) + ' and ' 
            + 'pagetitle=' + sql_string(value) );
        if( res.length > 0 ) {
            iupdate('perm-edit', true);
        }
        else {
            iupdate('perm-edit', false);
        }
    }

    function user_selected(id,value) {
        let pagetitle = document.getElementById('perm-pages').value;
        let res = sql_select('select * from permission where ' 
            + 'username=' + sql_string(value)  + ' and '
            + 'pagetitle=' + sql_string(pagetitle));
        iupdate('perm-edit', res.length > 0 );
    }

    function perm_changed(id, value) {
        let pagetitle = document.getElementById('perm-pages').value;
        let username = document.getElementById('perm-users').value;
        let canedit = value;

        let exists = sql_select('select * from permission where '
            + 'username=' + sql_string(username) + ' and '
            + 'pagetitle=' + sql_string(pagetitle));
        if( exists.length > 0 && !canedit) {
            sql_delete('delete from permission where ' 
                + 'username=' + sql_string(username) + ' and '
                + 'pagetitle=' + sql_string(pagetitle));
        }
        else if( exists.length === 0 && canedit ) {
            sql_insert('insert into permission (pagetitle, username) values ('
                + sql_string(pagetitle) + ','
                + sql_string(username) + ')');
        }
    }
}

