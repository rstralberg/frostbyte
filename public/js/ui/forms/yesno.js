
function yesno(title,text, on_yes, on_no = null) {

    const FORM_ID = 'yes-no-form';
    let form = create_form(FORM_ID, title, [
        create_label('center', text),
        create_button(T('yes'),'center', () => {
            close_form(FORM_ID);
            on_yes();
        }),
        create_button(T('no'),'center', () => {
            close_form(FORM_ID);
            if( on_no ) on_no();
        })
    ]);
    open_form(form);

}