
function create_select(label, options, selected, listener) {

    let base = create_base(label);

    let inp = document.createElement('select');
    inp.classList.add('iselect');
    inp.id = base.id;

    for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let option = document.createElement('option');
        option.classList.add('ioption');
        if (opt.value === selected) {
            option.selected = true;
        }
        option.value = opt.value;
        option.innerHTML = opt.text;
    
        inp.appendChild(option);
    }
    inp.addEventListener('mouseup', (e) => {
        let target = e.target;
        if (typeof target.options == 'undefined') {
            target = e.target.parentElement;
        }
        if (target.selectedIndex != -1) {
            listener(target.options[target.selectedIndex].value);
        }
    });
    base.div.appendChild(inp);
    return base.div;
}
