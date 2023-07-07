//  ---------------------------------------------------------
//  id: int
//  parent_id: int
//  pos: int
//  title: string
//  author: string

function sql_load_page(title) {
    let rows = sql_select('select * from page where title=' + sql_string(title) );
    if( rows.length > 0 ) {
        let page = rows[0];
        page.id = parseInt(page.id);
        page.parent_id = parseInt(page.parent_id);
        page.pos = parseInt(page.pos);
        return page;
    }
    else {
        return null;
    }
}

function sql_load_pages(parent_id) {
    let rows = sql_select('select * from page where parent_id=' + parseInt(parent_id) );
    if( rows.length > 0 ) {
        rows.forEach(page => {
            page.id = parseInt(page.id);
            page.parent_id = parseInt(page.parent_id);
            page.pos = parseInt(page.pos);
        });
        return rows;
    }
    else {
        return null;
    }
}

function sql_update_page(id,parent_id,pos,title,author) {
    
    sql_update('update page set '
        + 'parent_id=' + parseInt(parent_id) + ','
        + 'pos=' + parseInt(pos) + ','
        + 'title=' + sql_string(title) + ','
        + 'author=' + sql_string(author) + ' '
        + 'where id=' + parseInt(id) );
}

function sql_add_page(title,author) {
    return sql_insert('insert into page ('
        + 'parent_id,'
        + 'pos,'
        + 'title,'
        + 'author)'
        + 'values ('
        + 0 + ','
        + 0 + ','
        + sql_string(title) + ','
        + sql_string(author) + ')');
}

function sql_delete_page(title) {

    let rows = sql_load_blocks(get_page().id);
    rows.forEach(row => {
        sql_delete_block(row.id);
    });
    sql_delete('delete from page where title=' + sql_string(title));
}

function sql_update_page_title(old_title,new_title) {
    sql_update( 'update page set '
        + '`title`=' + sql_string(new_title) + ' '
        + 'where `title`=' + sql_string(old_title));
}


function sql_update_page_pos(page_id, pos) {
    sql_update('update page set '
        + 'pos=' + parseInt(pos) + ' '
        + 'where id=' + parseInt(page_id));
}

function sql_update_page_parent_id(page_id, parent_id) {
    sql_update('update page set '
        + 'parent_id=' + parseInt(parent_id) + ' '
        + 'where id=' + parseInt(page_id));

}