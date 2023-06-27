/*
field = {
    type: string = 'float'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: startvärde eller null
    step: presicion
    min: minsta tillåtna värde
    max: största tillåtna värde
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_float(field, map) {
    
    let base = create_base('input', field, map);
    base.inp.step = field.step;
    base.inp.value = field.value === null ? (field.max - field.min) / 2 : field.value;
    base.inp.min = field.min;
    base.inp.max = field.max;
    base.inp.addEventListener('change', (e) => {
        map.set(field.name,field.value = e.target.value);
        if (field.listener) field.listener(field);
    });
    return base.div;
}

