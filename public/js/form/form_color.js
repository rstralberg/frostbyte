
function create_color(label, value, listener ) {
    
    let base = create_base(label);
    base.div.style.display = 'grid';

    let lb = base.querySelector('label');
    lb.style.height = '32px';

    let inp = document.createElement('input');
    inp.classList.add('icolor');
    inp.style.height = '32px;';
    inp.type = 'color';
    inp.value = value;
    inp.id = base.id;
    inp.addEventListener('input', (e) => {
        listener(hexcolor_to_style(e.target.value));
    });
    base.div.appendChild(inp);
    return base.div;
}
