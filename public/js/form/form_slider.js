
function create_slider(label, min, max, value, listener ) {

    let base = create_base(label);
    
    let inp = document.createElement('input');
    inp.classList.add('islider');
    inp.type = 'range';
    inp.min = min;
    inp.max = max;
    inp.id = base.id;
    inp.value = value;
    inp.addEventListener('input', (e) => {
        listener(e.target.value);
        let v = document.getElementById('value-' + e.target.id);
        v.innerText = e.target.value;
    });
    base.div.appendChild(inp);

    let val = document.createElement('label');
    val.classList.add('ivalue');
    val.id = 'V' + base.id;
    val.for = base.id;
    val.innerText = value;
    base.div.appendChild(val);
    return base.div;
}
