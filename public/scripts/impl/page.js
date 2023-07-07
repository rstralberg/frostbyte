
window.page = null;

function set_page(page) {
    window.page = page;
}

function get_page() {
    return window.page;
}

function new_page() {

    iform(Lexer.NEW_PAGE, Lexer.SAVE, [], [
        new iParam('page-title', 'text', Lexer.PAGE_TITLE, '', [], null)],
        (values) => {
            let title = iform_get(values, 'page-title');
            if (title.length) {
                let id = sql_add_page(title, get_curuser().username);
                if( id > 0 ) {
                    window.location = '/' + id;
                }
            }
        });
}

function delete_page() {
    sql_delete_page(get_page().title);
    window.location = '/';
}

function toggle_page_title() {

    let config = sql_load_config();
    let div = document.getElementById('page-header');
    if (div) {
        if (config.showheaders) {
            safe_replace_class(div, 'hidden', 'visible');
        }
        else {
            safe_replace_class(div, 'visible', 'hidden');
        }
    }

    config.showheaders = !config.showheaders;
    sql_update_config_showheaders(config.showheaders);
}

function page_toolbar(parent) {

    let toolbar = document.createElement('div');
    safe_add_class(toolbar, 'page-toolbar');
    parent.appendChild(toolbar);

    let user = get_curuser();
    if (user.pages ) {
        toolbar.appendChild(toolbar_item('page.new', Lexer.NEW_PAGE, new_page));
        toolbar.appendChild(toolbar_item('page.delete', Lexer.DELETE_PAGE, delete_page));
    }
    toolbar.appendChild(toolbar_item('page.rename', Lexer.RENAME_PAGE, rename_page));
    toolbar.appendChild(toolbar_item('title.show', Lexer.SHOW_PAGE_TITLE, toggle_page_title));
    toolbar.appendChild(toolbar_item('title.create', Lexer.TITLE, create_header));
    toolbar.appendChild(toolbar_item('text.add', Lexer.TEXT, create_section));
    toolbar.appendChild(toolbar_item('code.create', Lexer.CODE, create_code));
    toolbar.appendChild(toolbar_item('quote.create', Lexer.QUOTE, create_blockquote));
    toolbar.appendChild(toolbar_item('pic.add', Lexer.PICTURE, create_picture));
    toolbar.appendChild(toolbar_item('youtube.add', Lexer.YOUTUBE, create_youtube));
    toolbar.appendChild(toolbar_item('vimeo.add', Lexer.VIMEO, create_vimeo));
    toolbar.appendChild(toolbar_item('audio.add', Lexer.AUDIO, create_audio));
    toolbar.appendChild(toolbar_item('spotify.add', Lexer.SPOTIFY, create_spotify));

    if (user.system ) {
        toolbar.appendChild(toolbar_item('users.edit', Lexer.USERS, users));
        toolbar.appendChild(toolbar_item('config.edit', Lexer.SETTINGS, config));
        // toolbar.appendChild(toolbar_item('permissions.edit', Lexer.PAGE_PERMISSIONS, permissions));
    }
    if (user.theme ) {
        toolbar.appendChild(toolbar_item('theme.edit', Lexer.EDIT_THEME, (e) => { theme_editor(); }));
    }
}

function rename_page() {

    let title = get_page().title;

    iform(Lexer.REPLACE_TITLE, Lexer.REPLACE, [], [
        new iParam('rename-page-title', 'text', Lexer.TITLE, title, [], null)
    ],
        (values) => {
            let page = get_page();
            let old_title = title.toUpperCase();
            get_page().title = iform_get(values, 'rename-page-title');
            document.getElementById('page-header').innerText = page.title;
            let navlist = document.getElementById('topnav');
            for (let i = 0; i < navlist.children.length; i++) {
                let child = navlist.children[i];
                if (child.innerText === old_title) {
                    child.innerHTML = '<a href="#' + page.id + '">' + page.title.toUpperCase() + '</a>';
                    break;
                }
            }

            let pheader = document.getElementById('page-header');
            pheader.innerHTML = page.title;

            sql_update_page_title( old_title, page.title);
            window.location = '/' + page.id;
        });
}



