
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
    sql_select('user', ['*'], `username=${sql(username)}`).
        then(
            (users) => {
                if (users.length > 0) {
                    let user = users[0];
                    Global.user = {
                        username: user.username,
                        fullname: user.fullname,
                        email: user.email,
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

    create_form('Logga in', 'Logga in', [
        {
            type: FormType.Text,
            name: 'username',
            label: 'Användare',
            value: ''
        },
        {
            type: FormType.Password,
            name: 'password',
            label: 'Lösenord',
            value: ''
        }])
        .then(
            (result) => {
                var username = result['username'];
                var password = result['password'];  
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
                    names.push({ value: name.username, text: name.username });
                });

                create_form('Redigera användare', 'Välj', [
                    {
                        type: FormType.List,
                        name: 'usernames',
                        label: 'Användare',
                        items: names,
                        selected: Global.user.username
                    }]).then(
                        (resolve) => {
                            sql_select('user', ['*'], `\`username\`=${sql(resolve['usernames'])}`).then(
                                (users) => {
                                    edit_user(users[0]);
                                });
                        });
            });
}

function edit_user(user) {

    create_form('edit_user', user.username, 'Spara', [
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
                [sql(resolve['fullname']), sql(resolve['email']),
                sql(resolve['power'])],
                `\`username\`=${sql(user.username)}`);
        });
}
