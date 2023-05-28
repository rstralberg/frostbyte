
function on_edit_theme() {
    
}

function open_theme_editor() {

    let form = create_form('theme-editor', T('theme'), [
        create_select('te-action',T('component'), [
            { value: 'body', text: T('body') },
            { value: 'navbar', text: T('navbar') },
            { value: 'navlinks', text: T('navlinks') },
            { value: 'main', text: T('main') },
            { value: 'footer', text: T('footer') },
            { value: 'controls', text: T('controls') },
            { value: 'inputs', text: T('inputs') }
        ], 'body', on_action ),
        create_button('te-close', T('close'), 'center', on_close)
    ]);
    let body = document.querySelector('html');
    body.insertBefore(form, body.firstChild);
    
    function on_action(id,action) {
        open_style_editor(action);
    }

    function on_close(id) {
        let form = document.getElementById('theme-editor');
        remove_childs(form);
        let body = document.querySelector('html');
        body.removeChild(form);
    }
}