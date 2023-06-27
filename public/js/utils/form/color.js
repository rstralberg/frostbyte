/*
field = {
    type: string = 'color'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: startfärg
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_color(field, map) {
    
    let base = create_base('input', field, map);

    base.div.style.display = 'grid';
    // label.style.height = '32px';

    base.inp.style.height = '32px;';
    base.inp.addEventListener('input', (e) => {
        map.set(field.name, field.value = hexcolor_to_style(e.target.value));
        if (field.listener) field.listener(field);
    });
    return base.div;
}

