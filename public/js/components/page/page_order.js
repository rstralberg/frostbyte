
function page_order(pages) {

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
            title: 'Ordning',
            cancel: false,
            fixed: true,
            css: ['iform', 'page-order']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: 'Här kan du välja ordningen som sidorna ska ha i menyn.' +
                'Markera med musen och dra',
            rows: 6,
            cols: 30
        },
        {
            type: FormType.List,
            name: 'pages',
            items: pages_array,
            rows: 8,
            onecol: true,
            width: 'inherit',
            drag: on_drag,
            listener: on_click

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

    function on_click(e) { }
    function on_drag(e) {}
}

