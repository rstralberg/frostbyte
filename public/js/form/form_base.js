class f_base {

    opt = [];
    listener = null;
    div = null;
    label = null;
    inp = null;
    value = null;

    constructor(label, value, opt, listener, type) {
        this.opt = opt;
        this.listener = listener;
        this.value = value;

        this.div = document.createElement('div');

        this.label = document.createElement('label');
        this.label.innerHTML = label;
        this.div.appendChild(this.label);

        this.inp = document.createElement(type);
        if (opt && typeof opt != 'undefined') {
            for (let i = 0; i < opt.length; i++) {
                this.inp.setAttribute(opt[i].key, opt[i].value);
            }
        }
        this.div.appendChild(this.inp);
    }
}

function create_base( text ) {
    
    let div = document.createElement('div');
    div.classList.add('icol-40-60');

    let label = document.createElement('label');
    label.classList.add('ilabel');
    label.innerHTML = text;
    label.for = `L-${Math.floor(Math.random() * 1000)}`;
    div.appendChild(label);
    return { div:div, id:label.for};
}