
function on_new_page() {
    const FORM_ID = 'new-page';
    
    var home = false;
    var title = '';
    let form = create_form(FORM_ID, T('new_page'), [
        create_text('text', T('title'), [], (value) => {
            title = value;
        }),
        create_checkbox(T('start_page'), home, (value) => {
            home = value;
        }),
        create_button(T('create'), (e) => {
            new_page(title, home);
            close_form(FORM_ID);
            window.location = '/';
        }),
        create_button(T('close'), () => {
            close_form(FORM_ID);
        })
    ]);
    open_form(form);

}

function on_rename_page() {
    const FORM_ID = 'rename-page';
    if (global.page) {
        let form = create_form(FORM_ID, T('rename_page'), [
            create_text('text', T('title'), [global.page.title], (value) => {
                update_page_title(global.page, value);
            }),
            create_button(T('close'), (e) => {
                close_form(FORM_ID);
            })
        ]);
        open_form(form);
    }

}

function on_delete_page() {

    const FORM_ID = 'delete-page';

    var pagename = global.page.name;
    var pages = load_pages();
    let options = new Array();
    pages.forEach(page => {
        options.push({ value: page.name, text: page.title });
    });
    let form = create_form(FORM_ID, T('delete_page'), [
        create_select(T('pages'), options, pagename, (value) => {
            pagename = value;
        }),
        create_button(T('delete'), (e) => {
            if (pagename.length > 0) {
                yesno(T('delete_page'), T('confirm_delete_page'), () =>  {
                    delete_page(pagename);
                    close_form(FORM_ID);
                    window.location = '/';
                });
                close_form(FORM_ID);
            }
        }),
        create_button(T('close'), () => { close_form(FORM_ID);} )
    ]);
    open_form(form);
}

function on_page_select(name) {
    let page = load_page(name);
    if( page) {
        global.page = page;
        window.location = `/${page.name}`;
    }
}

