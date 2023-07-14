
function page_all(pages) {

    var pages_array = new Array();
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
            pages_array.push({
                value: page.id,
                text: page.title
            });
    }
    if (pages_array.length === 0) {
        pages_array.push({
            value: -1,
            text: Trans.tag('pages-missing')
        });
    }

    create_form(Page.FORM_ALL,
        {
            title: Trans.tag('page-all-title'),
            cancel: false,
            fixed: true,
            css: ['iform', 'page-all']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: Trans.tag('page-all-desc'),
            rows: 4,
            cols: 30
        },
        {
            type: FormType.List,
            name: 'all-pages',
            items: pages_array,
            rows: 8,
            onecol: true,
            width: 'inherit',
            listener: on_click
        }
    ]);


    function on_click(e) {

        let pagelist = document.getElementById('all-pages');
        var selected = pagelist.options[pagelist.selectedIndex];


        create_form(Page.FORM_ALL_ACTION, {
            title: Trans.tag('what-to-do-with-page') + ' ' +  selected.innerText ,
        }, [
            {
                type: FormType.Button,
                name: 'move-to-menu',
                value: Trans.tag('move-to-menu'),
                onecol: true,
                listener: move_to_menu,
            },
            {
                type: FormType.Button,
                name: 'move-from-menu',
                value: Trans.tag('move-from-menu'),
                onecol: true,
                listener: move_from_menu,
            }
        ]);

        function move_to_menu(e) {
            if( is_in_menu( parseInt(selected.value) ) ) {
                alert( selected.text + ' ' + Trans.tag('exist-in-menu'));
            }
        }

        function move_from_menu(e) {
            if( !is_in_menu( parseInt(selected.value) ) ) {
                alert( selected.text + ' ' + Trans.tag('not-exist-in-menu'));
            }

        }
    }

}
