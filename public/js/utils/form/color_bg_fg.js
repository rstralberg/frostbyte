/*
field = {
    type: string = 'color'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    value: startfärg
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_color_bg_fg(field, map) {
    
    let div = document.createElement('div');
    div.style.display = 'grid';
    div.classList.add('icol-40-30-30');
    
    let label = null
    label = document.createElement('label');
    label.classList.add('ilabel');
    label.innerText = field.label;
    label.for = field.name;
    div.append(label);

    let c1 = document.createElement('input');
    c1.classList.add('icolor');
    c1.id = 'bg-' + field.name;
    c1.type = 'color';
    c1.value = field.bg;
    div.appendChild(c1);

    let c2 = document.createElement('input');
    c2.classList.add('icolor');
    c2.id = 'fg-' + field.name;
    c2.type = 'color';
    c2.value = field.fg;
    div.appendChild(c2);

    map.set(field.name, { bg: field.bg, fg: field.fg } );

    c1.addEventListener('input', (e) => {
        map.set(field.name, { bg: field.bg = hexcolor_to_style(e.target.value), fg: field.fg });
        if (field.listener) field.listener(field);
    });

    c2.addEventListener('input', (e) => {
        map.set(field.name, { bg: field.bg, fg: field.fg = hexcolor_to_style(e.target.value) });
        if (field.listener) field.listener(field);
    });    
    return div;
}

