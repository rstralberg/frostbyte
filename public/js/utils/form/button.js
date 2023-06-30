/*  
field = {
    type: string = 'button'
    name: string, ett namn som fungerar som id
    value: string, knappens text
    width: integer (optional, default = null)
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_button(field, map) {

    let base = create_base('button', field, map );
    base.inp.innerHTML = field.value;
    
    if( is_valid(field.align)) {
        base.inp.style.textAlign = field.align;
    }
    if (is_valid(field.width)) {
        base.div.classList.remove('icol-40-60');
        base.inp.style.width = field.width;
    }
    if (field.listener === null) {
        logg(`Buttons must have a listener in "${field.name}"`);
    }
    base.inp.addEventListener('click', (e) => {
        field.listener(field);
    });
    return base.div;
}

