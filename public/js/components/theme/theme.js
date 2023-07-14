
function edit_theme(theme_name) {

    var selects = [
        {
            value:'none',
            text: Trans.tag('select')
        },
        {
            value: 'colors',
            text: Trans.tag('colors')
        },
        {
            value: 'fonts',
            text: Trans.tag('fonts') 
        },
        {
            value: 'borders',
            text: Trans.tag('borders') 
        },
        {
            value: 'misc',
            text: Trans.tag('misc')
        }];

        create_form('theme-editor', {
            title: Trans.tag('edit-theme') + ' ' + theme_name ,
            zindex: 8888,
            cancel: false,
            pos: { x:'41vw', y:'7vh'}
        } , [
            {
                type: FormType.List,
                name: 'selects',
                label: Trans.tag('parts'),
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
                                hide_others(e.value);
                                func(themes[0]);
                            }
                        }
                    });
            }
        }

        function hide_others(this_one) {

            selects.forEach( select=> {
                let name = 'edit-theme-' + select.value;
                if (this_one !== name ) {
                    let element =  document.getElementById(name);
                    if( is_valid(element )) {
                        element.style.display = 'none';
                    }
                }

            });

        }
}



