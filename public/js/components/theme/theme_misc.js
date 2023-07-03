/*
    public $links;
    public $shadow_size;
    public $nav_shadow;
    public $footer_shadow;
    public $main_shadow;

*/


function edit_theme_misc(theme) {

    const shadows =  [
        { value: 'transparent', text: 'Ingen'},
        { value: 'black', text: 'Skugga'}
    ];

    create_form('ed-theme-misc', {
        title: 'Redigera övrigt',
        action: 'Spara',
        pos: { x: '2vw', y: '0vh' },
        // size: { w: '60vw', h: 'auto' },
        zindex: 999999
    }, [
        { 
            type: FormType.Color,
            name: 'links',  
            label: 'Länkfärg',
            value: get_style('links'),
            listener: on_links
        },
        { 
            type: FormType.Number, 
            name: 'shadow_size', 
            label: 'Skuggstorlek',
            value: get_int_style('shadow_size'),
            listener: on_shadow_size
        },
        { 
            type: FormType.List, 
            name: 'nav_shadow', 
            label: 'Menyns skugga',
            items: shadows,
            selected: get_style('nav_shadow'),
            listener: on_nav_shadow
        },
        { 
            type: FormType.List, 
            name: 'main_shadow', 
            label: 'Huvusidans skugga',
            items: shadows,
            selected: get_style('main_shadow'),
            listener: on_main_shadow
        },
        { 
            type: FormType.List, 
            name: 'footer_shadow', 
            label: 'Fotradens skugga',
            items: shadows,
            selected: get_style('footer_shadow'),
            listener: on_footer_shadow
        },
        ]);

        function on_links(e) {
            set_style('links', e.value);
        }

        function on_shadow_size(e) {
            set_style('shadow_size', parseInt(e.value) + 'px');
        }

        function on_nav_shadow(e) {
            set_style('nav_shadow', e.value);
        }

        function on_main_shadow(e) {
            set_style('main_shadow', e.value);
        }

        function on_footer_shadow(e) {
            set_style('footer_shadow', e.value);
        }

    }