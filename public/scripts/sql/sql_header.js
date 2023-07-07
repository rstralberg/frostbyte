//  ---------------------------------------------------------
//  id: int
//  block_id: int
//  text: string

function sql_load_header(id) {
    let rows = sql_select('select * from `header` where id=' + id );
    if( rows.length > 0) {
        let header = rows[0];
        header.id = parseInt(header.id);
        header.text = decodeURIComponent(header.text);
        header.block_id = parseInt(header.block_id);
        return header;
    }
    else {
        return null;
    }
}

function sql_update_header(id,text) {
    
    sql_update('update header set '
        + 'text=' + sql_string(encodeURIComponent(text)) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_header(block_id, text) {
    return sql_insert('insert into `header` ('
        + 'block_id,'
        + '`text`)'
        + 'values ('
        + parseInt(block_id) + ','
        + sql_string(encodeURIComponent(text)) + ')');
}

