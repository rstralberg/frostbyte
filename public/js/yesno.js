
function yesno(atitle, text, yes, no = null) {

    return new Promise((resolve, reject) => {
        create_form('yes-no',
            {
                title: atitle,
                cancel: false,
                zindex: 200
            }, [
            {
                type: FormType.TextArea,
                name: 'text',
                value: text,
                readonly: true,
                rows: 4,
                cols: 40
            },
            {
                type: FormType.Button,
                name: 'yes',
                value: Trans.tag('yes'),
                onecol: true,
                listener: on_yes
            },
            {
                type: FormType.Button,
                name: 'no',
                value: Trans.tag('no'),
                onecol: true,
                listener: on_no
            }]);

        function on_yes(e) {
            close_form('yes-no');
            resolve('yes');
        }

        function on_no(e) {
            close_form('yes-no');
            resolve('no');
        }
    });
}
