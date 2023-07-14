
function duplicate_page(pages) {

    var pages_array = new Array();
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        pages_array.push({
            value: page.id,
            text: page.title
        });
    }


    create_form(Page.FORM_DUPLICATE, {
        title: Trans.tag('create-copy-of-selected-page'),
        action: Trans.tag('create')
    }, [
        {
            type: FormType.Tree,
            name: Page.FORM_DUPLICATE_TREE,
            label: Trans.tag('select-page'),
            items: pages_array
        },
        {
            type: FormType.Text,
            name: 'pagename',
            label: Trans.tag('name-of-copy'),
        }
    ])
        .then(
            (values) => {
                let page_id = parseInt(values.get(Page.FORM_DELETE_TREE));
                if (is_valid(page_id)) {

                    sql_select('page', ['*'], 'id=' + page_id)
                        .then((pages) => {
                            if (pages.length > 0) {
                                let page = pages[0];
                                sql_insert('page', ['parent', 'title', 'author', 'pos', 'showtitle', 'host'],
                                    [sql(page.parent),
                                    sql(encodeURIComponent(values.get('pagename'))),
                                    sql(User.username),
                                    sql(document.querySelector('main').childElementCount),
                                    sql(1),
                                    sql(0)]).then((id) => {
                                        update_navbar();
                                    });

                            }
                        },
                            () => { });
                }
            }
        );
}