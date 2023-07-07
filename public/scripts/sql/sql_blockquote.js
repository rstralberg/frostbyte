//  ---------------------------------------------------------
//  id: int
//  block_id: int
//  text: string

function sql_load_blockquote(id) {
    let rows = sql_select('select * from `blockquote` where id=' + id );
    if( rows.length > 0) {
        let blockquote = rows[0];
        blockquote.id = parseInt(blockquote.id);
        blockquote.quote = decodeURIComponent(blockquote.quote);
        blockquote.block_id = parseInt(blockquote.block_id);
        return blockquote;
    }
    else {
        return null;
    }
}

function sql_update_blockquote(id,text) {
    
    sql_update('update blockquote set '
        + 'quote=' + sql_string(encodeURIComponent(text)) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_blockquote(block_id, text) {
    return sql_insert('insert into `blockquote` ('
        + 'block_id,'
        + '`quote`)'
        + 'values ('
        + parseInt(block_id) + ','
        + sql_string(encodeURIComponent(text)) + ')');
}

