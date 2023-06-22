
function create_page() {
    create_form('Ny sida', 'Skapa', [
        {
            name: 'title',
            type: 'text',
            label: 'Titel',
            value: '',
        }])
        .then(
            (result) => {
                sql_insert('page',
                    [`title`, `parent`, `pos`, `author`],
                    [
                        sql(encodeURIComponent(result['title'])),
                        sql(0),
                        sql(Global.navbar.childElementCount - 1),
                        sql(Global.user.username)
                    ])
                    .then(
                        (id) => {
                            window.location = `/${id}`;
                        },
                        (error) => { logg(`new_page: ${error}`); }
                    );
            });
}

function delete_page() {

    if (is_valid(Global.page.id)) {
        yesno('Radera sidan', 'Är du säker', () => {
            sql_delete('page', `id=${Global.page.id}`)
                .then(
                    () => {
                        window.location = '/';
                    }
                );
        });
    }
}

function rename_page() {

    create_form('Nytt namn', 'Byt namn', [
        {
            type: FormType.Text,
            name: 'title',
            label: 'Titel',
            value: Global.page.title
        }])
        .then(
            (resolve) => {
                let title = resolve['title'];
                sql_update('page', [`title`], [sql(encodeURIComponent(title))], `id=${Global.page.id}`)
                    .then(
                        (_success) => {
                            navbar_rename_item(Global.page.id, title);
                            Global.page.title = title;
                        },
                        (error) => {
                            logg(`rename_page: ${error}`);
                        });
            });
}

function load_page(id) {
    return new Promise((resolve) => {
        sql_select('page', ['*'], `id=${id}`, 'pos asc').then(
            (pages) => {
                if (pages.length === 0) {
                    logg(`Kunde inte hitta sidan med id=${id}`);
                    resolve();
                } else {

                    let page = pages[0];
                    Global.page = {
                        id: parseInt(page.id),
                        parent: parseInt(page.parent),
                        title: decodeURIComponent(page.title),
                        author: decodeURIComponent(page.author),
                        pos: parseInt(page.pos)
                    };
                    load_page_sections(id);
                    resolve();
                }
            },
            () => {
                resolve();
            });
    });
}

