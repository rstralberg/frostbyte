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
    Password: 'password',
    TextArea: 'textarea',
    CheckList: 'checklist'
}

// returns a Promise
/* params:

    title: 'required' string
    action: 'optional' extra action button
    fixed: 'optional' boolean telling if the form can be dragged around or not
    pos: 'optional' {x,y} position 
    size: 'optional {w,h} fixed size
*/

function create_form(id, params, fields) {

    var title = params.title;
    var action = is_valid(params.action) ? params.action : null;
    var fixed = is_valid(params.fixed) ? params.fixed : false;
    var pos = is_valid(params.pos) ? params.pos : { x: '2vw', y: '7vh' };
    var size = is_valid(params.size) ? params.size : { w: 'auto', h: 'auto' };

    return new Promise(function (resolve, reject = null) {

        var selectedOption = null;
        var dragIndex = 0;

        var map = new Array();
        let form = document.createElement('form');
        form.classList.add('iform');
        form.id = id;
        form.enctype = 'multipart/form-data';
        form.style.height = size.w;
        form.style.width = size.h;
        form.style.left = pos.x;
        form.style.top = pos.y;

        let titlediv = document.createElement('div');
        titlediv.classList.add('ititle');
        titlediv.innerHTML = title;
        titlediv.style.display = 'contents';
        form.appendChild(titlediv);

        var mousepos = { x: 0, y: 0 };
        var offset = [0, 0];
        var isdown = false;
        if (!fixed) {
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
        }

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

                case FormType.Button: inp = create_button(field, map, div, label); break;
                case FormType.Checkbox: inp = create_checkbox(field, map); break;
                case FormType.Color: inp = create_color(field, map, div, label); break;
                case FormType.File: inp = create_file(field, map); break;
                case FormType.Number: inp = create_number(field, map); break;
                case FormType.Image: inp = create_image(field, map, div); break;
                case FormType.Label: create_label(field, map, div, label); break;
                case FormType.TextArea: inp = create_textarea(field, map, div, label); break;
                case FormType.List: inp = create_list(field, map, selectedOption, dragIndex); break;
                case FormType.Slider: inp = create_slider(field, map, div); break;
                case FormType.Text: inp = create_text(field, map); break;
                case FormType.Email: inp = create_email(field, map); break;
                case FormType.Password: inp = create_password(field, map); break;
                case FormType.CheckList: inp = create_checklist(field, map); break;

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

        if (action) {
            button = document.createElement('button');
            button.classList.add('ibutton');
            button.innerHTML = action;
            button.addEventListener('click', (e) => {
                console.log(`Resolving form ${title}`);
                resolve(map);
                close(form);
            });
            div.appendChild(button);
        }
        form.appendChild(div);

        let html = document.querySelector('html');
        html.insertBefore(form, html.firstChild);

        // div.firstChild.nextSibling.focus();

        function close(form) {
            let html = document.querySelector('html');
            if (is_valid(form, false) && html.querySelector(`#${form.id}`) !== null) {
                remove_childs(form);
                html.removeChild(form);
            }
        }
    });


    function create_button(field, map, div, label) {
        div.removeChild(label);
        let btn = document.createElement('button');
        btn.classList.add('ibutton');
        btn.innerHTML = field.label;
        btn.id = field.name;
        if (is_valid(field.required)) {
            btn.required = field.required;
        }

        if (field.listener === null) {
            logg(`Buttons must have a listener in form "${title}"`);
        }
        btn.addEventListener('click', (e) => {
            field.listener(field);
        });
        map[field.name] = field.name;
        return btn;
    }

    function create_checkbox(field, map) {
        let inp = document.createElement('input');
        inp.classList.add('icheckbox');
        inp.checked = field.value === null ? false : field.value;
        inp.id = field.name;
        inp.type = 'checkbox';
        if (is_valid(field.required)) {
            inp.required = field.required;
        }
        inp.addEventListener('change', (e) => {
            map[field.name] = field.value = e.target.checked;
            if (field.listener) field.listener(field);
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_color(field, map, div, label) {
        div.style.display = 'grid';
        label.style.height = '32px';

        let inp = document.createElement('input');
        inp.classList.add('icolor');
        inp.style.height = '32px;';
        inp.type = 'color';
        inp.value = field.value === null ? '#7f7f7f' : field.value;
        inp.id = field.name;
        if (is_valid(field.required)) {
            inp.required = field.required;
        }
        inp.addEventListener('input', (e) => {
            map[field.name] = field.value = hexcolor_to_style(e.target.value);
            if (field.listener) field.listener(field);
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_file(field, map) {
        let inp = document.createElement('input');
        inp.classList.add('ifile');
        inp.id = field.id;
        if (is_valid(field.required)) {
            inp.required = field.required;
        }

        inp.type = 'file';
        inp.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                field.value = e.target.files[0].name;
                if (!is_valid(field.title)) field.title = e.target.files[0].name;
                upload(field.title, e.target.files[0], Global.page.id)
                    .then(
                        (resolve) => {
                            map[field.name] = resolve;
                            if (field.listener) field.listener(e);
                        });
            }
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_number(field, map) {
        let inp = document.createElement('input');
        inp.classList.add('inumber');
        inp.id = field.name;
        inp.required = true;
        inp.type = 'number';
        inp.step = field.step;
        if (is_valid(field.required)) {
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
        return inp;
    }

    function create_image(field, map, div) {

        load_image_to_div(div, field.url, field.size);

        let inp = document.createElement('input');
        inp.classList.add('ifile');
        inp.required = true;
        inp.id = field.id;
        inp.type = 'file';
        if (is_valid(field.required)) {
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
        return inp;
    }

    function create_label(field, map, div, label) {
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
        return label;
    }

    function create_textarea(field, map, div, label) {
        div.removeChild(label);
        div.classList.remove('icol-40-60');

        let inp = document.createElement('textarea');
        inp.classList.add('itext');
        inp.style.height = 'auto';
        inp.rows = field.rows;
        inp.cols = field.cols;
        inp.id = field.name;
        inp.innerHTML = field.value;
        if (field.readonly) {
            inp.readOnly = true;
        }
        inp.addEventListener('change', (e) => {
            field.value = inp.innerHTML;
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_list(field, map, selectedOption, dragIndex) {

        let inp = document.createElement('select');
        inp.classList.add('iselect');
        inp.id = field.name;
        inp.addEventListener('mousedown', (e) => {
            if (e.target.tagName === "OPTION") {
                selectedOption = e.target;
                dragIndex = Array.from(inp.options).indexOf(selectedOption);
            }
        });
        inp.addEventListener("mousemove", function (e) {
            if (selectedOption) {
                e.preventDefault();

                let hoverIndex = Array.from(inp.options).indexOf(e.target);
                if (hoverIndex > dragIndex) {
                    inp.insertBefore(selectedOption, inp.options[hoverIndex + 1]);
                } else if (hoverIndex < dragIndex) {
                    inp.insertBefore(selectedOption, inp.options[hoverIndex]);
                }
                dragIndex = Array.from(inp.options).indexOf(selectedOption);
            }
        });

        inp.addEventListener("mouseup", function (e) {
            if (field.drag) field.drag({ option: selectedOption, index: dragIndex });
            selectedOption = null;
            dragIndex = 0;
        });

        if (is_valid(field.rows)) {
            inp.size = field.rows;
        }
        if (is_valid(field.required)) {
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
            if (is_valid(opt.opt)) {
                option.setAttribute('data-opt', `${opt.opt}`);
            }

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
                field.opt = target.options[target.selectedIndex].getAttribute('data-opt');
                if (field.listener) field.listener(field);
            }
        });
        map[field.name] = field.selected;
        return inp;
    }

    function create_slider(field, map, div) {
        var val = document.createElement('label');
        val.classList.add('ivalue');
        val.for = field.name;
        val.innerText = field.value === null ? (field.max - field.min) / 2 : field.value;

        let inp = document.createElement('input');
        inp.classList.add('islider');
        inp.type = 'range';
        inp.min = field.min;
        inp.max = field.max;
        inp.id = field.name;
        if (is_valid(field.required)) {
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
        return inp;
    }

    function create_text(field, map) {
        
        let inp = document.createElement('input');
        inp.type = 'text';
        inp.value = field.value === null ? '' : field.value;
        inp.id = field.name;
        if (is_valid(field.required)) {
            inp.required = field.required;
        }
        inp.addEventListener('change', (e) => {
            map[field.name] = field.value = e.target.value;
            if (field.listener) field.listener(field);
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_email(field, map) {
        let inp = document.createElement('input');
        inp.type = 'email';
        inp.value = field.value === null ? '' : field.value;
        inp.id = field.name;
        if (is_valid(field.required)) {
            inp.required = field.required;
        }
        inp.addEventListener('change', (e) => {
            map[field.name] = field.value = e.target.value;
            if (field.listener) field.listener(field);
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_password(field, map) {
        let inp = document.createElement('input');
        inp.type = 'password';
        inp.value = field.value === null ? '' : field.value;
        inp.id = field.name;
        if (is_valid(field.required)) {
            inp.required = field.required;
        }
        inp.addEventListener('change', (e) => {
            map[field.name] = field.value = e.target.value;
            if (field.listener) field.listener(field);
        });
        map[field.name] = field.value;
        return inp;
    }

    function create_checklist(field, map) {

        let inp = document.createElement('div');
        inp.id = `${field.name}-check-container`;

        let ul = document.createElement('ul');
        ul.classList.add('ichecklist');
        ul.id = `${field.name}-check-list`;
        inp.appendChild(ul);

        for (let i = 0; i < field.items.length; i++) {

            let item = field.items[i];

            let li = document.createElement('li');
            ul.appendChild(li);


            let cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = item.value;
            cb.addEventListener('change', (e) => {
                if (is_valid(field.listener)) {
                    field.listener({
                        list: ul,
                        item: li,
                        value: item.value,
                        checked: e.target.checked
                    });
                }
            });

            li.appendChild(cb);

            let label = document.createElement('label');
            label.innerText = item.text;

            li.appendChild(label);

        }
        return inp;
    }
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



