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
    Upload: 'upload',
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
    CheckList: 'checklist',
    Tree: 'tree',
    Color_Bg_Fg: 'color_bg_fg'
}

// returns a Promise
/* params:

    title: 'required' string
    action: 'optional' extra action button
    fixed: 'optional' boolean telling if the form can be dragged around or not
    pos: 'optional' {x,y} position 
    size: 'optional {w,h} fixed size
    zindex: 'optional'
    cancel: 'optional' default=true
*/

function create_form(id, params, fields) {

    var title = params.title;
    var action = is_valid(params.action) ? params.action : null;
    var fixed = is_valid(params.fixed) ? params.fixed : false;
    var pos = is_valid(params.pos) ? params.pos : { x: '2vw', y: '7vh' };
    var size = is_valid(params.size) ? params.size : { w: 'auto', h: 'auto' };
    var zindex = is_valid(params.zindex) ? params.zindex : null;
    
    return new Promise(function (resolve, reject) {

        let form = document.createElement('form');
        form.classList.add('iform');
        form.id = id;
        form.enctype = 'multipart/form-data';
        form.style.height = size.h;
        form.style.width = size.w;
        form.style.left = pos.x;
        form.style.top = pos.y;
        if (zindex) {
            form.style.zIndex = zindex;
        }

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

        var map = new Map();
        fields.forEach(field => {

            if (!is_valid(field.listener, false)) field.listener = null;

            let func = window[`create_${field.type}`];
            if (is_valid(func)) {
                form.appendChild(verify_object(func(field, map)), 'objec');
            }
        });

        let div = document.createElement('div');
        if ( !is_valid(params.cancel) || params.cancel) {
            let button = document.createElement('button');
            button.classList.add('ibutton');
            button.innerHTML = 'Avbryt';
            button.addEventListener('click', (e) => {
                reject();
                close(form);
            });
            div.appendChild(button);
        }

        if (action) {
            let button = document.createElement('button');
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

        function close(form) {
            let html = document.querySelector('html');
            if (is_valid(form, false) && html.querySelector(`#${form.id}`) !== null) {
                remove_childs(form);
                html.removeChild(form);
            }
        }
    });
}

function close_form(id) {
    let html = document.querySelector('html');
    let form = document.getElementById(id);
    if (is_valid(form, false) && html.querySelector(`#${form.id}`) !== null) {
        remove_childs(form);
        html.removeChild(form);
    }
}
