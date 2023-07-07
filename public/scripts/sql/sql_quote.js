//  ---------------------------------------------------------
//  id: int
//  block_id: int
//  text: string

function sql_load_quote(id) {
    let rows = sql_select('select * from `quote` where id=' + id );
    if( rows.length > 0) {
        let quote = rows[0];
        quote.id = parseInt(quote.id);
        quote.text = decodeURIComponent(quote.text);
        quote.block_id = parseInt(quote.block_id);
        return quote;
    }
    else {
        return null;
    }
}

function sql_update_quote(id,text) {
    
    sql_update('update quote set '
        + 'text=' + sql_string(encodeURIComponent(text)) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_quote(block_id, text) {
    return sql_insert('insert into `quote` ('
        + 'block_id,'
        + '`text`)'
        + 'values ('
        + parseInt(block_id) + ','
        + sql_string(encodeURIComponent(text)) + ')');
}

