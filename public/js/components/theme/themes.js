
function edit_themes() {

    sql_select('theme', ['name'])
    .then( 
        (names) => {
            var theme_names = new Array();
            names.forEach(name => {
                theme_names.push( {
                    value: name.name,
                    text: name.name
                });
            });
        
        create_form('themes-editor', {
            title: 'Redigera teman',
            action: 'Spara' 
        } , [
            {
                type: FormType.TextArea,
                name: 'info',
                value: 'Här kan du redigera teman.',
                rows: 1,
                cols: 30,
            },
            {
                type: FormType.List,
                name: 'select-theme',
                label: 'Teman',
                items: theme_names,
                selected: Global.config.theme
            },
            {
                type: FormType.Button,
                name: 'edit',
                value: 'Redigera valt tema',
                width: '30vw',
                listener: on_edit
            },
            {
                type: FormType.Button,
                name: 'create',
                value: 'Skapa nytt',
                width: '30vw',
                listener: on_create
            },
            {
                type: FormType.Button,
                name: 'delete',
                value: 'Radera',
                width: '30vw',
                listener: on_delete
            }
        ])
        .then(
            (result) => {
                
                yesno('Tema', 'Vill du använda temat nu', 
                () => {
                    // yes
                });
                },
            () => {}
            
        );

        function on_edit() {
            let select = document.getElementById('select-theme');
            let selected = select.options[select.selectedIndex];
            edit_theme(selected.value);
        }

        function on_create() {

        }

        function on_delete() {

        }
    });
}



