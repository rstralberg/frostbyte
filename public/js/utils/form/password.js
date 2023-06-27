/*  
field = {
    type: string = 'password'
    name: string, ett namna som fungerar som id
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_password(field, map) {

    let base = create_base( 'input', field, map);
    base.inp.value = '';
    base.inp.addEventListener('change', (e) => {
        map.set(field.name,field.value = e.target.value);
        if (field.listener) field.listener(field);
    });
    return base.div;

}

