

function create_image(label, title, url, shadow, size, listener) {

    let base = create_base(label);

    load_image_to_div(base.div, url, title, shadow, size);

    let inp = document.createElement('input');
    inp.classList.add('ifile');
    inp.id = base.id;
    inp.type = 'file';
    inp.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            let canvas = base.div.querySelector('canvas');
            if( canvas ) {
                base.div.removeChild(canvas);
            }
            upload_file(title, e.target.files[0], global.page.name, (e) => {
                load_image_to_div(base.div, e, title, shadow, size);
                listener(e);
            });
        }
    });
    base.div.appendChild(inp);
    return base.div;
}
