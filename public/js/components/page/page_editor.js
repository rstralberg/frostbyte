
function page_editor() {

    var pages = new Array();

    sql_select('page', ['*'])
        .then(
            (pagearray) => {
                pagearray.forEach(p => {
                    pages.push({
                        id: parseInt(p.id),
                        parent: parseInt(p.parent),
                        pos: parseInt(p.pos),
                        title: decodeURIComponent(p.title)
                    });
                });
                page_edit(pages);
                page_all(pages);
                page_menu(pages);
                page_order(pages);
            });
}
