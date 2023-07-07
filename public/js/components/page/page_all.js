
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
            text: 'Sidor saknas'
        });
    }

    create_form(Page.FORM_ALL,
        {
            title: 'Alla sidor',
            cancel: false,
            fixed: true,
            css: ['iform', 'page-all']
        }, [
        {
            type: FormType.TextArea,
            name: 'desc',
            value: 'Här kan du välja sidor som ska vara med i någon meny. ' +
                'Klicka för att flytta till eller ifrån "Meny"',
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
            title: 'Vad vill du göra med sidan "' + selected.innerText + '"',
        }, [
            {
                type: FormType.Button,
                name: 'move-to-menu',
                value: 'Flytta till meny',
                onecol: true,
                listener: move_to_menu,
            },
            {
                type: FormType.Button,
                name: 'move-from-menu',
                value: 'Ta bort från meny',
                onecol: true,
                listener: move_from_menu,
            }
        ]);

        function move_to_menu(e) {
            if( is_in_menu( parseInt(selected.value) ) ) {
                alert( selected.text + ' finns redan in menyn');
            }


        }

        function move_from_menu(e) {

        }
    }

}
