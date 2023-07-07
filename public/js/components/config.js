
class Config {

    static set config(c) { Config._config = c; }
    static get config() {  return Config._config; }

    static set language(v) { Config._language = v;}
    static set sitename(v) { Config._sitename = v;}
    static set siteowner(v) { Config._siteowner = v;}
    static set theme(v) { Config._theme = v;}
    static set logo(v) { Config._logo = v;}

    static get language() { return Config._language;}
    static get sitename() { return Config._sitename;}
    static get siteowner() { return Config._siteowner;}
    static get theme() { return Config._theme;}
    static get logo() { return Config._logo;}

    static set config(c) {
        Config.language = c.language;
        Config.sitename = c.sitename;
        Config.siteowner = c.siteowner;
        Config.theme = c.theme;
        Config.logo = c.logo;
    }

    static get config() {
        return {
            language: Config.language,
            sitename: Config.sitename,
            siteowner: Config.siteowner,
            theme: Config.theme,
            logo: Config.logo
        };
    }

    static sql_to_config(sql) {
        return {
            language: sql.language,
            sitename: decodeURIComponent(sql.sitename),
            siteowner: decodeURIComponent(sql.siteowner),
            theme: decodeURI(sql.theme),
            logo: decodeURIComponent(sql.logo)
        };
    }

    static config_to_sql(c) {
        return {
            language: sql(sql.language),
            sitename: sql(encodeURIComponent(sql.sitename)),
            siteowner: sql(encodeURIComponent(sql.siteowner)),
            theme: sql(encodeURIComponent(sql.theme)),
            logo: sql(encodeURIComponent(sql.logo))
        };
    }
    
}

function load_config() {
    return new Promise((resolve) => {
        sql_select('config', ['*'], `id=1`).then(
            (cfgs) => {
                if (cfgs.length === 0) {
                    logg('Kunde inte ladda konfiguratinen');
                }
                else {
                    Config.config = Config.sql_to_config(cfgs[0]);
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

                create_form('edit-config', { title: 'Inställningar', action: 'Spara' }, [
                    {
                        type: FormType.List,
                        name: 'language',
                        label: 'Språk',
                        items: [
                            { value: 'sv', text: 'Svenska' },
                            { value: 'en', text: 'English' }],
                        selected: Config.language,
                    },
                    {
                        type: FormType.Text,
                        name: 'sitename',
                        label: 'Websidans namn',
                        value: Config.sitename,
                    },
                    {
                        type: FormType.Text,
                        name: 'siteowner',
                        label: 'Ägare',
                        value: Config.siteowner,
                    },
                    {
                        type: FormType.List,
                        name: 'theme',
                        label: 'Tema',
                        items: theme_names,
                        selected: Config.theme,
                    },
                    {
                        type: FormType.Image,
                        name: 'logo',
                        label: 'Logga',
                        title: Config.sitename,
                        url: Config.logo,
                        size: 256,
                        shadow: true,
                    }])
                    .then(
                        (resolve) => {
                            let cfg = Config.config_to_sql( {
                                language: resolve.get('language'),
                                sitename: resolve.get('sitename'),
                                siteowner: resolve.get('siteowner'),
                                theme: resolve.get('theme'),
                                logo: resolve.get('logo')
                            });

                            sql_update('config',
                                ['language', 'sitename', 'siteowner', 'theme', 'logo'],
                                [
                                    cfg.language,
                                    cfg.sitename,
                                    cfg.siteowner,
                                    cfg.theme,
                                    cfg.logo
                                ],
                                'id=1')
                                .then(
                                    () => {
                                        Config.config = { 
                                            language: resolve['language'],
                                            sitename: resolve['sitename'],
                                            siteowner: resolve['siteowner'],
                                            theme: resolve['theme'],
                                            logo: resolve['logo']
                                        };
                                    });
                        });
            });
}


