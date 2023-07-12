
function create_page(reboot) {

    return new Promise((resolve, reject) => {
        var pagearray = new Array();
        sql_select('page', ['id', 'title'], '`host`=1').then(
            (pages) => {
                pagearray.push({
                    value: 0,
                    text: 'Ingen'
                });
                pages.forEach(page => {
                    pagearray.push({
                        value: parseInt(page.id),
                        text: decodeURIComponent(page.title)
                    });
                });
                create_form(Page.FORM_CREATE_PAGE,
                    {
                        title: 'Ny sida',
                        action: 'Skapa'
                    }, [
                    {
                        type: FormType.Text,
                        name: 'title',
                        label: 'Titel',
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'container',
                        label: 'Förälder till andra sidor',
                        value: false
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'showtitle',
                        label: 'Visa titel på sidan',
                        value: true
                    },
                    {
                        type: FormType.List,
                        name: 'parent',
                        label: 'Förälder',
                        items: pagearray,
                        selected: 0
                    }
                ])
                    .then(
                        (result) => {

                            let parent = parseInt(result.get('parent'));
                            sql_insert('page',
                                [`title`, `parent`, `pos`, `author`, 'showtitle', 'host'],
                                [
                                    sql(encodeURIComponent(result.get('title'))),
                                    sql(parseInt(result.get('parent'))),
                                    sql(document.querySelector('nav').childElementCount - 1),
                                    sql(User.username),
                                    sql(result.get('showtitle') ? 1 : 0),
                                    sql(result.get('host') ? 1 : 0)
                                ])
                                .then(
                                    (id) => {
                                        if (reboot) {
                                            window.location = `/${id}`;
                                        }
                                        else {
                                            update_navbar();
                                        }
                                        resolve(id);
                                    },
                                    (error) => { 
                                        logg(`new_page: ${error}`);
                                        reject();
                                     }
                                );
                        },
                        (_reject) => {
                            reject();
                        });
            });
    });
}