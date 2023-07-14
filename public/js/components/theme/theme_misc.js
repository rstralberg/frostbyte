/*
    public $links;
    public $shadow_size;
    public $nav_shadow;
    public $footer_shadow;
    public $main_shadow;

*/


function edit_theme_misc(theme) {

    const shadows =  [
        { value: 'transparent', text: Trans.tag('none')},
        { value: 'black', text: Trans.tag('shadow')}
    ];

    create_form('edit-theme-misc', {
        title: Trans.tag('edit-misc'),
        pos: { x: '41vw', y: '26vh' },
        size: { w: '41vw', h: 'auto' },
        cancel: false,
        fixed: true
    }, [
        { 
            type: FormType.Color,
            name: 'links',  
            label: Trans.tag('link'),
            value: get_style('links'),
            listener: on_links
        },
        { 
            type: FormType.Number, 
            name: 'shadow_size', 
            label: Trans.tag('shadow-size'),
            value: get_int_style('shadow_size'),
            listener: on_shadow_size
        },
        { 
            type: FormType.List, 
            name: 'nav_shadow', 
            label: Trans.tag('menu-shadow'),
            items: shadows,
            selected: get_style('nav_shadow'),
            listener: on_nav_shadow
        },
        { 
            type: FormType.List, 
            name: 'main_shadow', 
            label: Trans.tag('main-shadow'),
            items: shadows,
            selected: get_style('main_shadow'),
            listener: on_main_shadow
        },
        { 
            type: FormType.List, 
            name: 'footer_shadow', 
            label: Trans.tag('footer-shadow'),
            items: shadows,
            selected: get_style('footer_shadow'),
            listener: on_footer_shadow
        },
        {
            type: FormType.Button,
            name: 'save',
            value: Trans.tag('save'),
            listener: on_save()
        }
        ]);

        function on_save(e) {

        }

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