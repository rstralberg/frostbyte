
function implement_code(div, id) {

    let code = sql_load_code(id);
    if( code != null )
    {
        div.setAttribute('data-code-text', code.text);
        draw_code(div);
    }

}

function draw_code(div) {
    
    let code = div.getAttribute('data-code-text');
    div.innerHTML = code;
}


function create_code() {

    let block_id = sql_add_block(get_page().id, 'code');
    let impl_id = sql_add_code(block_id,Lexer.TITLE);
    sql_update_block_impl(block_id,impl_id);

    let block = sql_load_block(block_id); 
    if (block ) {
        get_container().appendChild(render_block(initialize_block(block)));
    }
}

function save_code(div) {
    let id = div.getAttribute('data-block-impl-id');
    sql_update_code(id, div.innerHTML);
}

function toolbar_code(_toolbar) {
}



