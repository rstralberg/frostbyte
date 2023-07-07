
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
                                            `name`,
                                            `bg1`, `fg1`,
                                            `bg2`, `fg2`,
                                            `bg3`, `fg3`,
                                            `font`, `fsize`,
                                            `links`,
                                            `bg4`, `fg4`, `bg4h`, `fg4h`, `bg4l`, `fg4l`,
                                            `bg5`, `fg5`, `bg5s`, `fg5s`,
                                            `nav_fsize`, `nav_fweight`, `nav_border`,
                                            `footer_border`, `main_border`, `nav_radius`,
                                            `footer_radius`, `main_radius`, `shadow_size`,
                                            `main_shadow`, `nav_shadow`, `footer_shadow`,
                                            `footer_fsize`, `footer_fstyle`,
                                            `title_fg`,
                                        ],
                                            [
                                                sql(theme.name),
                                                sql(theme.bg1), sql(theme.fg1),
                                                sql(theme.bg2), sql(theme.fg2),
                                                sql(theme.bg3), sql(theme.fg3),
                                                sql(theme.font), sql(theme.fsize),
                                                sql(theme.links),
                                                sql(theme.bg4), sql(theme.fg4), sql(theme.bg4l), sql(theme.fg4h), sql(theme.bg4l), sql(theme.fg4l),
                                                sql(theme.bg5), sql(theme.fg5), sql(theme.bg5s), sql(theme.fg5s),
                                                sql(theme.nav_fsize), sql(theme.nav_fweight), sql(theme.nav_border),
                                                sql(theme.footer_border), sql(theme.main_border), sql(theme.nav_radius),
                                                sql(theme.footer_radius), sql(theme.main_radius), sql(theme.shadow_size),
                                                sql(theme.main_shadow), sql(theme.nav_shadow), sql(theme.footer_shadow),
                                                sql(theme.footer_fsize), sql(theme.footer_fstyle),
                                                sql(theme.title_fg)
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



