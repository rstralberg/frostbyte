
function edit_themes() {

    sql_select('theme', ['name'])
        .then(
            (names) => {
                var theme_names = new Array();
                names.forEach(name => {
                    theme_names.push({
                        value: name.name,
                        text: name.name
                    });
                });

                create_form('themes-editor', {
                    title: 'Redigera teman',
                    action: 'Spara'
                }, [
                    {
                        type: FormType.TextArea,
                        name: 'info',
                        value: 'Här kan du redigera teman.',
                        rows: 1,
                        cols: 30,
                    },
                    {
                        type: FormType.List,
                        name: 'themes',
                        label: 'Teman',
                        items: theme_names,
                        selected: Config.theme,
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

                            yesno('Tema', 'Vill du använda temat nu')
                                .then(
                                    (resolve) => { close(); },
                                    (reject) => { close(); }
                                );
                        },
                        () => { close(); }
                    );

                on_edit(Config.theme);;

                function on_edit() {
                    let select = document.getElementById('themes');
                    let selected = select.options[select.selectedIndex];
                    edit_theme(selected.value);
                }

                function on_create() {
                    create_form('create-theme', {
                        titel: 'Nytt tema',
                        action: 'Skapa'
                    }, [
                        {
                            type: FormType.Text,
                            name: 'name',
                            label: 'Temats namn',
                        }
                    ])
                        .then((values) => {
                            sql_select('theme', ['*'], '`name`=' + sql(Config.theme))
                                .then((themes) => {
                                    if (themes.length > 0) {
                                        let theme = themes[0];
                                        theme.name = values.get('name');

                                        sql_insert('theme', [
                                            'name',
                                            'background',
                                            'color',
                                            'bars_background',
                                            'bars_color',
                                            'intense_background',
                                            'intense_color',
                                            'font',
                                            'fsize',
                                            'links',
                                            'titles_background',
                                            'titles_color',
                                            'ctl_background_hover',
                                            'ctl_color_hover',
                                            'ctl_background_active',
                                            'ctl_color_active',
                                            'section_background',
                                            'section_color',
                                            'section_selected_background',
                                            'section_selected_color',
                                            'button_background',
                                            'button_color',
                                            'nav_fsize',
                                            'nav_fweight',
                                            'shadow_size',
                                            'nav_border',
                                            'footer_border',
                                            'main_border',
                                            'nav_radius',
                                            'footer_radius',
                                            'main_radius',
                                            'nav_shadow',
                                            'footer_shadow',
                                            'main_shadow',
                                            'footer_fsize',
                                            'footer_fstyle',
                                            'title_fg',
                                            'more_shadow'
                                        ],
                                            [
                                                sql(theme.name),
                                                sql(theme.background),
                                                sql(theme.color),
                                                sql(theme.bars_background),
                                                sql(theme.bars_color),
                                                sql(theme.intense_background),
                                                sql(theme.intense_color),
                                                sql(theme.font),
                                                sql(theme.fsize),
                                                sql(theme.links),
                                                sql(theme.titles_background),
                                                sql(theme.titles_color),
                                                sql(theme.ctl_background_hover),
                                                sql(theme.ctl_color_hover),
                                                sql(theme.ctl_background_active),
                                                sql(theme.ctl_color_active),
                                                sql(theme.section_background),
                                                sql(theme.section_color),
                                                sql(theme.section_selected_background),
                                                sql(theme.section_selected_color),
                                                sql(theme.button_background),
                                                sql(theme.button_color),
                                                sql(theme.nav_fsize),
                                                sql(theme.nav_fweight),
                                                sql(theme.shadow_size),
                                                sql(theme.nav_border),
                                                sql(theme.footer_border),
                                                sql(theme.main_border),
                                                sql(theme.nav_radius),
                                                sql(theme.footer_radius),
                                                sql(theme.main_radius),
                                                sql(theme.nav_shadow),
                                                sql(theme.footer_shadow),
                                                sql(theme.main_shadow),
                                                sql(theme.footer_fsize),
                                                sql(theme.footer_fstyle),
                                                sql(theme.title_fg),
                                                sql(theme.more_shadow)
                                            ])
                                            .then((resolve) => {
                                                Config.theme = theme.name;
                                                sql_update('config', ['theme'], [sql(theme.name)], 'id=1');
                                                let theme_items = document.getElementById('themes');
                                                if( is_valid(theme_items)) {
                                                    let option = document.createElement('option');
                                                    option.value = theme.name;
                                                    option.innerText = theme.name;
                                                    theme_items.appendChild(option);
                                                }
                                            });
                                    }
                                });
                        });
                }

                function on_delete() {
                    sql_select('theme', ['name'])
                        .then((themes) => {

                            if( themes.length > 1 ) {


                            let items = new Array();
                            items.push({
                                value: 'none',
                                text: 'Välj tema'
                            })
                            themes.forEach(theme => {
                                if (theme.name !== Config.theme) {
                                    items.push({
                                        value: theme.name,
                                        text: theme.name
                                    });
                                }
                            });

                            create_form('delete_theme', {
                                title: 'Radera tema',
                                action: 'Radera'
                            },
                                [
                                    {
                                        type: FormType.List,
                                        name: 'theme',
                                        label: 'Teman',
                                        items: items
                                    }
                                ])
                                .then((values) => {
                                    sql_delete('theme', '`name`=' + sql(values.get('theme')))
                                    .then( (resolve) => {
                                        let themes_list = document.getElementById('themes');
                                        if( is_valid(themes_list)) {
                                            for( let i=0; i < themes_list.childElementCount; i++) {
                                                let t = themes_list.children[i];
                                                if( t.value === values.get('theme') ) {
                                                    themes_list.removeChild(t);
                                                }
                                               
                                            }
                                        }
                                    });
                                });
                            } else 
                            {
                                alert( 'Det finns bara ett tema så det kan vi inte radera');
                            }
                        });
                }
            });

    function close() {
        close_form('edit-theme-borders');
        close_form('edit-theme-colors');
        close_form('edit-theme-fonts');
        close_form('edit-theme-misc');
        close_form('theme-editor');
        close_form('themes-editor');
    }
}



