
function edit_theme_fonts(theme) {

    const fonts = new Array([
        { value: 'arial', text: 'Arial' }
    ]);


    create_form('edit-theme-fonts', {
        title: 'Redigera teckensnitt',
        pos: { x: '41vw', y: '26vh' },
        size: { w: '41vw', h: 'auto' },
        fixed: true,
        cancel: false
    }, [
        { 
            type: FormType.List,
            name: 'font',  
            label: 'Teckensnitt',
            items: fonts, 
            selected: get_style('font'),
            listener: on_font
        },
        { 
            type: FormType.Float, 
            name: 'fsize', 
            label: 'Storlek',
            step: 0.1,
            value: get_float_style('fsize'),
            listener: on_fsize
        },
        { 
            type: FormType.Float, 
            name: 'nav-fsize', 
            label: 'Menyns teckenstorlek' ,
            step: 0.1,
            value: get_float_style('nav_fsize'),
            listener: on_nav_fsize
        },
        { 
            type: FormType.Float, 
            name: 'footer-fsize',
            label: 'Fotradens teckenstorlek',
            step: 0.1,
            value: get_float_style('footer_fsize'),  
            listener: on_footer_fsize
        },
        { 
            type: FormType.Checkbox, 
            name: 'nav-fweight',
            label: 'Meny fetstil',
            value: get_style('nav_fweight') === 'bold',  
            listener: on_nav_fweight
        },
        { 
            type: FormType.Checkbox, 
            name: 'footer-fstyle', 
            label: 'Fotrad kursiv',
            value: get_style('footer_fstyle') === 'italic',
            listener: on_footer_fstyle
        },
        {
            type: FormType.Button,
            name: 'save',
            value: 'Spara',
            listener: on_save()
        }
        ]);

        function on_save(e) {

        }
        

        function on_font(e) {
            set_style('font', e.value );
        }

        function on_fsize(e) {
            set_style('fsize', e.value +'em' );
        }

        function on_nav_fsize(e) {
            set_style('nav_fsize', e.value +'em' );
        }

        function on_footer_fsize(e) {
            set_style('footer_fsize', e.value +'em' );
        }

        function on_nav_fweight(e) {
            set_style('nav_fweight', e.value ? 'bold' : 'normal' );
        }

        function on_footer_fstyle(e) {
            set_style('footer_fstyle', e.value ? 'italic' : 'normal' );
        }
    }