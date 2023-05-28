
function create_label(align, text ) {

    let label = document.createElement('label');
    label.classList.add('ilabel');
    label.innerText = text;

    let div = document.createElement('div');
    switch( align ) {
        case 'left':
            div.classList.add('col-40-60');
            div.appendChild(label);
            div.appendChild(document.createElement('div'));
            break;
    
        case 'center':
            div.appendChild(label);
            break;

        case 'right':
            div.classList.add('col-40-60');
            div.appendChild(document.createElement('div'));
            div.appendChild(label);
            break;
    }
    return div;
}
