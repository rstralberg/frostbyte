//  id: int
//  block_id: int
//  shadow: boolean
//  url: string
//  title: string
//  type: string

function sql_load_media(id) {
    let rows = sql_select('select * from media where id=' + parseInt(id));
    if( rows.length > 0 ) {
        let media = rows[0];
        media.id = parseInt(media.id);
        media.block_id = parseInt(media.block_id);
        media.shadow = media.shadow != '0';
        return media;
    }
    else {
        return null;
    }
}


function sql_add_media(block_id, shadow, url, title, type ) {
    return sql_insert('insert into media ('
        + 'block_id,'
        + 'shadow,'
        + 'url,'
        + 'title,'
        + 'type) '
        + 'values ('
        + parseInt(block_id) + ','
        + (shadow?1:0) + ','
        + sql_string(url) + ','
        + sql_string(title) + ','
        + sql_string(type) + ')');
}

function sql_update_media(id, shadow, url, title ) {
    sql_update('update media set '
        + 'shadow=' + (shadow?1:0) + ','
        + 'url=' + sql_string(url) + ','
        + 'title=' + sql_string(title) + ' '
        + 'where id=' + parseInt(id));
}

function sql_update_media_shadow(id, shadow) {
    sql_update('update media set shadow=' + (shadow?1:0) + ' where id=' + parseInt(id));
}

function sql_update_media_url(id,url) {
    sql_update('update media set url=' + sql_string(url) + ' where id=' + parseInt(id));
}

function sql_update_media_title(id,title) {
    sql_update('update media set title=' + sql_string(title) + ' where id=' + parseInt(id));
}