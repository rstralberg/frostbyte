
function on_logout() {

    yesno(T('logout'), T('confirm_logout'), () =>  {
        global.user = null;
        window.location = '/';
    });
}

