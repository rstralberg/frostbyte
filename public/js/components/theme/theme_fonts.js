
function edit_theme_fonts(theme) {

    const fonts = new Array([
        { value: 'arial', text: 'Arial' }
    ]);


    create_form('ed-theme-fonts', {
        title: 'Redigera teckensnitt',
        action: 'Spara',
        pos: { x: '2vw', y: '0vh' },
        size: { w: '60vw', h: 'auto' },
        zindex: 999999
    }, [
        { 
            type: FormType.List,
            name: 'font',  
            label: 'Teckensnitt',
            items: fonts, 
            selected: get_style('font')
        },
        { 
            type: FormType.Float, 
            name: 'fsize', 
            label: 'Storlek',
            value: get_float_style('fsize')
        },
        { 
            type: FormType.Float, 
            name: 'nav-fsize', 
            label: 'Menyns teckenstorlek' ,
            value: get_float_style('nav_fsize')
        },
        { 
            type: FormType.Float, 
            name: 'footer-fsize',
            label: 'Fotradens teckenstorlek',
            value: get_float_style('footer_fsize'),  
        },
        { 
            type: FormType.Checkbox, 
            name: 'nav-fweight',
            label: 'Meny fetstil',
            value: get_style('nav_fweight') === 'bold',  
        },
        { 
            type: FormType.Checkbox, 
            name: 'footer-fstyle', 
            label: 'Fotrad kursiv',
            value: get_style('footer_fstyle') === 'italic'
        }]);

}