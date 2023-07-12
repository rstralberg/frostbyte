
function page_edit(pages) {

    create_form(Page.FORM_EDIT,
        {
            title: 'Hantering av sidor',
            cancel: false,
            fixed: true,
            css: ['iform', 'page-edit']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: 'Här kan du skapa, radera och kopiera sidor',
            rows: 2,
            cols: 30
        },
        {
            type: FormType.Button,
            name: 'create-page',
            value: 'Skapa',
            onecol: true,
            width: 'inherit',
            listener:  (e) => { create_page(true); }
        },
        {
            type: FormType.Button,
            name: 'delete-page',
            value: 'Radera',
            onecol: true,
            width: 'inherit',
            listener: (e) => { delete_page(pages); }
        },
        {
            type: FormType.Button,
            name: 'duplicate-page',
            value: 'Duplicera',
            onecol: true,
            width: 'inherit',
            listener: (e) => { duplicate_page(pages); }
        },
        {
            type: FormType.Button,
            name: 'close-all',
            value: 'Stäng',
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

