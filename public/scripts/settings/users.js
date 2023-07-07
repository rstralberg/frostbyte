window.curuser = null;

function set_curuser(user) {
    window.curuser = user;
}

function get_curuser() {
    return window.curuser;
}


function users() {

    let curuser = get_curuser();
    let users = sql_load_users();
    let usernames = Array();
    for (let i = 0; i < users.length; i++) {
        usernames.push(users[i].username);
    }
    iform(Lexer.USERS, Lexer.SAVE, [], [
        new iParam('users-select', 'select', Lexer.USERS, usernames, [], user_selected),
        new iParam('users-name', 'text', Lexer.USERNAME, curuser.username, [{ name: 'readonly', value: true }], null),
        new iParam('users-full', 'text', Lexer.FULL_NAME, curuser.fullname, [], null),
        new iParam('users-email', 'email', Lexer.EMAIL, curuser.email, [], null),
        new iParam('users-pages', 'checkbox', Lexer.PAGES, curuser.pages, [{ name: 'disabled', value: curuser.pages ? 'true' : null }], null),
        new iParam('users-system', 'checkbox', Lexer.SETTINGS, curuser.system, [{ name: 'disabled', value: curuser.system ? 'true' : null }], null),
        new iParam('users-theme', 'checkbox', Lexer.THEME, curuser.theme, [{ name: 'disabled', value: curuser.system ? 'true' : null }], null),
        new iParam('users-new', 'button', Lexer.CREATE + ' ' + Lexer.NEW_USER, '', [], new_user)
    ], (values) => {
        sql_update_user(
            iform_get(values, 'users-name'),
            iform_get(values, 'users-full'),
            iform_get(values, 'users-email'),
            iform_get(values, 'users-pages'),
            iform_get(values, 'users-system'),
            iform_get(values, 'users-theme'));
    });


    function user_selected(id, value) {
        if (id === 'users-select') {
            let user = sql_load_user(value);
            document.getElementById('users-name').value = user.username;
            document.getElementById('users-full').value = user.fullname;
            document.getElementById('users-email').value = user.email;
            document.getElementById('users-pages').checked = user.pages;
            document.getElementById('users-system').checked = user.system;
            document.getElementById('users-theme').checked = user.theme;

            if (get_curuser().system !== '1') {
                document.getElementById('users-pages').setAttribute('disabled', 'true');
                document.getElementById('users-system').setAttribute('disabled', 'true');
                document.getElementById('users-theme').setAttribute('disabled', 'true');
            }
            else {
                document.getElementById('users-pages').removeAttribute('disabled');
                document.getElementById('users-system').removeAttribute('disabled');
                document.getElementById('users-theme').removeAttribute('disabled');
            }
        }
    }

    function new_user(id, value) {
        if (id === 'users-new') {

            if (document.getElementById('users-new').innerHTML === Lexer.REGRET) {
                safe_replace_class(document.getElementById('users-select'), 'hidden', 'iselect');
                document.getElementById('users-new').innerHTML = Lexer.CREATE + ' ' + Lexer.NEW_USER;
                document.getElementById('users-select').dispatchEvent(new Event('mouseup', {}));
            }
            else {
                document.getElementById('users-name').value = '';
                document.getElementById('users-name').removeAttribute('readonly');
                document.getElementById('users-name').focus();

                document.getElementById('users-full').value = '';
                document.getElementById('users-email').value = '';
                document.getElementById('users-pages').checked = false;
                document.getElementById('users-system').checked = false;
                document.getElementById('users-theme').checked = false;

                safe_replace_class(document.getElementById('users-select'), 'iselect', 'hidden');


                document.getElementById('users-new').innerHTML = Lexer.REGRET;
            }
        }
    }

}