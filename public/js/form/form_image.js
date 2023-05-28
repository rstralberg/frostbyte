

function create_image(label, title, url, shadow, size,  listener ) {

    let base = create_base(label);


    let image = create_image(title, url, shadow, size);
    base.div.appendChild(image);
    
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
