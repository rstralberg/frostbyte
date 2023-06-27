/*  
field = {
    type: string = 'slider'
    name: string, ett namna som fungerar som id
    value: startvärde
    min: minsta tillåtna värde
    min: högsta tillåtna värde
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_slider(field, map, div, label) {
    
    let base = create_base('input', field, map);

    var val = document.createElement('label');
    val.classList.add('ivalue');
    val.for = field.name;
    val.innerText = field.value === null ? (field.max - field.min) / 2 : field.value;

    base.inp.type = 'range';
    base.inp.value = field.value === null ? (field.max - field.min) / 2 : field.value;
    base.inp.addEventListener('input', (e) => {
        map.set(field.name, field.value = e.target.value);
        if (field.listener) field.listener(field);
        val.innerText = e.target.value;
    });
    base.div.appendChild(val);
    return base.div;

}

