
function move_up() {
    let cur = get_selection();
    if (cur && cur.previousElementSibling) {
        let prev = cur.previousElementSibling.previousElementSibling;
        if (prev && prev.id != 'blockcontainer') {
            if (prev.parentNode) {
                prev.parentNode.insertBefore(cur, prev);
            }
            reapply_toolbars_after_move(cur);
        }
    }
    update_block_positions();
}


function move_down() {
    let cur = get_selection();
    if (cur && cur.nextElementSibling) {
        let next = cur.nextElementSibling;
        next.insertAdjacentElement('afterend', cur);
        reapply_toolbars_after_move(cur);
    }
    update_block_positions();
}


function reapply_toolbars_after_move(div) {
    remove_toolbars();
    let blocktype = div.getAttribute('data-block-type');
    let toolbar = add_toolbar(div);
    let tbfunc = window['toolbar_'+ blocktype];
    if( tbfunc ) tbfunc(toolbar);
}

function update_block_positions() {
    let pos = 0;
    for (let i = 0; i < get_container().children.length; i++) {
        let child = get_container().children[i];
        if (child && !child.classList.contains('toolbar') ) {
            try {
                let id = child.getAttribute('data-block-id');
                sql_update_block_pos(id,pos);
                pos++;
            }
            catch (err) {
                console.error(err.message);
            }
        }
    }
} 