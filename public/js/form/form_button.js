
function create_button(caption, align, listener) {

    let btn = document.createElement('button');
    btn.classList.add('ibutton');
    btn.innerText = caption;
    btn.addEventListener('click', (e) => {
        listener();
    });

    let div = document.createElement('div');
    switch(align) {
        case 'left':
            div.classList.add('icol-40-60');
            div.appendChild(btn);
            div.appendChild(document.createElement('div'));
            break;

        case 'center':
            div.appendChild(btn);
            break;

        case 'right':
            div.classList.add('icol-40-60');
            div.appendChild(document.createElement('div'));
            div.appendChild(btn);
            break;
    }
    return div;
}

