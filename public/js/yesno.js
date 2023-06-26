
function yesno(title, text, on_yes, on_no = null) {

    create_form('yes-no', { title: title, action: 'Ja', }[
        {
            type: FormType.Label,
            name: 'text',
            value: text
        }])
        .then(
            (resolve) => { on_yes(); },
            (reject) => { if (on_no) on_no(); }
        );
}
