
function fill_center_panel(panel, page) {

    remove_childs(panel);

    let blocks = load_blocks(page);
    if (typeof blocks != 'undefined') {
        blocks.forEach(block => {
            let div = document.createElement('div');
            div.classList.add('block');
            div.id = `block-${block.id}`;
            panel.appendChild(div);
            try {
                create_block(div, block);
            }
            catch (error) {
                panel.removeChild(div);
                alert(error);
            }
        });
    }
}
