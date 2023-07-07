
function add_toolbar(parent) {

    remove_toolbars();

    let toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');

    if (parent) {
        let root = parent.parentElement;
        for (let i = 0; root && i < root.children.length; i++) {
            let element = root?.children[i];
            if (element === parent) {
                root?.insertBefore(toolbar, element);
            }
        }
    }
    return toolbar;
}

function remove_toolbars() {
    let toolbar = document.querySelector('.toolbar');
    if (toolbar) toolbar.parentElement?.removeChild(toolbar);
}

function toolbar_item(id, text, func ) {
    let btn = document.createElement('button');
    btn.classList.add('toolbar-button');
    btn.setAttribute('id', id);
    btn.innerHTML = text;
    if( func != null ) {
        btn.addEventListener('click', (e) => {
            func(e);
        });
    }
    return btn;
}

function toolbar_toggler(id, text, func ) {
    let btn = document.createElement('button');
    btn.classList.add('toolbar-button');
    btn.setAttribute('data-on','false');
    btn.id = id;
    btn.innerHTML = text;
    if( func != null ) {
        btn.addEventListener('click', (e) => {
            if( btn.getAttribute('data-on') == 'false' ) {
                btn.setAttribute('data-on', 'true');
                btn.innerText = btn.innerText.toUpperCase();
            }
            else 
            {
                btn.setAttribute('data-on', 'false');
                btn.innerText = str_first_uppercase(btn.innerText);
            }
            func(e);
        });
    }
    return btn;
}