//  Generic form
//
//  Arguments:
//  title - string: title of form
//  buttontext - string: text if positive action button
//  options - array of options for the form if any. None = []
//  parameters - structure giving each field instances in form
//  result - called when poisitive action button is called
//  
//  Options structure:
//  [
//      { name: <option name>, value: <option value },
//      { name: <option name>, value: <option value },
//      ...
//  ]
//
//  Parameters structure:
//  [
//      {   
//          id: id of parameter, 
//          type: type of parameter (text,button,select,checkbox,slider,number,hidden, email, file, select or password)
//          label: '' or label for parameter, 
//          value: '' or input value of parameter
//          attr: [] or extra attributes for parameter 
//          listener: null or function call when parameter changes, 
//                    arguments are (id,value)
//      },
//      ...
//  ]
//
//  Arguments given to the result routine:
//  [
//      { id: <id of parameter>, value: <out value of parameter},
//      { id: <id of parameter>, value: <out value of parameter},
//      ...
//  ]
//
class iParam {
    id;
    type;
    label;
    value;
    attr;
    listener;

    constructor(id, type, label, value, attr, listener) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.value = value;
        this.attr = attr;
        this.listener = listener;
    }
}

function icreate_label(parameter) {
    let label = document.createElement('label');
    safe_add_class(label, 'ilabel');
    label.id = 'label-' + parameter.id;
    label.for = parameter.id;
    label.innerHTML = parameter.label ? parameter.label : '';
    return label;
}

function icreate_inp(div, ctl, parameter) {
    ctl.id = parameter.id;
    for (let i = 0; i < parameter.attr.length; i++) {
        let attr = parameter.attr[i];
        if (attr.value)
            div.setAttribute(attr.name, attr.value);
        else
            div.removeAttribute(attr.name);
    };
    if (parameter.value) {
        ctl.value = parameter.value;
    }
    if (parameter.listener) {
        ctl.addEventListener('input', (e) => {
            parameter.listener(parameter.id, e.target.value);
        });
    }
    parameter.inp = ctl;
}


function iupdate(id, value) {
    let form = document.getElementById('iform');
    if (form) {
        let p = document.getElementById(id);
        if (p) {
            if (p.type === 'checkbox')
                p.checked = value;
            else
                p.value = value;
        }

    }
}

function iformchild(parameters, options, result) {
    let form = document.createElement('form');
    safe_add_class(form, 'iform');
    form.id = 'iform';
    options.forEach(option => {
        form.setAttribute(option.name, option.value);
    });

    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i];
        switch (parameter.type) {
            case 'file': form.appendChild(icreate_file(parameter).div); break;
            case 'text': form.appendChild(icreate_section(parameter).div); break;
            case 'email': form.appendChild(icreate_email(parameter).div); break;
            case 'button': form.appendChild(icreate_button(parameter).div); break;
            case 'slider': form.appendChild(icreate_slider(parameter).div); break;
            case 'checkbox': form.appendChild(icreate_checkbox(parameter).div); break;
            case 'number': form.appendChild(icreate_number(parameter).div); break;
            case 'float': form.appendChild(icreate_float(parameter).div); break;
            case 'select': form.appendChild(icreate_select(parameter).div); break;
            case 'hidden': form.appendChild(icreate_hidden(parameter).div); break;
            case 'password': form.appendChild(icreate_password(parameter).div); break;
            case 'color': form.appendChild(icreate_color(parameter).div); break;
            default:
                console.error(parameter.type + ' not supported in "iform"');
                break;
        }
    }

    let buttons = document.createElement('div');
    safe_add_class(buttons, 'icol-50-50');

    let action = icreate_button({ id: 'form-action', type: 'button', label: Lexer.SAVE, value: '', attr: [] });
    buttons.appendChild(action.inp);
    action.inp.addEventListener('click', (e) => {

        let values = Array();
        for (let i = 0; i < parameters.length; i++) {
            let parameter = parameters[i];
            switch (parameter.type) {
                case 'file':
                    values.push({ id: parameter.id, value: parameter.inp.files[0] });
                    break;
                case 'checkbox':
                    values.push({ id: parameter.id, value: parameter.inp.checked });
                    break;
                case 'email':
                case 'button':
                case 'slider':
                case 'number':
                case 'float':
                case 'select':
                case 'combo':
                case 'hidden':
                case 'password':
                case 'text':
                    values.push({ id: parameter.id, value: parameter.inp.value });
                    break;
                case 'color':
                    values.push({ id: parameter.id, value: parameter.inp.value });
                    break;
                default:
                    console.error(parameter.type + ' not supported in "iform"');
                    break;
            }
        }
        let anchor = document.getElementById('main-modal');
        remove_childs(anchor);
        result(values);
        return;
    });
    return form;
}

function iform(title, buttontext, options, parameters, result) {

    let form = document.createElement('form');
    safe_add_class(form, 'iform');
    form.id = 'iform';
    options.forEach(option => {
        form.setAttribute(option.name, option.value);
    });

    let divtitle = document.createElement('div');
    safe_add_class(divtitle, 'ititle');
    divtitle.innerHTML = title;
    form.appendChild(divtitle);

    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i];
        switch (parameter.type) {
            case 'file': form.appendChild(icreate_file(parameter).div); break;
            case 'text': form.appendChild(icreate_section(parameter).div); break;
            case 'email': form.appendChild(icreate_email(parameter).div); break;
            case 'button': form.appendChild(icreate_button(parameter).div); break;
            case 'slider': form.appendChild(icreate_slider(parameter).div); break;
            case 'checkbox': form.appendChild(icreate_checkbox(parameter).div); break;
            case 'number': form.appendChild(icreate_number(parameter).div); break;
            case 'float': form.appendChild(icreate_float(parameter).div); break;
            case 'select': form.appendChild(icreate_select(parameter).div); break;
            case 'hidden': form.appendChild(icreate_hidden(parameter).div); break;
            case 'password': form.appendChild(icreate_password(parameter).div); break;
            case 'color': form.appendChild(icreate_color(parameter).div); break;
            default:
                console.error(parameter.type + ' not supported in "iform"');
                break;
        }
    }

    let buttons = document.createElement('div');
    safe_add_class(buttons, 'icol-50-50');

    if (buttontext) {
        let action = icreate_button({ id: 'form-action', type: 'button', label: buttontext, value: '', attr: [] });
        buttons.appendChild(action.inp);
        action.inp.addEventListener('click', (e) => {

            let values = Array();
            for (let i = 0; i < parameters.length; i++) {
                let parameter = parameters[i];
                switch (parameter.type) {
                    case 'file':
                        values.push({ id: parameter.id, value: parameter.inp.files[0] });
                        break;
                    case 'checkbox':
                        values.push({ id: parameter.id, value: parameter.inp.checked });
                        break;
                    case 'email':
                    case 'button':
                    case 'slider':
                    case 'number':
                    case 'float':
                    case 'select':
                    case 'combo':
                    case 'hidden':
                    case 'password':
                    case 'text':
                        values.push({ id: parameter.id, value: parameter.inp.value });
                        break;
                    default:
                        console.error(parameter.type + ' not supported in "iform"');
                        break;
                }
            }
            let anchor = document.getElementById('main-modal');
            remove_childs(anchor);
            result(values);
            return;
        });
    }
    else {
        buttons.appendChild(document.createElement('div'));
    }


    let close = icreate_button({ id: 'form-close', type: 'button', label: Lexer.CLOSE, value: '', attr: [] });
    buttons.appendChild(close.inp);
    close.inp.addEventListener('click', (e) => {
        let anchor = document.getElementById('main-modal');
        remove_childs(anchor);
        return;
    });
    form.appendChild(buttons);

    let anchor = document.getElementById('main-modal');
    anchor.appendChild(form);
    anchor.style.display = 'flex';

}

function iform_get(response, id) {
    let retval = '';
    response.forEach(r => {
        if (r.id === id) {
            retval = r.value;
        }
    });
    return retval;
}

function icreate_section(parameter) {

    let div = document.createElement('div');
    safe_add_class(div, 'icol2');
    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'itext');
    inp.type = 'text';
    icreate_inp(div, inp, parameter);
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_file(parameter) {

    let div = document.createElement('div');
    safe_add_class(div, 'icol2');
    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'ifile');
    inp.type = 'file';
    icreate_inp(div, inp, parameter);
    div.appendChild(inp);

    return { div: div, inp: inp };
}


function icreate_email(parameter) {

    let div = document.createElement('div');
    safe_add_class(div, 'icol2');
    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'itext');
    inp.type = 'email';
    icreate_inp(div, inp, parameter);
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_button(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    div.appendChild(document.createElement('div'));

    let inp = document.createElement('button');
    safe_add_class(inp, 'ibutton');
    inp.id = parameter.id;
    inp.innerHTML = parameter.label;
    for (let i = 0; i < parameter.attr.length; i++) {
        let attr = parameter.attr[i];
        if (attr.value)
            inp.setAttribute(attr.name, attr.value);
        else
            inp.removeAttribute(attr.name);
    };
    div.appendChild(inp);
    inp.addEventListener('click', (e) => {
        e.preventDefault();
        parameter.inp.value = true;
        if (parameter.listener) {
            parameter.listener(parameter.id, true);
        }
    });
    parameter.inp = inp;
    parameter.inp.value = false;
    return { div: div, inp: inp };
}

function icreate_slider(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');
    div.appendChild(icreate_label(parameter));

    let idiv = document.createElement('div');
    let inp = document.createElement('input');
    safe_add_class(inp, 'islider');
    inp.type = 'range';
    icreate_inp(idiv, inp, parameter);
    idiv.appendChild(inp);

    let value = document.createElement('label');
    safe_add_class(value, 'ivalue');
    value.id = 'value-' + parameter.id;
    value.for = inp.id;
    value.innerText = inp.value;
    idiv.appendChild(value);
    div.appendChild(idiv);

    parameter.inp = inp;
    return { div: div, inp: inp };
}

function icreate_checkbox(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'icheckbox');
    inp.name = parameter.id;
    inp.id = parameter.id;
    inp.title = parameter.label;
    inp.type = 'checkbox';
    inp.checked = parameter.value;
    for (let i = 0; i < parameter.attr.length; i++) {
        let attr = parameter.attr[i];
        if (attr.value)
            inp.setAttribute(attr.name, attr.value);
        else
            inp.removeAttribute(attr.name);
    };
    if (parameter.listener) {
        inp.addEventListener('input', (e) => {
            parameter.listener(parameter.id, e.target.checked);
        });
    }
    div.appendChild(inp);

    parameter.inp = inp;
    return { div: div, inp: inp };
}

function icreate_number(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'inumber'); inp
    inp.type = 'number';
    icreate_inp(div, inp, parameter);
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_float(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'inumber'); inp
    inp.type = 'number';
    inp.step = '0.05';
    icreate_inp(div, inp, parameter);
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_select(parameter) {

    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('select');
    inp.name = parameter.id;
    inp.id = parameter.id;
    safe_add_class(inp, 'iselect');
    for (let i = 0; i < parameter.attr.length; i++) {
        let attr = parameter.attr[i];
        if (attr.value)
            inp.setAttribute(attr.name, attr.value);
        else
            inp.removeAttribute(attr.name);
    };
    div.appendChild(inp);

    for (let i = 0; i < parameter.value.length; i++) {
        let value = parameter.value[i];
        let option = document.createElement('option');
        safe_add_class(option, 'ioption');
        if (value[0] === '*') {
            option.setAttribute('selected', 'true');
            value = value.slice(1);
        }
        option.value = value;
        option.innerHTML = value;
        inp.appendChild(option);
    }

    parameter.inp = inp;
    inp.addEventListener('mouseup', (e) => {
        if (e.target.selectedIndex != -1) {
            parameter.inp.value = e.target.options[e.target.selectedIndex].value;
            if (parameter.listener) {
                parameter.listener(parameter.id, parameter.inp.value);
            }
        }
    });

    return { div: div, inp: inp };
}


function icreate_hidden(parameter) {

    let div = document.createElement('div');
    safe_add_class(div, 'icol2');

    let inp = document.createElement('input');
    safe_add_class(inp, 'hidden');
    icreate_inp(div, inp, parameter);
    inp.type = 'hidden';
    inp.removeEventListener('input', (e) => { });
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_password(parameter) {
    let div = document.createElement('div');
    safe_add_class(div, 'icol2');
    div.appendChild(icreate_label(parameter));

    let inp = document.createElement('input');
    safe_add_class(inp, 'itext');
    icreate_inp(div, inp, parameter);
    inp.type = 'password';
    div.appendChild(inp);

    return { div: div, inp: inp };
}

function icreate_color(parameter) {

    let div = document.createElement('div');
    div.style.display = 'grid';

    let label = icreate_label(parameter);
    label.style.height = '32px'
    div.appendChild(label);

    let color = document.createElement('input');
    color.type = 'color';
    color.name = parameter.id;
    color.style.height = '32px;'
    div.appendChild(color);

    for (let i = 0; i < parameter.attr.length; i++) {
        let attr = parameter.attr[i];
        if (attr.value) {
            div.setAttribute(attr.name, attr.value);
        }
        else {
            div.removeAttribute(attr.name);
        }
    }

    if (parameter.value) {
        color.value = stylecolor_to_hex(parameter.value);
    }

    if (parameter.listener) {
        color.addEventListener('input', (e) => {
            parameter.listener(parameter.id, hexcolor_to_style(e.target.value));
        });
    }
    return { div: div, inp: color };
}

