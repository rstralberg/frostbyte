
function load_user(username) {
    Global.user = {
        username: '',
        fullname: '',
        email:'',
        power: false,
        valid: false
    };
    return new Promise( (resolve) => {
    if (!is_valid(username)) {
        resolve(); 
    }
    sql_select('user', ['*'], `username=${sql(encodeURIComponent(username))}`).
        then(
            (users) => {
                if (users.length > 0) {
                    let user = users[0];
                    Global.user = {
                        username: decodeURIComponent(user.username),
                        fullname: decodeURIComponent(user.fullname),
                        email: decodeURIComponent(user.email),
                        power: user.power == '1',
                        valid: true
                    };
                    navbar_logged_in(true);
                    resolve();
                }
            },
            () => {
                resolve();
            });
    });
}

function login() {

    create_form('login', { title: 'Logga in', action: 'Logga in' }, [
        {
            type: FormType.Text,
            name: 'username',
            label: 'Användare',
        },
        {
            type: FormType.Password,
            name: 'password',
            label: 'Lösenord',
        }])
        .then(
            (result) => {
                var username = result.get('username');
                var password = result.get('password');  
                req('verify_user', {
                    username: username,
                    password: password
                })
                    .then(
                        (resolve) => {
                            set_cookie('username', username);
                            load_user(username);
                        });
            });
}

function logout() {

    yesno('Logga ut', 'Är du säker?', () => {
        set_cookie('username', null);
        Global.user.valid = false;
    });
}

function edit_users() {

    sql_select('user', [`username`])
        .then(
            (usernames) => {

                let names = new Array();
                usernames.forEach(name => {
                    names.push({ value:decodeURIComponent(name.username), text: decodeURIComponent(name.username) });
                });

                create_form('user-edit', { title: 'Redigera användare', action: 'Välj' }, [
                    {
                        type: FormType.List,
                        name: 'usernames',
                        label: 'Användare',
                        items: names,
                        selected: Global.user.username
                    }]).then(
                        (resolve) => {
                            sql_select('user', ['*'], `\`username\`=${sql(resolve.get('usernames'))}`).then(
                                (users) => {
                                    users[0].username = decodeURIComponent(users[0].username);
                                    users[0].fullname = decodeURIComponent(users[0].fullname);
                                    users[0].email = decodeURIComponent(users[0].email);
                                    users[0].power = users[0].power === '1';
                                    
                                    edit_user(users[0]);
                                });
                        });
            });
}

function edit_user(user) {

    create_form('user-edit-one', { title: user.username, action: 'Spara' }, [
        {
            type: FormType.Text,
            name: 'fullname',
            label: 'Fullständigt namn',
            value: user.fullname
        },
        {
            type: FormType.Email,
            name: 'email',
            label: 'Epost adress',
            value: user.email
        },
        {
            type: FormType.Checkbox,
            name: 'power',
            label: 'Administratör',
            value: user.power
        }
    ]).then(
        (resolve) => {
            sql_update('user',
                [`fullname`, `email`, `power`],
                [
                    sql(encodeURIComponent(resolve.get('fullname'))), 
                    sql(encodeURIComponent(resolve.get('email'))),
                    sql(resolve.get('power'))],
                `\`username\`=${sql(user.username)}`);
        });
}
