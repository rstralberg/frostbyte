
function create_page() {
    create_form('create-page', { title: 'Ny sida', action: 'Skapa' }, [
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

    create_form('page-rename', { title: 'Nytt namn', action: 'Byt namn' }, [
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


var pages = new Array();

function edit_pages() {

    pages = new Array();

    sql_select('page', ['*'])
        .then(
            (pagearray) => {
                pagearray.forEach(p => {
                    pages.push({
                        id: parseInt(p.id),
                        parent: parseInt(p.parent),
                        pos: parseInt(p.pos),
                        title: decodeURIComponent(p.title)
                    });
                });
                create_page_form(pages);
            });


    function create_page_form(pages) {

        const select_pages = new Array();
        const parent_pages = new Array();
        const top_pages = new Array();
        const sub_pages = new Array();

        var selected = null;

        parent_pages.push({
            value: -1,
            text: 'Ingen',
            opt: -1
        });
        parent_pages.push({
            value: -1,
            text: 'Toppmeny',
            opt: 0
        });
        pages.forEach(page => {
            select_pages.push({
                value: page.id,
                text: page.title,
                opt: page.parent
            });
            if (pages[0].parent === page.id) {
                selected = page.id;
            }
            parent_pages.push({
                value: page.id,
                text: page.title,
                opt: page.parent
            });
            if (page.parent === 0) {
                top_pages.push({
                    value: page.id,
                    text: page.title,
                    opt: page.parent
                });
            }
            if (page.parent === pages[0].id) {
                sub_pages.push({
                    value: page.id,
                    text: page.title,
                    opt: page.parent
                });
            }
        });
        
        create_form('order-pages', { title: 'Ordna sidor', fixed: true }, [
            {
                type: FormType.List,
                name: 'pages',
                label: 'Välj sida',
                items: select_pages,
                listener: on_page_select
            },
            {
                type: FormType.List,
                name: 'parents',
                label: 'Ska tillhöra',
                items: parent_pages,
                selected: selected,
                listener: on_parent_select,
            }
        ], true);

        function on_page_select(e) {

            let page_id = parseInt(e.value);
            let parents = document.getElementById('parents');
            remove_childs(parents);

            let option = document.createElement('option');
            option.classList.add('ioption');
            option.value = 0;
            option.innerText = 'Ingen';
            option.setAttribute('data-opt', -1);
            parents.appendChild(option);

            option = document.createElement('option');
            option.classList.add('ioption');
            option.value = 0;
            option.innerText = 'Toppmeny';
            option.setAttribute('data-opt', 0);
            parents.appendChild(option);

            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];

                let option = document.createElement('option');
                option.classList.add('ioption');
                option.value = page.id;
                option.disabled = page.id === page_id;
                option.innerText = page.title;
                option.setAttribute('data-opt', page.parent);
                parents.appendChild(option);
            };
        }

        function on_parent_select(source) {

            let pages = document.getElementById('pages');
            if (pages.selectedIndex != -1) {

                let target = pages.options[pages.selectedIndex];
                console.log(`Target: ${target.innerText} id=${target.value} parent=${target.getAttribute('data-opt')}`);
                console.log(`Source : ${source.text} id=${source.value}`);

                let parent = parseInt(source.opt);
                if (parent < 0) parent = -1;

                target.setAttribute('data-parent', parent);
                sql_update('page', ['parent'], [sql(parent)], `id=${parseInt(target.value)}`)
                    .then(
                        (_result) => {
                            update_navbar();
                        }
                    );
            }
        }

        create_form('sort-pages', { title: 'Sortera sidor', pos: { x: '40vw', y: '7vh' }, fixed: true }, [
            {
                type: FormType.List,
                name: 'top-pages',
                label: 'Toppmeny',
                items: top_pages,
                rows: 10,
                drag: on_top_drag,
                listener: on_top_select
            },
            {
                type: FormType.List,
                name: 'sub-pages',
                label: 'Undermeny',
                items: sub_pages,
                rows: 10,
                selected: selected,
                drag: on_sub_drag
            }
        ], true);

        function on_top_select(e) {
            let pageid = parseInt(e.value);
            let subs = document.getElementById('sub-pages');
            remove_childs(subs);
            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];
                if (page.parent === pageid) {
                    subs.appendChild(create_option(page, pageid));
                }
            }
        }

        function on_top_drag(e) { 
            on_drag('top-pages');
        }

        function on_sub_drag(e) { 
            on_drag('sub-pages'); 
        }

        function on_drag(list_id) {
            let list = document.getElementById(list_id);
            let query = 'update page p join ( ';
            query += `select ${parseInt(list.children[0].value)} as id, 0 as new_pos `;
            for (let pos = 1; pos < list.childElementCount; pos++) {
                let id = parseInt(list.children[pos].value);
                query += `union all select ${id}, ${pos} `;
            }
            query += ') vals on p.id = vals.id set pos = new_pos';
            sql_query(query).then(() => { update_navbar(); });
        }

        function create_option(page, page_id) {
            let option = document.createElement('option');
            option.classList.add('ioption');
            option.value = page.id;
            option.disabled = page.id === page_id;
            option.innerText = page.title;
            option.setAttribute('data-opt', page.parent);
            return option;
        }
    }
}



