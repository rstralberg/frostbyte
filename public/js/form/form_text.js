
function create_text(type, label, value, listener ) {

    let base = create_base(label);

    let inp = document.createElement('input');
    inp.classList.add(`i${type}`);
    inp.type = type;
    inp.value = value;
    inp.id = base.id;
    inp.addEventListener('change', (e) => {
        listener(e.target.value);
    });
    base.div.appendChild(inp);
    return base.div;
}
