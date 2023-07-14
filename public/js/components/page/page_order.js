
function page_order(pages) {

    sql_select('page', ['id', 'title'], )


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

    create_form(Page.FORM_ORDER,
        {
            title: Trans.tag('order'),
            cancel: false,
            fixed: true,
            css: ['iform', 'page-order']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: Trans.tag('order-with-mouse'),
            rows: 6,
            cols: 30
        },
        {
            type: FormType.List,
            name: 'order-pages',
            items: pages_array,
            rows: 8,
            onecol: true,
            width: 'inherit',
            drag: true,
            draglistener: on_drag

        }
    ])
        .then(
            (resolve) => {
                close_all();
            },
            (reject) => {
                close_all();
            });

    function close_all() {
        close_form('page-loose');
        close_form('page-order');
    }

    function on_drag(e) {
        let pageslist = document.getElementById('order-pages');
        for( let i=0; i < pageslist.childElementCount; i++ ) {
            sql_update('page', ['pos'], [sql(i)], 'id='+ parseInt(pageslist.children[i].value));
        }
        update_navbar();
    }
}

