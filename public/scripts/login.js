
function login() {

    iform(Lexer.LOGIN, Lexer.LOGIN, [], [
        new iParam('login-username', 'text', Lexer.USERNAME, '', [], null),
        new iParam('login-password', 'password', Lexer.PASSWORD , '', [], null)],
        (response) => {
            request('login', [
                { key: 'username', value: iform_get(response, 'login-username') },
                { key: 'password', value: iform_get(response, 'login-password') }
            ], (response) => {
                let reply = JSON.parse(response);
                if (reply.success ) {
                    set_cookie('username',reply.user.username);
                    window.location = '/?username=' + reply.user.username + '&password=' + reply.user.password;
                }
            });
        });
}
