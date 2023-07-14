
function page_menu(pages) {

    sql_select('page', ['id', 'title', 'host'], null, 'pos asc').then((pages) => {
        if (pages.length > 0) {
            let page_array = new Array();
            page_array.push({
                value: 'base',
                text: Trans.tag('base-level')
            });
            pages.forEach(page => {
                if (parseInt(page.host) === 1) {
                    page_array.push({
                        value: parseInt(page.id),
                        text: decodeURIComponent(page.title)
                    })
                }
            });

            create_form(Page.FORM_MENU,
                {
                    title: Trans.tag('menu'),
                    cancel: false,
                    fixed: true,
                    css: ['iform', 'page-menu']
                }, [
                {
                    type: FormType.TextArea,
                    name: 'desc',
                    value: Trans.tag('select-page-to-order'),
                    rows: 2,
                    cols: 30
                },
                {
                    type: FormType.Tree,
                    name: Page.FORM_MENU_TREE,
                    items: page_array,
                    width: 'inherit',
                    listener: on_click
                }
            ]);

            function on_click(e) {
                let id = parseInt(e.value);
                let title = e.innerText;
                let list = document.getElementById('order-pages');
                remove_childs(list);

                if( e.value === 'base') {
                    sql_select('page', ['id', 'title'], 'parent=0', 'pos asc').then( (pages) => {
                        if( pages.length > 0 ) {
                            pages.forEach(page => {
                                let option = document.createElement('option');
                                option.value = parseInt( page.id );
                                option.innerText = decodeURIComponent( page.title );
                                list.appendChild(option);
                            });
                        }
                    });

                } else {
                    sql_select('page', ['id', 'title'], 'parent=' + id, 'pos asc' ).then( (pages) => {
                        if( pages.length > 0 ) {
                            pages.forEach(page => {
                                let option = document.createElement('option');
                                option.value = parseInt( page.id );
                                option.innerText = decodeURIComponent( page.title );
                                list.appendChild(option);
                            });
                        }
                    });
                }
            }
        }
    });
}


