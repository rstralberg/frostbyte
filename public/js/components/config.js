

function load_config() {
    return new Promise( (resolve) => {
    sql_select('config', ['*'], `id=1`).then(
        (cfgs) => {
            if (cfgs.length === 0) {
                logg('Kunde inte ladda konfiguratinen');
            }
            else {
                let config = cfgs[0];
                Global.config = {
                    language: config.language,
                    sitename: config.sitename,
                    siteowner: config.siteowner,
                    theme: config.theme,
                    charset: config.charset,
                    logo: config.logo,
                    showheaders: config.showheaders == 1
                };
                resolve();
            }
        });
    });
}

function edit_config() {
    sql_select('theme', [`name`])
        .then(
            (themes) => {
                var theme_names = new Array();
                themes.forEach(theme => {
                    theme_names.push({ value: theme.name, text: theme.name });
                });

                create_form('Inställningar', 'Spara', [
                    {
                        type: FormType.List,
                        name: 'language',
                        label: 'Språk',
                        items: [
                            { value: 'sv', text: 'Svenska' },
                            { value: 'en', text: 'English' }],
                        selected: App.config.language,
                    },
                    {
                        type: FormType.Text,
                        name: 'sitename',
                        label: 'Websidans namn',
                        value: App.config.sitename,
                    },
                    {
                        type: FormType.Text,
                        name: 'siteowner',
                        label: 'Ägare',
                        value: App.config.siteowner,
                    },
                    {
                        type: FormType.List,
                        name: 'theme',
                        label: 'Tema',
                        items: theme_names,
                        selected: App.config.theme,
                    },
                    {
                        type: FormType.Image,
                        name: 'logo',
                        label: 'Logga',
                        title: App.config.sitename,
                        url: App.config.logo,
                        size: 256,
                        shadow: true,
                    },
                    {
                        type: FormType.Checkbox,
                        name: 'showheaders',
                        label: 'Visa sidrubriker',
                        value: App.config.showheaders,
                    }])
                    .then(
                        (resolve) => {
                            sql_update('config',
                                ['language', 'sitename', 'siteowner', 'theme', 'logo', 'showheaders'],
                                [sql(resolve['language']),
                                sql(resolve['sitename']),
                                sql(resolve['siteowner']),
                                sql(resolve['theme']),
                                sql(resolve['logo']),
                                sql(resolve['showheaders'])],
                                'id=1')
                                .then(
                                    () => {
                                        Global.config = {
                                            language: resolve['language'],
                                            sitename: resolve['sitename'],
                                            siteowner: resolve['siteowner'],
                                            theme: resolve['theme'],
                                            logo: resolve['logo'],
                                            showheaders: resolve['showheaders']
                                        };
                                    });
                        });
            });
}

