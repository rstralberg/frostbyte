
function delete_page(pages) {
    var pages_array = new Array();
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if (page.parent > -1) {
            var item = null;
            if (page.parent === 0) {
                item = {
                    value: page.id,
                    text: page.title,
                };
                pages_array.push(item);

                for (let j = 0; j < pages.length; j++) {
                    let p = pages[j];
                    if (p.parent === page.id) {
                        if (!is_valid(item.items)) {
                            item.items = new Array();
                        }
                        item.items.push({
                            value: p.id,
                            text: p.title,
                        });
                    }
                }
            }
        }
    }

    create_form(Page.FORM_DELETE, {
        title: Trans.tag('delete-page'),
        action: Trans.tag('delete')
    }, [{
        type: FormType.Tree,
        name: Page.FORM_DELETE_TREE,
        label: Trans.tag('select-page-to-delete'),
        items: pages_array,
    }
    ]).then((values) => {
        let page_id = values.get(Page.FORM_DELETE_TREE).value;
        let page_title = values.get(Page.FORM_DELETE_TREE).innerText;
        if (is_valid(page_id)) {

            sql_select('page', ['id', 'title'], 'parent=' + page_id).then((pages) => {
                let question = Trans.tag('delete-the-page') + ' ' + page_title + ' ';
                if (pages.length > 0) {
                    question += ' ' + Trans.tag('and-its-subpages')
                    pages.forEach(page => {
                        question += decodeURIComponent(page.title) + ' ';
                    });
                    question = question.slice(0, -1);
                }

                yesno(Trans.tag('delete'), question + '. ' + Trans.tag('are-you-sure')).then((resolve) => {
                    if (resolve === 'yes') {
                        sql_delete('page', `parent=${page_id}`).then(() => {
                            sql_delete('page', `id=${page_id}`).then(() => {
                                update_navbar();
                            });
                        });

                    }
                });
            });
        }
    });

}