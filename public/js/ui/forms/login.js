function login() {

    const FORM_ID = 'login-form';
    
    var username = '';
    var password = '';
    let form = create_form(FORM_ID, T('login'), [
        create_text('text', T('username'), '', (value) => {
            username = value;
        } ),
        create_text('password', T('password'), '', (value) =>{
            password = value;
        } ),
        create_button(T('login'), 'left', () => {
            if( verify_user(username, password) ) {
                let user = load_user(username);
                if( user ) {
                    global.user = user;
                    close_form(FORM_ID);
                    window.location = `/?username=${user.username}&password=${user.password}`;
                }
            } else {
                alert( T('login_failed') );
            }             
        }),
        create_button(T('close'), 'right', () => {
            close_form(FORM_ID);
        })
    ]);
    open_form(form);
}