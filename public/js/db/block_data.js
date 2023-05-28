// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// JS version of PHP Block database table
//



class block_data
{
    id = 0 ;
    page = '';
    divide = 40;
    index = 0;
    left = '';
    right = '';

    static columns() { return ['id', 'page', 'divide', 'index', 'left', 'right']; }
}

function load_blocks(page) {
    let blocks = sql_read('`block`', block_data.columns(), 'page=' + sql_string(page), '`index` asc', sql_mode.mutli);
    if( blocks && blocks.length > 0 ) {
        blocks.forEach(block => {
            block.id = parseInt(block.id);
            block.divide = parseInt(block.divide);
            block.index = parseInt(block.index);
            if( block.left === null || block.left === 'NULL' || block.left.lenght === 0) {
                block.left = null;
            }
            else {
                block.left = JSON.parse(block.left);
            }
            if( block.right === null || block.right === 'NULL' || block.right.lenght === 0) {
                block.right = null;
            }
            else {
                block.right = JSON.parse(block.right);
            }
        });
    }
    return blocks;
}

function delete_page_blocks(pagename) {
    sql_delete('block', '`page`='+sql_string(pagename));
}