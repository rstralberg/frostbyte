
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
                        sql(encodeURIComponent(result.get('title'))),
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
                let title = resolve.get('title');
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


// var pages = new Array();

// function edit_pages() {

//     pages = new Array();

//     sql_select('page', ['*'])
//         .then(
//             (pagearray) => {
//                 pagearray.forEach(p => {
//                     pages.push({
//                         id: parseInt(p.id),
//                         parent: parseInt(p.parent),
//                         pos: parseInt(p.pos),
//                         title: decodeURIComponent(p.title)
//                     });
//                 });
//                 create_page_form(pages);
//             });


//     function create_page_form(pages) {

//         const select_pages = new Array();
//         const parent_pages = new Array();
//         const top_pages = new Array();
//         const sub_pages = new Array();

//         var selected = null;

//         parent_pages.push({
//             value: -1,
//             text: 'Ingen',
//             opt: -1
//         });
//         parent_pages.push({
//             value: -1,
//             text: 'Toppmeny',
//             opt: 0
//         });
//         pages.forEach(page => {
//             select_pages.push({
//                 value: page.id,
//                 text: page.title,
//                 opt: page.parent
//             });
//             if (pages[0].parent === page.id) {
//                 selected = page.id;
//             }
//             parent_pages.push({
//                 value: page.id,
//                 text: page.title,
//                 opt: page.parent
//             });
//             if (page.parent === 0) {
//                 top_pages.push({
//                     value: page.id,
//                     text: page.title,
//                     opt: page.parent
//                 });
//             }
//             if (page.parent === pages[0].id) {
//                 sub_pages.push({
//                     value: page.id,
//                     text: page.title,
//                     opt: page.parent
//                 });
//             }
//         });

//         create_form('order-pages', { title: 'Ordna sidor', fixed: true }, [
//             {
//                 type: FormType.List,
//                 name: 'pages',
//                 label: 'Välj sida',
//                 items: select_pages,
//                 listener: on_page_select
//             },
//             {
//                 type: FormType.List,
//                 name: 'parents',
//                 label: 'Ska tillhöra',
//                 items: parent_pages,
//                 selected: selected,
//                 listener: on_parent_select,
//             }
//         ], true);

//         function on_page_select(e) {

//             let page_id = parseInt(e.value);
//             let parents = document.getElementById('parents');
//             remove_childs(parents);

//             let option = document.createElement('option');
//             option.classList.add('ioption');
//             option.value = 0;
//             option.innerText = 'Ingen';
//             option.setAttribute('data-opt', -1);
//             parents.appendChild(option);

//             option = document.createElement('option');
//             option.classList.add('ioption');
//             option.value = 0;
//             option.innerText = 'Toppmeny';
//             option.setAttribute('data-opt', 0);
//             parents.appendChild(option);

//             for (let i = 0; i < pages.length; i++) {
//                 let page = pages[i];

//                 let option = document.createElement('option');
//                 option.classList.add('ioption');
//                 option.value = page.id;
//                 option.disabled = page.id === page_id;
//                 option.innerText = page.title;
//                 option.setAttribute('data-opt', page.parent);
//                 parents.appendChild(option);
//             };
//         }

//         function on_parent_select(source) {

//             let pages = document.getElementById('pages');
//             if (pages.selectedIndex != -1) {

//                 let target = pages.options[pages.selectedIndex];
//                 console.log(`Target: ${target.innerText} id=${target.value} parent=${target.getAttribute('data-opt')}`);
//                 console.log(`Source : ${source.text} id=${source.value}`);

//                 let parent = parseInt(source.opt);
//                 if (parent < 0) parent = -1;

//                 target.setAttribute('data-parent', parent);
//                 sql_update('page', ['parent'], [sql(parent)], `id=${parseInt(target.value)}`)
//                     .then(
//                         (_result) => {
//                             update_navbar();
//                         }
//                     );
//             }
//         }

//         create_form('sort-pages', { title: 'Sortera sidor', pos: { x: '40vw', y: '7vh' }, fixed: true }, [
//             {
//                 type: FormType.List,
//                 name: 'top-pages',
//                 label: 'Toppmeny',
//                 items: top_pages,
//                 rows: 10,
//                 drag: on_top_drag,
//                 listener: on_top_select
//             },
//             {
//                 type: FormType.List,
//                 name: 'sub-pages',
//                 label: 'Undermeny',
//                 items: sub_pages,
//                 rows: 10,
//                 selected: selected,
//                 drag: on_sub_drag
//             }
//         ], true);

//         function on_top_select(e) {
//             let pageid = parseInt(e.value);
//             let subs = document.getElementById('sub-pages');
//             remove_childs(subs);
//             for (let i = 0; i < pages.length; i++) {
//                 let page = pages[i];
//                 if (page.parent === pageid) {
//                     subs.appendChild(create_option(page, pageid));
//                 }
//             }
//         }

//         function on_top_drag(e) {
//             on_drag('top-pages');
//         }

//         function on_sub_drag(e) {
//             on_drag('sub-pages');
//         }

//         function on_drag(list_id) {
//             let list = document.getElementById(list_id);
//             let query = 'update page p join ( ';
//             query += `select ${parseInt(list.children[0].value)} as id, 0 as new_pos `;
//             for (let pos = 1; pos < list.childElementCount; pos++) {
//                 let id = parseInt(list.children[pos].value);
//                 query += `union all select ${id}, ${pos} `;
//             }
//             query += ') vals on p.id = vals.id set pos = new_pos';
//             sql_query(query).then(() => { update_navbar(); });
//         }

//         function create_option(page, page_id) {
//             let option = document.createElement('option');
//             option.classList.add('ioption');
//             option.value = page.id;
//             option.disabled = page.id === page_id;
//             option.innerText = page.title;
//             option.setAttribute('data-opt', page.parent);
//             return option;
//         }
//     }
// }


function edit_pages() {

    var pages = new Array();

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
                non_menu_pages(pages);
                page_selector(pages);
                page_hierarchy(pages);
            });

    function non_menu_pages(pages) {

        var pages_array = new Array();
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page.parent < 0) {
                pages_array.push({
                    value: pages[i].id,
                    text: pages[i].title,
                    dclick: on_loose_dbl
                });
            }
        }
        if (pages_array.length === 0) {
            pages_array.push({
                value: -1,
                text: 'Sidor saknas'
            });
        }

        create_form('loose', { title: 'Lösa sidor', action: 'Stäng', pos: { x: ' 1vw', y: '7vh' }, fixed: true }, [
            {
                type: FormType.TextArea,
                name: 'desc',
                value: 'Här kan du välja sidor som ska vara med i någon meny. ' +
                    'Dubbelklicka för att flytta till "Meny"',
                rows: 4,
                cols: 30
            },
            {
                type: FormType.List,
                name: 'pages',
                items: pages_array,
                rows: 10,
                onecol: true,
                width: 'inherit'
            }
        ]);

    }

    function page_selector(pages) {

        var pages_array = new Array();
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page.parent > -1) {
                pages_array.push({
                    value: pages[i].id,
                    text: pages[i].title,
                    dclick: on_menu_dbl
                });
            }
        }

        create_form('menu', { title: 'Meny', action: 'Stäng', pos: { x: '28vw', y: '7vh' }, fixed: true }, [
            {
                type: FormType.TextArea,
                name: 'desc',
                value: 'Här kan du välja sidor som inte ska vara med i någon meny. ' +
                    'Dubbelklicka för att flytta till "Lösa sidor"',
                rows: 6,
                cols: 30
            },
            {
                type: FormType.List,
                name: 'pages',
                items: pages_array,
                rows: 8,
                onecol: true,
                width: 'inherit'

            }
        ]);
    }

    function page_hierarchy() {

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


        create_form('hierachy', { title: 'Hierarki', action: 'Stäng', pos: { x: '55vw', y: '7vh' }, fixed: true }, [
            {
                type: FormType.TextArea,
                name: 'desc',
                value: 'Klicka för att flytta sidor',
                rows: 2,
                cols: 30
            },
            {
                type: FormType.Tree,
                name: 'tree',
                items: pages_array,
                width: 'inherit',
                listener: on_hierarchy_click
            }
        ]);
        function on_hierarchy_click(e) {
            // { item: e.target, value: item.value, base_index: i, sub_index: j  }

            console.log( 'CLICKED IN HIERACY: ' + e.item.innerText);


            let tree = e.item.parentElement;
            while( is_valid(tree) && tree.id !== 'tree' ) {
                tree = tree.parentElement;
            }

            let pages_list = new Array();
            for (let i = 0; i < tree.childElementCount; i++) {
                let item = tree.children[i];
                if (item.id !== e.item.id) {
                    pages_list.push(
                        {
                            value: item.getAttribute('data-value'),
                            text: item.getAttribute('data-text')
                        });
                }
                for (let j = 0; j < item.childElementCount; j++) {
                    let sub = item.children[j];
                    if (sub.tagName === 'UL') {
                        for (let n = 0; n < sub.childElementCount; n++) {
                            let sub2 = sub.children[n];
                            if (sub2.id !== e.item.id) {
                                pages_list.push(
                                    {
                                        value: sub2.getAttribute('data-value'),
                                        text: sub2.getAttribute('data-text')
                                    });
                            }
                        }
                    }
                }
            }

            function dump(i, j, n, item) {
                console.log(`${i}/${j}/${n} ${item.tagName} ${item.getAttribute('data-text')} `);
            }

            create_form('hiearchy-click', {
                title: 'Välj vart du vill flytta',
                action: 'Flytta',
                pos: { x: '55vw', y: '8vh' },
                zindex: 9999
            }, [
                {
                    type: FormType.List,
                    name: 'targets',
                    items: pages_list,
                    required: true
                },
                {
                    type: FormType.List,
                    name: 'dest',
                    items: [
                        { value: 'above', text: 'Ovanför' },
                        { value: 'inside', text: 'Inuti' },
                        { value: 'below', text: 'Nedaför' },
                    ],
                    required: true,
                }
            ])
                .then((result) => {

                    console.log( 'CLICKED IN SELECT: ' + result.get('targets'));
                    let target = parseInt(result.get('targets'));
                    let dest = result.get('dest');

                    for( let i = 0; i < pages_array.length; i++) { 
                        let page = pages_array[i];
                        console.log( `page.value ${parseInt(page.value)} target ${target}`);
                        if( parseInt(page.value) === target ) {
                            console.log( 'FOUND : ' + page.text);
                            
                            switch( dest ) {
                                case 'above': 
                                break;
                                case 'inside': break;
                                case 'below': break;
                            }
                        }
                    }
                });

        }

    }

    function on_loose_dbl(e) {

        let source = document.getElementById('loose').querySelector('select');
        let option = source.options[source.selectedIndex];
        e.opt.dclick = on_menu_dbl;

        let target = document.getElementById('menu').querySelector('select');
        target.appendChild(option);

        if (source.options.length === 0) {
            let empty = document.createElement('option');
            empty.value = -1;
            empty.innerText = 'Sidor saknas';
            source.appendChild(empty);
        }
    }

    function on_menu_dbl(e) {

        let source = document.getElementById('menu').querySelector('select');
        let option = source.options[source.selectedIndex];
        e.opt.dclick = on_loose_dbl;

        let target = document.getElementById('loose').querySelector('select');
        for (let i = 0; i < target.options.length; i++) {
            let o = target.options[i];
            if (parseInt(o.value) === -1) {
                target.options.remove(i);
                break;
            }
        }
        target.appendChild(option);
    }

    function update_pages() {

    }

    function close() {

    }
}