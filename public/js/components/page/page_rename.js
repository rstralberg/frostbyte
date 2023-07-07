
function rename_page() {
    

    create_form(Page.FORM_RENAME_PAGE, { 
        title: 'Ge sidan nytt namn', 
        action: 'Byt namn' }, [
        {
            type: FormType.Text,
            name: 'title',
            label: 'Nytt namn',
            value: decodeURIComponent(Page.title)
        },
        {
            type: FormType.Checkbox,
            name: 'view-title',
            label: 'Visa titel på sidan',
            value: Page.showtitle
        }
    ])
        .then(
            (values) => {
                let title = values.get('title');
                sql_update('page', [`title`], [sql(encodeURIComponent(title))], `id=${Page.id}`)
                    .then(
                        (_success) => {
                            navbar_rename_item(Page.id, title);
                        },
                        (error) => {
                            logg(`rename_page: ${error}`);
                        });
            });


}