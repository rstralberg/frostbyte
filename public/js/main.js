
function main(args) {

    load_config().then(
        () => {
            load_user(get_cookie('username')).then(
                () => {
                    load_site(args.page);
                },
                () => {
                    load_site(args.page);
                });
        });

    function load_site(page) {
        load_page(parseInt(args.page)).then(() => {
            load_navbar().then(() => {
                load_footer();
                load_toolbar();
            });
        });
    }

}

