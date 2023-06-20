// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// A generic form used everywhere when a form or dialog is needed.
// 'fields' are an array of web-controls that will populate the form,
// each of them are described in the files starting with 'form_' 
//
// 1. Create the form (create_form)
// 2. Open it and let the user do what the user want to. (open_form)
// 3. Close and detroy the form (close_form)

// fields format
// { 
//      name: <string>
//      label: <string>
//      type: <text,button,list,checkbox,label,email,password,number,float>
//      value:  <string|null>
//      min:  <nubmer|null>
//      max:  <number|null>
//      listener:  <callback | null>
// }
//
// supporte control types
const FormType = {
    Button: 'button',
    Checkbox: 'checkbox',
    Color: 'color',
    File: 'file',
    Float: 'float',
    Image: 'image',
    Label: 'label',
    Number: 'number',
    List: 'list',
    Slider: 'slider',
    Text: 'text',
    Email: 'email',
    Password: 'password'
}

// returns a Promise
function create_form(title, action, fields) {

    return new Promise(function (resolve, reject = null) {

        console.log(`Entering form ${title}`);

        var map = new Array();
        let form = document.createElement('form');
        form.classList.add('iform');
        form.id = `form-${parseInt(Math.random() * 100)}`;
        form.enctype = 'multipart/form-data';


        let titlediv = document.createElement('div');
        titlediv.classList.add('ititle');
        titlediv.innerHTML = title;
        titlediv.style.display = 'contents';
        form.appendChild(titlediv);

        var mousepos = { x: 0, y: 0 };
        var offset = [0, 0];
        var isdown = false;
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

        form.addEventListener('keypress', (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
            }
        });

        fields.forEach(field => {

            if (!is_valid(field.listener, false)) field.listener = null;

            let div = document.createElement('div');
            div.classList.add('icol-40-60');

            let label = document.createElement('label');
            label.classList.add('ilabel');
            label.innerText = field.label;
            label.for = field.name;
            div.append(label);
            let inp = null;
            switch (field.type) {
                case FormType.Button:
                    div.removeChild(label);
                    inp = document.createElement('button');
                    inp.classList.add('ibutton');
                    inp.innerHTML = field.label;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    
                    if (field.listener === null) {
                        logg(`Buttons must have a listener in form "${title}"`);
                    }
                    inp.addEventListener('click', (e) => {
                        field.listener(field);
                    });
                    map[field.name] = field.name;

                    break;
                case FormType.Checkbox:
                    inp = document.createElement('input');
                    inp.classList.add('icheckbox');
                    inp.checked = field.value === null ? false : field.value;
                    inp.id = field.name;
                    inp.type = 'checkbox';
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.addEventListener('change', (e) => {
                        map[field.name] = field.value = e.target.checked;
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Color:
                    div.style.display = 'grid';
                    label.style.height = '32px';

                    inp = document.createElement('input');
                    inp.classList.add('icolor');
                    inp.style.height = '32px;';
                    inp.type = 'color';
                    inp.value = field.value === null ? '#7f7f7f' : field.value;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.addEventListener('input', (e) => {
                        map[field.name] = field.value = hexcolor_to_style(e.target.value);
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.File:
                    inp = document.createElement('input');
                    inp.classList.add('ifile');
                    inp.id = field.id;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    
                    inp.type = 'file';
                    inp.addEventListener('change', (e) => {
                        if (e.target.files && e.target.files[0]) {
                            field.value = e.target.files[0].name;
                            if (!is_valid(field.title)) field.title = e.target.files[0].name;
                            upload(field.title, e.target.files[0], window['frostbyte'].page.id)
                                .then(
                                    (resolve) => {
                                        map[field.name] = resolve;
                                        if (field.listener) field.listener(e);
                                    });
                        }
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Number:
                    inp = document.createElement('input');
                    inp.classList.add('inumber');
                    inp.id = field.name;
                    inp.required = true;
                    inp.type = 'number';
                    inp.step = field.step;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.value = field.value === null ? (field.max - field.min) / 2 : field.value;
                    inp.min = field.min;
                    inp.max = field.max;
                    inp.addEventListener('change', (e) => {
                        map[field.name] = field.value = e.target.value;
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Image:

                    load_image_to_div(div, field.url, field.size);

                    inp = document.createElement('input');
                    inp.classList.add('ifile');
                    inp.required = true;
                    inp.id = field.id;
                    inp.type = 'file';
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.accept = 'image/png, image/jpeg';
                    inp.addEventListener('change', (e) => {

                        if (is_valid(e.target.files) && is_valid(e.target.files[0])) {
                            var file = e.target.files[0];
                            resize_image(file, Global.MAX_IMAGE_SIZE)
                                .then(
                                    (resized_image) => {
                                        upload(field.title, resized_image, Global.page.id)
                                            .then(
                                                (resolve) => {
                                                    load_image_to_div(div, resolve, field.size);
                                                    map[field.name] = resolve;
                                                    if (field.listener) field.listener(e);
                                                });

                                    });
                        }
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Label:
                    div.removeChild(label);
                    label = document.createElement('label');
                    label.classList.add('ilabel');
                    label.innerText = field.label;
                    label.id = field.name;

                    switch (field.align) {
                        case 'left':
                            div.classList.add('col-40-60');
                            div.appendChild(label);
                            div.appendChild(document.createElement('div'));
                            break;

                        case 'center':
                            div.appendChild(label);
                            break;

                        case 'right':
                            div.classList.add('col-40-60');
                            div.appendChild(document.createElement('div'));
                            div.appendChild(label);
                            break;
                    }
                    map[field.name] = field.label;
                    break;
                case FormType.List:
                    inp = document.createElement('select');
                    inp.classList.add('iselect');
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }

                    for (let i = 0; i < field.items.length; i++) {
                        let opt = field.items[i];
                        let option = document.createElement('option');
                        option.classList.add('ioption');
                        if (field.selected && opt.value === field.selected) {
                            option.selected = true;
                        }
                        option.value = opt.value;
                        option.innerHTML = opt.text;

                        inp.appendChild(option);
                    }
                    inp.addEventListener('change', (e) => {
                        let target = e.target;
                        if (typeof target.options === 'undefined') {
                            target = e.target.parentElement;
                        }
                        if (target.selectedIndex != -1) {
                            map[field.name] = target.options[target.selectedIndex].value;
                            field.value = target.options[target.selectedIndex].value;
                            field.text = target.options[target.selectedIndex].innerText;
                            if (field.listener) field.listener(field);
                        }
                    });
                    map[field.name] = field.selected;
                    break;

                case FormType.Slider:
                    var val = document.createElement('label');
                    val.classList.add('ivalue');
                    val.for = field.name;
                    val.innerText = field.value === null ? (field.max - field.min) / 2 : field.value;

                    inp = document.createElement('input');
                    inp.classList.add('islider');
                    inp.type = 'range';
                    inp.min = field.min;
                    inp.max = field.max;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }

                    inp.value = field.value === null ? (field.max - field.min) / 2 : field.value;
                    inp.addEventListener('input', (e) => {
                        map[field.name] = field.value = e.target.value;
                        if (field.listener) field.listener(field);
                        val.innerText = e.target.value;
                    });
                    div.appendChild(val);
                    map[field.name] = field.value;
                    break;
                case FormType.Text:
                    inp = document.createElement('input');
                    inp.type = 'text';
                    inp.value = field.value === null ? '' : field.value;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.addEventListener('change', (e) => {
                        map[field.name] = field.value = e.target.value;
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Email:
                    inp = document.createElement('input');
                    inp.type = 'email';
                    inp.value = field.value === null ? '' : field.value;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.addEventListener('change', (e) => {
                        map[field.name] = field.value = e.target.value;
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;
                case FormType.Password:
                    inp = document.createElement('input');
                    inp.type = 'password';
                    inp.value = field.value === null ? '' : field.value;
                    inp.id = field.name;
                    if( is_valid(field.required) ) {
                        inp.required = field.required;
                    }
                    inp.addEventListener('change', (e) => {
                        map[field.name] = field.value = e.target.value;
                        if (field.listener) field.listener(field);
                    });
                    map[field.name] = field.value;
                    break;

                default:
                    logg(`Okänd typ ${field.type} i ${title}`);
                    break;
            }
            if (inp) {
                div.appendChild(inp);
                form.appendChild(div);
            }
        });

        let div = document.createElement('div');
        let button = document.createElement('button');
        button.classList.add('ibutton');
        button.innerHTML = 'Avbryt';
        button.addEventListener('click', (e) => {
            if (reject) reject();
            close(form);
        });
        div.appendChild(button);

        button = document.createElement('button');
        button.classList.add('ibutton');
        button.innerHTML = action;
        button.addEventListener('click', (e) => {
            console.log(`Resolving form ${title}`);
            resolve(map);
            close(form);
        });
        div.appendChild(button);
        form.appendChild(div);

        let html = document.querySelector('html');
        html.insertBefore(form, html.firstChild);

        div.firstChild.nextSibling.focus();

        function close(form) {
            let html = document.querySelector('html');
            if (is_valid(form, false) && html.querySelector(`#${form.id}`) !== null) {
                remove_childs(form);
                html.removeChild(form);
            }
        }
    });
}

function load_image_to_div(div, url, size) {

    div.classList.add('image');
    div.style.width = `${size}px`;
    div.style.height = `${size}px`;
    div.style.textAlign = 'center';
    div.style.margin = '6px';

    let img = document.createElement('img');
    img.addEventListener('load', (e) => {
        draw_image(div, img);
    });
    img.src = url;
}



