
class Config {

    static set config(c) {
        Config._config = c;
    }

    static get config() {
        return Config._config;
    }

    static get language() { return Config._config.language; }
    static get sitename() { return Config._config.sitename; }
    static get siteowner() { return Config._config.siteowner; }
    static get theme() { return Config._config.theme; }
    static get logo() { return Config._config.logo; }

}

function load_config() {
    return new Promise((resolve) => {
        sql_select('config', ['*'], `id=1`).then(
            (cfgs) => {
                if (cfgs.length === 0) {
                    logg('Kunde inte ladda konfiguratinen');
                }
                else {
                    Config.config = {
                        id: parseInt(cfgs[0].id),
                        language: cfgs[0].language,
                        sitename: decodeURIComponent(cfgs[0].sitename),
                        siteowner: decodeURIComponent(cfgs[0].siteowner),
                        theme: decodeURIComponent(cfgs[0].theme),
                        logo: decodeURIComponent(cfgs[0].logo)
                    };

                    apply_theme(Config.theme);
                    resolve();
                }
            });
    });
}

function edit_config() {
    sql_select('theme', [`name`]).then(
        (themes) => {
            var theme_names = new Array();
            themes.forEach(theme => {
                theme_names.push({ value: theme.name, text: theme.name });
            });

            create_form('edit-config', { 
                title: Trans.tag('settings'), 
                action: Trans.tag('save') }, [
                {
                    type: FormType.List,
                    name: 'language',
                    label: Trans.tag('language'),
                    items: [
                        { value: 'sv', text: 'Svenska' },
                        { value: 'en', text: 'English' }],
                    selected: Config.language,
                },
                {
                    type: FormType.Text,
                    name: 'sitename',
                    label: Trans.tag('webpage-name'),
                    value: Config.sitename,
                },
                {
                    type: FormType.Text,
                    name: 'siteowner',
                    label: Trans.tag('owner'),
                    value: Config.siteowner,
                },
                {
                    type: FormType.List,
                    name: 'theme',
                    label: Trans.tag('theme'),
                    items: theme_names,
                    selected: Config.theme,
                },
                {
                    type: FormType.Image,
                    name: 'logo',
                    label: Trans.tag('logo'),
                    title: Config.sitename,
                    url: Config.logo,
                    shared: true,
                    size: 256,
                    shadow: true,
                }])
                .then((resolve) => {
                    sql_update('config',
                        ['language', 'sitename', 'siteowner', 'theme', 'logo'],
                        [
                            sql(resolve.get('language')),
                            sql(encodeURIComponent(resolve.get('sitename'))),
                            sql(encodeURIComponent(resolve.get('siteowner'))),
                            sql(encodeURIComponent(resolve.get('theme'))),
                            sql(encodeURIComponent(resolve.get('logo')))
                        ], 'id=1').then(() => {
                            Config.config = {
                                language: resolve.get('language'),
                                sitename: decodeURIComponent(resolve.get('sitename')),
                                siteowner: decodeURIComponent(resolve.get('siteowner')),
                                theme: decodeURIComponent(resolve.get('theme')),
                                logo: decodeURIComponent(resolve.get('logo'))
                            };
                            apply_theme(Config.theme);
                        },
                            () => { });
                });
        });
}


