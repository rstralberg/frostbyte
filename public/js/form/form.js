
function create_form(id, title, fields) {

    var offset = [0, 0];
    var mousepos = { x: 0, y: 0 };
    var isdown = false;


    var form = document.createElement('div');
    form.classList.add('iform');
    form.id = id;

    let titlediv = document.createElement('div');
    titlediv.classList.add('ititle');
    titlediv.innerHTML = title;
    form.appendChild(titlediv);

    mousepos = { x: 0, y: 0 };
    offset = [0, 0];
    isdown = false;
    form.addEventListener('mousedown', (ev) => {
        isdown = true;
        offset = [
            form.offsetLeft - ev.clientX,
            form.offsetTop - ev.clientY
        ];
    }, true);
    form.addEventListener('mouseup', (ev) => {
        isdown = false;
    }, true);
    form.addEventListener('mousemove', (ev) => {
        ev.preventDefault();
        if (isdown) {
            mousepos = {
                x: ev.clientX,
                y: ev.clientY
            };
            form.style.left = (mousepos.x + offset[0]) + 'px';
            form.style.top = (mousepos.y + offset[1]) + 'px';
        }
    }, true);

    fields.forEach(field => {
        form.appendChild(field);
    });
    return form;
}

function open_form(form) {
    let html = document.querySelector('html');
    html.insertBefore(form, html.firstChild);
}

function close_form(id) {
    let html = document.querySelector('html');
    let form = document.getElementById(id);
    remove_childs(form);
    html.removeChild(form);
}
