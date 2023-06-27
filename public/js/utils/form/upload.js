/*
field = {
    type: string = 'upload'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: startvärde eller null
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_upload(field, map) {

    let base = create_base('input');
    base.inp.type = 'file';
    base.inp.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            field.value = e.target.files[0].name;
            if (!is_valid(field.title)) field.title = e.target.files[0].name;
            upload(field.title, e.target.files[0], Global.page.id)
                .then(
                    (resolve) => {
                        map.set(field.name,resolve);
                        if (field.listener) field.listener(e);
                    });
        }
    });
    return base.div;

}

