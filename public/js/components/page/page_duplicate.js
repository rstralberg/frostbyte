
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
        title: 'Skapa kopia av vald sida',
        action: 'Skapa'
    }, [
        {
            type: FormType.Tree,
            name: Page.FORM_DELETE_TREE,
            label: 'Välj sida att radera',
            items: pages_array
        },
        {
            type: FormType.Text,
            name: 'pagename',
            label: 'Kopians namn',
        }
    ])
        .then(
            (values) => {
                let page_id = parseInt(values.get(Page.FORM_DELETE_TREE));
                if (is_valid(page_id)) {

                    sql_select('page', ['id', 'title'], 'parent=' + page_id)
                        .then((pages) => {
                            let question = 'Radera sidan'
                            if (pages.length > 0) {
                                question += ' och dess underliggande sidor '
                                pages.forEach(page => {
                                    question += page.title + ' ';
                                });
                            }

                            yesno(question, 'Är du säker', () => {
                                sql_delete('page', `id=${page_id}`);
                            });
                        });
                }
            }
        );
}