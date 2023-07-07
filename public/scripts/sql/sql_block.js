//  ---------------------------------------------------------
//  id: int
//  type: string
//  page_id: int
//  impl_id: int
//  pos: int
//  align: string
//  style: string

function sql_load_blocks(page_id) {
    let rows = sql_select('select * from block where page_id=' + page_id );
    rows.forEach(block => {
        block.id = parseInt(block.id);
        block.page_id = parseInt(block.page_id);
        block.impl_id = parseInt(block.impl_id);
        block.pos = parseInt(block.pos);
    });
    return rows;
}

function sql_load_block(block_id) {
    let rows =  sql_select('select * from block where id=' + block_id );
    if( rows.length > 0 ) {
        let block = rows[0];
        block.id = parseInt(block.id);
        block.page_id = parseInt(block.page_id);
        block.impl_id = parseInt(block.impl_id);
        block.pos = parseInt(block.pos);
        return block;
    }
    else {
        return null;
    }
}

function sql_update_block(div,type,block_id) {
    
    sql_update('update block set '
        + 'pos=' + calc_block_pos(div) + ','
        + 'align=' + sql_string(div.style.textAlign) + ' '
        // + 'style=' + sql_string(text) + ' '
        + 'where id=' + parseInt(block_id));
}

function sql_add_block(page_id, type, align = 'left') {
    let pos = get_container().children.length;
    return sql_insert(
        `insert into block (type, page_id, impl_id, pos, align) ` +
        `values (${sql_string(type)},${parseInt(page_id)},${0},${pos},${sql_string(align)})`);
}

function sql_update_block_impl(block_id, impl_id) {
    sql_update('update block set impl_id=' + parseInt(impl_id) + ' where id=' + parseInt(block_id));
}

function sql_update_block_pos(block_id, pos) {
    sql_update('update block set pos=' + parseInt(pos) + ' where id=' + parseInt(block_id));
}

function sql_delete_block(block_id) {
    let rows = sql_select('select type, impl_id from block where id=' + parseInt(block_id));
    if(rows.length) {
        sql_delete('delete from `' + rows[0].type + '` where id=' + parseInt(rows[0].impl_id) );
    }
    sql_delete('delete from block where id=' + parseInt(block_id) );
}

