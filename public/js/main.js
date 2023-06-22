
function main(args) {

    console.log('page' + args.page);
    load_config().then(
        () => {
            load_navbar();
            load_user(get_cookie('username')).then(
                () => {

                    load_page(parseInt(args.page)).then(
                        () => {
                            load_footer();
                            load_toolbar();
                        });
                });
        });

}
