
function show_toolsmenu() {

    if (global.user === null) {
        return;
    }

    let menu = document.getElementById('tools-menu');
    if (menu === null) {
        menu = document.createElement('div');
        menu.classList.add('vert-menu');
        menu.id = 'tools-menu';
        menu.style.display = 'none';
        menu.style.marginTop = '10vh';

        let panel = document.getElementById('left-panel');
        panel.appendChild(menu);
    }

    remove_childs(menu);
    if (global.user.pages) {
        add_tool(menu, 'icons/add.svg', T('new_page'), on_new_page);
        add_tool(menu, 'icons/delete.svg', T('delete_page'), on_delete_page);
        add_tool(menu, 'icons/title.svg', T('rename_page'), on_rename_page);
    }
    if (global.user.system) {
        add_tool(menu, 'icons/settings.svg', T('edit_settings'), on_settings);
        add_tool(menu, 'icons/user.svg', T('edit_user'), on_edit_user);
    }
    if (global.user.theme) {
        add_tool(menu, 'icons/theme.svg', T('edit_theme'), on_edit_theme);
    }

    if (global.page.author === global.user.username || global.user.system) {
        add_tool(menu, 'icons/add_block.svg', T('new_block'), on_new_block);
        add_tool(menu, 'icons/delete_block.svg', T('delete_block'), on_delete_block);
        add_tool(menu, 'icons/swap.svg', T('swap_left_with_right'), on_swap);
        add_tool(menu, 'icons/up.svg', T('move_up'), on_move_up);
        add_tool(menu, 'icons/down.svg', T('move_down'), on_move_down);
    }
    add_tool(menu, 'icons/logout.svg', T('logout'), on_logout);
    add_tool(menu, 'icons/close.svg', T('close'), on_close);
    menu.style.display = 'block';
    return menu;
}

function add_tool(menu, src, text, func) {
    if (global.user !== null) {
        let item = document.createElement('img');
        item.classList.add('tools');
        item.style.float = 'right';
        item.src = src;
        item.title = text;

        item.addEventListener('click', (e) => {
            func(e.target.id);
        });
        menu.appendChild(item);
    }
}

function on_close() {
    let menu = document.getElementById('tools-menu');
    menu.style.display = 'none';
}
