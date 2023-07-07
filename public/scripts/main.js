
function main(args) {

    set_curuser(args.user);
    set_page(args.page);
    set_config(args.config);
    window.ed_fonts = args.fonts;

    if (get_curuser() === null &&  get_cookie('username') ) {
        set_curuser(sql_load_user(get_cookie('username')));
    }

    window.resizing = false;
    set_selection(null);
    window.cursel = null;

    let body = document.querySelector('body');
    body.appendChild(document.createElement('nav'));
    body.appendChild(document.createElement('main'));
    body.appendChild(document.createElement('footer'));

    create_navbar();
    create_content();
    create_footer();

    if (args.login) {
        login();
    } else if (args.register) {
        register();
    }
}

