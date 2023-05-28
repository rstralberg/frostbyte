
function create_toolbar(id) {

    let toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');
    toolbar.id = id;

    return toolbar;
}

function remove_toolbar(toolbar) {
    if (toolbar) {
        remove_childs(toolbar);
        toolbar.parentElement?.removeChild(toolbar);
    }
}

function add_toolbar_item(toolbar, id, src, desc, func ) {

    let item = document.createElement('img');
    item.classList.add('tools');
    item.id = id;
    item.src = src;
    item.title = desc;
    if (func != null) {
        item.addEventListener('click', (e) => {
            func(e);
        });
    }
    toolbar.appendChild(item);
}
