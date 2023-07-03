/*
field = {
    type: string = 'email'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: startvärde eller null
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_email(field, map) {

    let base = create_base('input', field,map);

    base.inp.type = 'email';
    base.inp.value = field.value;
    base.inp.addEventListener('change', (e) => {
        map.set(field.name, field.value = e.target.value );
        if (field.listener) field.listener(field);
    });
    return base.div;

}

