
/*  
    Skapar ett bas-element som sedan kan 
    användas av dom övriga för vidare 
    definiering. Passar inte riktig alla 
    varianter men om det inte gör det så
    får varianten själv implementera denna del

    Returnerar det element som ska användas
    
field = {
    type: string
    name: string
    value: any
    label: fältets beskrivning
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
}

    Exempel:

    function create_text(field, map, _div, _label) {

        let inp = create_base('input', field, map);
        inp.addEventListener('change', (e) => {
            map.set(field.name, field.value = e.target.value);
            if (field.listener) field.listener(field);
        });
        return inp;
    }
*/

function create_base(element_type, field, map) {

    verify_object(map, 'object');
    verify_object(field.type, 'string');
    verify_object(field.name, 'string');
    
    if( !is_valid(field.listener) ) field.listener = null;
    if( !is_valid(field.required) ) field.required = false;
    if( !is_valid(field.readonly) ) field.readonly = false;
    if( !is_valid(field.value) ) field.value = '';
    
    let div = document.createElement('div');
    div.classList.add('icol-40-60');

    let label = null
    if( is_valid(field.label) ) {
        label = document.createElement('label');
        label.classList.add('ilabel');
        label.innerText = field.label;
        label.for = field.name;
        div.append(label); 
    }

    let element = document.createElement(element_type);
    div.appendChild(element);
    
    element.classList.add(`i${field.type}`);
    element.id = field.name;

    if( is_valid( element.type )) {
        element.type = field.type;
    }

    if (field.readonly) {
        element.readOnly = true;
    }

    if (field.readonly) {
        element.required = true;
    }
 
    map.set(field.name, is_valid(field.value) ? field.value : '');
    
    return { div: div, inp: element, label: label };
}