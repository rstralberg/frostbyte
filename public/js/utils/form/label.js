/*
field = {
    type: string = 'label'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    id: vilket element som label ska tillhöra
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_label(field, map) {

    let base = create_base(field, map);
    base.div.removeChild(base.label);
    
    let label = document.createElement('label');
    label.classList.add('ilabel');
    label.innerText = field.label;
    label.id = field.name;

    base.div.classList.remove('col-40-60');
    base.div.classList.remove('col-60-40');

    switch (field.align) {
        case 'left':
            base.div.classList.add('col-40-60');
            base.div.appendChild(label);
            base.div.appendChild(document.createElement('div'));
            break;

        case 'center':
            base.appendChild(label);
            break;

        case 'right':
            base.classList.add('col-40-60');
            base.appendChild(document.createElement('div'));
            base.appendChild(label);
            break;
    }
    map.set(field.name, field.label);
    return base.div;

}

