

function create_file(id, label, listener ) {

    let base = create_base(id, label);

    let inp = document.createElement('input');
    inp.classList.add('ifile');
    inp.id = base.id;
    inp.type = 'file';
    inp.addEventListener('input', (e) => {
        listener(e.target.value);
    });
    base.div.appendChild(inp);
    return base.div;
}
