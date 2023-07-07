
window.blockcontainer = null;

function set_container(div) {
    window.blockcontainer = div;
}

function get_container() {
    return window.blockcontainer;
}

function add_container_block( block ) {
    get_container().appendChild(block);
}

function count_blocks() {
    return get_container().children.length-1;
}

function create_container() {
    let div = document.createElement('div');
    safe_add_class(div, 'block-container');
    div.id = 'blockcontainer';
    set_container(div);
    return div;
}