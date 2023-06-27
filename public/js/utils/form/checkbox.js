/*  
field = {
    type: string = 'checkbox'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: boolean, startvärde 
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_checkbox(field, map ) {
    
    let base = create_base('input', field,map)
    base.checked = field.value === '' ? false : field.value;
    
    base.inp.addEventListener('change', (e) => {
        map.set(field.name, field.value = e.target.checked);
        if (field.listener) field.listener(field);
    });
    return base.div;
}

