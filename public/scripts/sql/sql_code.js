//  ---------------------------------------------------------
//  id: int
//  block_id: int
//  text: string

function sql_load_code(id) {
    let rows = sql_select('select * from `code` where id=' + id );
    if( rows.length > 0) {
        let code = rows[0];
        code.id = parseInt(code.id);
        code.code = decodeURIComponent(code.code);
        code.block_id = parseInt(code.block_id);
        return code;
    }
    else {
        return null;
    }
}

function sql_update_code(id,code) {
    
    sql_update('update code set '
        + 'code=' + sql_string(encodeURIComponent(code)) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_code(block_id, code) {
    return sql_insert('insert into `code` ('
        + 'block_id,'
        + '`code`)'
        + 'values ('
        + parseInt(block_id) + ','
        + sql_string(encodeURIComponent(code)) + ')');
}

