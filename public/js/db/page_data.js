
class page_data {
    title = '';
    name = '';
    parent = '';
    index = 0;
    ishome = false;

    static current() { return page_data._current; }
    static current(page) { page_data._current = page; }
    static columns() { return ['title', 'name', 'parent', 'index', 'ishome']; }
}

function decode_page_data(data) {
    if (data !== null) {
        data.index = parseInt(data.index);
        data.parent = data.parent === 'NULL' ? null : data.parent;
        data.ishome = sql_is_true(data.ishome);
    }
    return data;
}

function load_pages() {
    let pages = sql_read('`page`',
        page_data.columns(),
        ``, '`index` asc',
        sql_mode.mutli);
    let ret = new Array();
    pages.forEach(page => {
        ret.push( decode_page_data(page) );
    });
    return ret;
}

function load_top_pages() {
    let pages = sql_read('`page`',
        page_data.columns(),
        `\`parent\`=${sql_string('NULL')}`,
        '`index` asc',
        sql_mode.mutli);
    let ret = new Array();
    pages.forEach(page => {
        ret.push( decode_page_data(page) );
    });
    return ret;
}

function load_child_pages(parent) {
    let pages = sql_read('`page`',
        page_data.columns(),
        `\`parent\`=${sql_string(parent)}`,
        '`index` asc',
        sql_mode.mutli);
    let ret = new Array();        
    pages.forEach(page => {
        ret.push( decode_page_data(page) );
    });
    return ret;
}

function load_page(name) {
    return decode_page_data( sql_read('`page`',
        page_data.columns(),
        `\`name\`=${sql_string(name)}`,
        '',
        sql_mode.single) );

}

function update_page_title(pagename, title) {
    sql_write('page', ['title'], [sql_string(title)], '`name`=' + sql_string(pagename));
}

function new_page(title, home) {

    let name = remove_all_spaces(title).toLowerCase();
    sql_write('page', page_data.columns(), [
        sql_string(title),
        sql_string(name),
        sql_null(),
        home ? 0 : 1,
        sql_bool(home)],
        `\`name\`=${sql_string(name)}`
    );
}

function delete_page(pagename) {

    delete_page_blocks(pagename);
    sql_delete('page', '`name`=' + sql_string(pagename));
    window.location = '/';

}