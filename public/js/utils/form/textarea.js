/*  
field = {
    type: string = 'text'
    name: string, ett namna som fungerar som id
    value: string, en start text 
    rows: integer, antal rader
    cols: integer, antal kolumner
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_textarea(field, map) {

    let base = create_base('textarea', field, map);

    if (is_valid(base.label)) {
        base.div.removeChild(base.label);
    }
    base.div.classList.remove('icol-40-60');
    base.inp.style.width= '-moz-available';

    base.inp.style.height = 'auto';
    base.inp.rows = field.rows;
    base.inp.cols = field.cols;
    base.inp.innerHTML = field.value;

    base.inp.addEventListener('change', (e) => {
        field.value = base.inp.innerHTML;
    });
    return base.div;

}

