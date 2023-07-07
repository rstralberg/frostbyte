function create_content() {

    remove_childs(document.querySelector('main'));

    try {
        let pagediv = document.createElement('div');
        let main = document.querySelector('main');
        main.appendChild(pagediv);

        safe_add_class(pagediv, 'page');
        let curuser = get_curuser();
        if (curuser && (curuser.pages || curuser.system || curuser.theme)) {
            page_toolbar(pagediv);
        }

        let header = document.createElement('header');
        header.id = 'page-header';
        safe_add_class(header, get_config().showheaders ? 'visible' : 'hidden');
        header.innerHTML = get_page().title;
        pagediv.appendChild(header);

        // will hold all page blocks
        main.appendChild(create_container());

        let blocks = sql_load_blocks(get_page().id);
        blocks.forEach(block => {
            try {
                if (block.impl_id <= 0) {
                    console.error(`Deleting block ${block.id} without implementation`);
                    sql_delete_block(block.id);
                } else {
                    if (block.align.length == 0) {
                        console.error(`Fixing missing align in block ${block.id}`);
                        block.align = 'left';
                    }
                    add_container_block(render_block(initialize_block(block)));
                }
            }
            catch (err) {
                console.error(err.message + ': Block-ID=' + block.id);
            }
        });
    }
    catch (err) {
        console.error(err.message);
    }
}

