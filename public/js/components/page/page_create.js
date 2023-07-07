
function create_page(e) {
    
    create_form(Page.FORM_CREATE_PAGE,
        {
            title: 'Ny sida',
            action: 'Skapa'
        }, [
        {
            name: 'title',
            type: 'text',
            label: 'Titel',
        }])
        .then(
            (result) => {
                sql_insert('page',
                    [`title`, `parent`, `pos`, `author`],
                    [
                        sql(encodeURIComponent(result.get('title'))),
                        sql(0),
                        sql(document.querySelector('nav').childElementCount - 1),
                        sql(User.username)
                    ])
                    .then(
                        (id) => {
                            window.location = `/${id}`;
                        },
                        (error) => { logg(`new_page: ${error}`); }
                    );
            });
}