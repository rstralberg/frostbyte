
function create_block(div, block) {

    const MIN_WIDTH = 10;
    const MAX_WIDTH = 90;

    if (block.left === null && block.right === null) {
        throw new Error(`Block ${block.id}: No content found. Neither left or right`);
    }

    if (block.divide < MIN_WIDTH || block.divide > MAX_WIDTH) {
        if (block.divide < MIN_WIDTH) block.divide = MIN_WIDTH;
        if (block.divide > MAX_WIDTH) block.divide = MAX_WIDTH;
    }

    if (block.left !== null && (block.left.type === null || block.left.type.length === 0) ) {
        throw new Error(`Block ${block.id}: Left block must have a type`);
    }

    if (block.right !== null && (block.right.type === null || block.left.type.length === 0)) {
        throw new Error(`Block ${block.id}: Right block must have a type`);
    }

    div.style.resize = global.user === null ? '' : 'vertical' ;

    create_left(div, block, (e) => {
        if (global.user) {
            e.style.outlineWidth = '1px';
        }
        let rights = document.querySelectorAll('.right');
        rights.forEach(e => {
            e.style.outlineWidth = '0px';
            e.style.resize = global.user === null ? '' : 'horizontal' ;
        });
        global.selected_div = e;
        global.selected_block = block;
        let func = `${block.left.type}_selected`;
        window[func](e, block, block.left);
    });

    create_right(div, block, (e) => {
        let lefts = document.querySelectorAll('.left');
        if (global.user) {
            e.style.outlineWidth = '1px';
        }
        lefts.forEach(e => {
            e.style.resize = global.user === null ? '' : 'horizontal' ;
            e.style.outlineWidth = '0px';
            global.selected_div = e;
            global.selected_block = block;
            let func = `${block.right.type}_selected`;
            window[func](e, block, block.right);
        });
    });

    div.addEventListener('mousedown', (ev) => {
        let blocks = document.querySelectorAll('.block');
        blocks.forEach(e => {
            e.style.outlineWidth = '0px';
        });
        if (global.user) {
            ev.target.style.outlineWidth = '2px';
        }
    });
}


function on_align_left() {
}

function on_align_center() {
}

function on_align_right() {
}

function on_new_block() {
}

function on_delete_block() {
}

function on_swap() {
}

function on_move_up() {
}

function on_move_down() {
}
