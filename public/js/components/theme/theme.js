
function edit_theme(theme_name) {

    // name;

    // // overall colors
    // bg1;
    // fg1;

    // // navbar, footer 
    // bg2;
    // fg2;

    // // hover colors
    // bg3;
    // fg3;

    // // font
    // font;
    // fsize;

    // // links
    // links;

    // // writable field colors
    // bg4;
    // fg4;
    // bg4h;
    // fg4h;
    // bg4l;
    // fg4l;

    // // section colors
    // bg5;
    // fg5;
    // bg5s;
    // fg5s;

    // // some specifics
    // nav_fsize;
    // nav_fweight;
    // nav_border;
    // footer_border;
    // main_border;
    // nav_shadow;
    // footer_shadow;
    // main_shadow;
    // footer_fsize;
    // footer_fstyle;
    // title_fg;    
    var selects = [
        {
            value:'none',
            text: 'Välj'
        },
        {
            value: 'colors',
            text: 'Färger' 
        },
        {
            value: 'fonts',
            text: 'Teckensnitt' 
        },
        {
            value: 'borders',
            text: 'Ramar' 
        },
        {
            value: 'misc',
            text: 'Övrigt'
        }];

        create_form('theme-editor', {
            title: 'Redigera temat "' + theme_name + '"',
            zindex: 8888,
            pos: { x:'41vw', y:'7vh'}
        } , [
            {
                type: FormType.TextArea,
                name: 'info',
                value: 'Här kan du redigera olika delar i temat.',
                rows: 1,
                cols: 60,
            },
            {
                type: FormType.List,
                name: 'selects',
                label: 'Delar',
                items: selects,
                selected: 'none',
                listener: on_select
            }
        ]);
        
        function on_select(e) {
            if( e.value !== 'none') {
                sql_select('theme', ['*'], `name=${sql(theme_name)}`)
                .then(
                    (themes) => {
                        if( themes.length > 0 ) {
                            let func = window['edit_theme_' + e.value];
                            if( is_valid(func)) {
                                func(themes[0]);
                            }
                        }
                    });
            }
        }
        
}



