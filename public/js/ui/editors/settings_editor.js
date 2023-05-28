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
        create_file('logo-file', T('logo'), on_logo),
        create_checkbox(T('showheaders'), config.showheaders, on_showheaders),
        create_button(T('close'), 'center', () => { close_form(FORM_ID) })
    ]);
    open_form(form);

    function on_language(target, value) {
        console.log(`on_language(${target.id}, ${value})`);
    }

    function on_sitename(target, value) {
        console.log(`on_sitename(${target.id}, ${value})`);
    }

    function on_siteowner(target, value) {
        console.log(`on_siteowner(${target.id}, ${value})`);
    }

    function on_theme(target, value) {
        console.log(`on_theme(${target.id}, ${value})`);
    }

    function on_charset(target, value) {
        console.log(`on_charset(${target.id}, ${value})`);
    }

    function on_logo(target, value) {
        console.log(`on_logo(${target.id}, ${value})`);
    }

    function on_showheaders(target, value) {
        console.log(`on_showheaders(${target.id}, ${value})`);
    }
}