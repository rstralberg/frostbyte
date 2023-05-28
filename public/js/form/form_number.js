
function create_number(label, min, max, value, listener ) {

    let base = create_base(label);

    let inp = document.createElement('input');
    inp.classList.add('inumber');
    inp.id = base.id;
    inp.type = 'number';
    inp.value = value;
    inp.min = min;
    inp.max = max;
    inp.addEventListener('change', (e) => {
        listener(e.target.value);
    });
    base.div.appendChild(inp);
    return base.div;
}
