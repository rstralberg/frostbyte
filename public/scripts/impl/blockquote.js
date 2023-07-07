
function implement_blockquote(div, id) {

    let blockquote = sql_load_blockquote(id);
    if( blockquote != null )
    {
        div.setAttribute('data-blockquote-text', blockquote.text);
        draw_blockquote(div);
    }

}

function draw_blockquote(div) {
    
    let blockquote = div.getAttribute('data-blockquote-text');
    div.innerHTML = blockquote;
}


function create_blockquote() {

    let block_id = sql_add_block(get_page().id, 'blockquote');
    let impl_id = sql_add_blockquote(block_id,Lexer.TITLE);
    sql_update_block_impl(block_id,impl_id);

    let block = sql_load_block(block_id); 
    if (block ) {
        get_container().appendChild(render_block(initialize_block(block)));
    }
}

function save_blockquote(div) {
    let id = div.getAttribute('data-block-impl-id');
    sql_update_blockquote(id, div.innerHTML);
}

function toolbar_blockquote(_toolbar) {
}



