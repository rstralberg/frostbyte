/*  
field = {
    type: string = 'number'
    name: string, ett namna som fungerar som id
    value: string, en start värde eller null
    min: minsta tillåtna värde
    max: största tillåtna värde
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_number(field, map) {

    let base = create_base('input', field, map);
    base.inp.step = field.step;
    base.inp.min = field.min;
    base.inp.max = field.max;
    base.inp.value = field.value;
    base.inp.addEventListener('change', (e) => {
        map.set(field.name, field.value = e.target.value);
        if (field.listener) field.listener(field);
    });
    return base.div;

}
