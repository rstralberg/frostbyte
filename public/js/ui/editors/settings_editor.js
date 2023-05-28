function on_settings() {

    const FORM_ID = 'settings-editor';

    let config = load_config();

    let theme_names = new Array();
    let themes = sql_read('theme', ['name'], '', '', sql_mode.mutli);
    themes.forEach(theme => {
        theme_names.push({ value: theme.name, text: theme.name });
    });

    let form = create_form(FORM_ID, T('settings'), [
        create_select(T('language'), [
            { value: 'sv', text: 'Svenska' },
            { value: 'en', text: 'English' }], config.language, on_language),
        create_text('text', T('sitename'), config.sitename, on_sitename),
        create_text('text', 'ce-siteowner', T('siteowner'), config.siteowner, on_siteowner),
        create_select(T('theme'), theme_names, config.theme, on_theme),
        create_text('text', T('charset'), config.charset, on_charset),
        create_image( T('logo'), T('logo'), config.logo, true, 256, on_logo),
        create_checkbox(T('showheaders'), config.showheaders, on_showheaders),
        create_button(T('close'), () => { close_form(FORM_ID) })
    ]);
    open_form(form);

    function on_language(value) {
        console.log(`on_language(${value})`);
    }

    function on_sitename(value) {
        console.log(`on_sitename(${value})`);
    }

    function on_siteowner(value) {
        console.log(`on_siteowner( ${value})`);
    }

    function on_theme(value) {
        console.log(`on_theme(${value})`);
    }

    function on_charset(value) {
        console.log(`on_charset(${value})`);
    }

    function on_logo(value) {
        update_config_value('logo',value);
    }

    function on_showheaders(value) {
        console.log(`on_showheaders(${value})`);
    }
}