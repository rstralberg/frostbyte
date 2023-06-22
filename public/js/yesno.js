
function yesno(title,text, on_yes, on_no = null) {

    create_form(title, 'Ja', [
        {   
            type: FormType.Label,
            name: 'text',
            value: text 
        }])
        .then(
            (resolve) => { on_yes(); },
            (reject) => { if( on_no ) on_no(); }
        );
}
    