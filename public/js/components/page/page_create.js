
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
                        title: Trans.tag('new-page'),
                        action: Trans.tag('create')
                    }, [
                    {
                        type: FormType.Text,
                        name: 'title',
                        label: Trans.tag('title'),
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'container',
                        label: Trans.tag('page-parent'),
                        value: false
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'showtitle',
                        label: Trans.tag('show-page-title'),
                        value: true
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'blog',
                        label: Trans.tag('is-a-blog'),
                        value: false
                    },
                    {
                        type: FormType.TextArea,
                        name: 'blogheader',
                        label: Trans.tag('blog-intro'),
                        rows: 4,
                        cols: 80
                    },
                    {
                        type: FormType.List,
                        name: 'parent',
                        label: Trans.tag('parent'),
                        items: pagearray,
                        selected: 0
                    }
                ])
                    .then(
                        (result) => {

                            let parent = parseInt(result.get('parent'));
                            sql_insert('page',
                                [`title`, `parent`, `pos`, `author`, 'showtitle', 'host', 'blog', 'blogheader'],
                                [
                                    sql(encodeURIComponent(result.get('title'))),
                                    sql(parseInt(result.get('parent'))),
                                    sql(document.querySelector('nav').childElementCount - 1),
                                    sql(User.username),
                                    sql(result.get('showtitle') ? 1 : 0),
                                    sql(result.get('host') ? 1 : 0),
                                    sql(result.get('blog') ? 1 : 0),
                                    sql(encodeURIComponent(result.get('blogheader')))
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