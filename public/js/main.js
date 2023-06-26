
function main(args) {

    console.log('page' + args.page);
    load_config().then(
        () => {
            load_user(get_cookie('username')).then(
                () => {
                    load_navbar().then(() => {
                        load_page(parseInt(args.page)).then(() => {
                            load_footer();
                            load_toolbar();
                        });
                    });
                });
        });
}
