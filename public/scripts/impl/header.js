
function implement_header(div, id) {

    let header = sql_load_header(id);
    if( header != null )
    {
        div.setAttribute('data-header-text', header.text);
        draw_header(div);
    }

}

function draw_header(div) {
    
    let header = div.getAttribute('data-header-text');
    div.innerHTML = header;
}


function create_header() {

    let block_id = sql_add_block(get_page().id, 'header');
    let impl_id = sql_add_header(block_id,Lexer.TITLE);
    sql_update_block_impl(block_id,impl_id);

    let block = sql_load_block(block_id); 
    if (block ) {
        get_container().appendChild(render_block(initialize_block(block)));
    }
}

function save_header(div) {
    let id = div.getAttribute('data-block-impl-id');
    sql_update_header(id, div.innerHTML);
}

function toolbar_header(_toolbar) {
}



