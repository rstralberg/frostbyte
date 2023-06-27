/*  
field = {
    type: string = 'button'
    name: string, ett namn som fungerar som id
    value: string, knappens text
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_button(field, map) {

    let base = create_base('button', field, map );
    base.inp.innerHTML = field.value;
    if (field.listener === null) {
        logg(`Buttons must have a listener in "${field.name}"`);
    }
    base.inp.addEventListener('click', (e) => {
        field.listener(field);
    });
    return base.div;
}

