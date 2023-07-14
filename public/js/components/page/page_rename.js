
function rename_page() {
    

    create_form(Page.FORM_RENAME_PAGE, { 
        title: Trans.tag('give-new-page-name'), 
        action: Trans.tag('change-name') }, [
        {
            type: FormType.Text,
            name: 'title',
            label: Trans.tag('new-name'),
            value: decodeURIComponent(Page.title)
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
            },
            (_reject) => {
                
            }
            );


}