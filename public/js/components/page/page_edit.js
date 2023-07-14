
function page_edit(pages) {

    create_form(Page.FORM_EDIT,
        {
            title: Trans.tag('page-utilities'),
            cancel: false,
            fixed: true,
            css: ['iform', 'page-edit']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: Trans.tag('create-delete-copy'),
            rows: 2,
            cols: 30
        },
        {
            type: FormType.Button,
            name: 'create-page',
            value: Trans.tag('create'),
            onecol: true,
            width: 'inherit',
            listener:  (e) => { create_page(true); }
        },
        {
            type: FormType.Button,
            name: 'delete-page',
            value: Trans.tag('delete'),
            onecol: true,
            width: 'inherit',
            listener: (e) => { delete_page(pages); }
        },
        {
            type: FormType.Button,
            name: 'duplicate-page',
            value: Trans.tag('duplicate-page'),
            onecol: true,
            width: 'inherit',
            listener: (e) => { duplicate_page(pages); }
        },
        {
            type: FormType.Button,
            name: 'close-all',
            value: Trans.tag('close'),
            onecol: true,
            width: 'inherit',
            listener: (e) => {
                close_form(Page.FORM_ALL)
                close_form(Page.FORM_ORDER);
                close_form(Page.FORM_MENU);
                close_form(Page.FORM_EDIT)
            }
        }
    ]);
}

