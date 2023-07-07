
//  --- Block structure
//  id: int
//  type: string
//  page_id: int
//  impl_id: int
//  pos: int
//  align: string
//  style: json-string

window.selected = null;

function get_selection() {
    return window.selected;
}

function set_selection(selection) {
    window.selected = selection;
}

// Called one upon page creation
function initialize_block(block) {

    let elem = document.createElement(block.type);
    try {
        safe_add_class(elem, 'block');
        
        elem.setAttribute('data-block-id', block.id);
        elem.setAttribute('data-block-page-id', block.page_id);
        elem.setAttribute('data-block-impl-id', block.impl_id);
        elem.setAttribute('data-block-type', block.type);
        elem.setAttribute('data-block-style', block.style);


        elem.style.textAlign = block.align;
        

        try {
            window['implement_' + block.type](elem,block.impl_id);
            for( let i=0; i < elem.children.length; i++) {
                elem.children[i].style.textAlign = block.align;
            }
        }
        catch( err ) {
            console.error(err.message + ': ' + 'implement_' + block.type + '()');
        }

    }
    catch (err) {
        console.error(err + ': deleting illegal block ' + block.id);
        console.error("sql_delete('delete from block where `id`=' + block.id");
    }
    return elem;
}

// Call anytime without arguments
function render_block(elem = null) {
    if (elem === null) elem = get_selection();

    let user = get_curuser();
    if (user && ( user.pages || user.system || user.theme )) {
        elem.addEventListener('mousedown', (ev) => {
            select_block(elem);
            let toolbar = add_toolbar(elem);
            toolbar.appendChild(toolbar_item('block-left', Lexer.ALIGN_LEFT, align_left));
            toolbar.appendChild(toolbar_item('block-center', Lexer.ALIGN_CENTER, align_center));
            toolbar.appendChild(toolbar_item('block-right', Lexer.ALIGN_RIGHT, align_right));
            toolbar.appendChild(toolbar_item('block-up', Lexer.MOVE_UP, move_up));
            toolbar.appendChild(toolbar_item('block-down', Lexer.MOVE_DOWN, move_down));
            toolbar.appendChild(toolbar_item('block-delete', Lexer.DELETE_BLOCK, delete_block));

            let blocktype = elem.getAttribute('data-block-type');
            let tbfunc = window['toolbar_' + blocktype ];
            if (tbfunc) {
                tbfunc(toolbar);
            }
            elem.setAttribute('contenteditable', 'true');
        });
    }
    return elem;
}

function delete_block() {
    let elem = get_selection();
    let id = parseInt(elem.getAttribute('data-block-id'));
    sql_delete_block(id);
    
    elem.removeEventListener('mousedown', (ev) => { });
    release_block(elem);
    get_container().removeChild(elem);
    remove_toolbars();
}

function select_block(elem) {
    let prevDiv = get_selection();
    if (prevDiv && prevDiv != elem) {
        release_block(prevDiv);
    }

    set_selection(elem);
    let container = get_container();
    for (let i = 0; container && i < container.children.length; i++) {
        let elem = container.children[i];
        safe_remove_class(elem, 'block-selected');
        safe_remove_class(elem, 'block-resizing');
    }
    if (elem) {
        safe_add_class(elem, 'block-selected');
        elem.setAttribute('contenteditable', 'true');
    }
}

function save_block() {
    let elem  = get_selection();
    if (elem && typeof elem === 'object') {

        let block_id = parseInt(elem.getAttribute('data-block-id'));
        let type = elem.getAttribute('data-block-type');
        sql_update_block(elem,type,block_id);

        if (window['save_' + type]) {
            window['save_' + type](elem,block_id);
        }
    }
}

function release_block(elem) {
    if (elem) {
        let block_id = parseInt(elem.getAttribute('data-block-id'));
        let type = elem.getAttribute('data-block-type');
        sql_update_block(elem,type,block_id);

        if (window['save_' + type]) {
            window['save_' + type](elem,block_id);
        }
        
        elem.removeAttribute('contenteditable');
        safe_remove_class(elem, 'block-selected');
        safe_remove_class(elem, 'block-resizing');
    }
}


function block_resize(on) {
    if (on) {
        get_selection().style.maxHeight = '';
        start_resize();
    }
    else {
        get_selection().style.maxHeight = get_selection().clientHeight + 'px';
        stop_resize();
    }

}


function calc_block_pos(div) {
    let pos = 0;
    for (let i = 0; i < get_container().children.length; i++) {
        let cur = get_container().children[i];
        if (cur.id.slice(0, 'block-'.length) === 'block-') {
            pos++;
            if (cur.id === div.id) {
                break;
            }
        }
    }
    return pos;
}

function get_block(div) {
    return JSON.parse(div.getAttribute('data-block'));
}

function set_impl(div,type, impl) {
    div.setAttribute('data-'+type, JSON.stringify(impl));
}

function get_impl(div, type) {
    return JSON.parse(div.getAttribute('data-' + type));
}

