//  id: int
//  block_id: int
//  url: string
//  title: string
//  shadow: boolean
//  height: int

function sql_load_picture(id) {
    let rows = sql_select('select * from picture where id=' + id);
    if( rows.length > 0 ) {
        let pic = rows[0];
        pic.id = parseInt(pic.id);
        pic.block_id = parseInt(pic.block_id);
        pic.shadow = parseInt(pic.shadow) != 0 ;
        pic.height = parseInt(pic.height);
        return pic;
    }
    else {
        return null;
    }
}

function sql_add_picture(block_id, url, title, shadow, heigth ) {
    
    return sql_insert(
        `insert into picture (
            block_id,
            url,
            \`title\`,
            shadow,height) 
        values (
            ${block_id},
            ${sql_string(encodeURIComponent(url))},
            ${sql_string(title)},
            ${shadow?1:0},
            ${heigth}
            )`);
}
