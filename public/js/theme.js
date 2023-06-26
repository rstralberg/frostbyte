
function edit_theme() {

}

function open_theme_editor() {

    var form = create_form('theme-editor', T('theme'));
    form_select(form, T('component'), [
        { value: 'body', text: T('body') },
        { value: 'navbar', text: T('navbar') },
        { value: 'navlinks', text: T('navlinks') },
        { value: 'main', text: T('main') },
        { value: 'footer', text: T('footer') },
        { value: 'controls', text: T('controls') },
        { value: 'inputs', text: T('inputs') }]
        , 'body', (selection) => {
            open_style_editor(selection);
        }),
        form_button(form, T('close'), () => { close_form(form); });
}



