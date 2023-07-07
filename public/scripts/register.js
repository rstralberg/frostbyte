
function register() {

    iform(Lexer.REGISTER, Lexer.REGISTER, [
        { name: 'register-username', type: 'text', label: Lexer.USERNAME },
        { name: 'register-fullname', type: 'text', label: Lexer.FULL_NAME },
        { name: 'register-email', type: 'text', label: Lexer.EMAIL },
        { name: 'register-password', type: 'password', label: Lexer.PASSWORD }],
        (response) => {

            sql_add_user(
                iform_get(response, 'register-username'),
                iform_get(response, 'register-fullname'),
                iform_get(response, 'register-email'),
                iform_get(response, 'register-password'));

            window.location = '/login';
        });
}
