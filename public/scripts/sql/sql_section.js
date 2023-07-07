//  ---------------------------------------------------------
//  id: int
//  block_id: int
//  text: string
//  opt: string

function sql_load_text(id) {
    let rows = sql_select('select * from `section` where id=' + id );
    if( rows.length > 0) {
        let text = rows[0];
        text.id = parseInt(text.id);
        text.text = decodeURIComponent(text.text);
        text.block_id = parseInt(text.block_id);
        text.opt = text.opt=='NULL'? null : text.opt;
        return text;
    }
    else {
        return null;
    }
}

function sql_update_text(id,text, opt) {
    
    sql_update('update `section` set '
        + 'text=' + sql_string(encodeURIComponent(text)) + ','
        + 'opt=' + sql_string(opt) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_text(block_id, text, opt) {
    return sql_insert('insert into `section` ('
        + 'block_id,'
        + '`text`,'
        + 'opt)'
        + 'values ('
        + parseInt(block_id) + ','
        + sql_string(encodeURIComponent(text)) +  ','
        + sql_string(opt) +  ')');
}

