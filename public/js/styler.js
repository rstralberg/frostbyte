
function open_style_editor(type) {
    
    let editor = document.getElementById('st-editor');
    if( editor ) {
        remove_childs(editor);
        let body = document.querySelector('html');
        body.removeChild(editor);
    }
    

    const params = [
        { name: 'background', type: 'color', value: get_style(`${type}-background`) },
        { name: 'color', type: 'color', value: get_style(`${type}-color`)  },
        { name: 'font-family', type: 'string', value: get_style(`${type}-font-family`)  },
        { name: 'font-size', type: 'float', step: 0.05, value: get_float_style(`${type}-font-size`) },
        { name: 'font-weight', type: 'select', value: get_style(`${type}-font-weight`), opt:
            [   {value:'normal', text:T('normal')},
                {value:'bold', text:T('bold')} ]},
        { name: 'font-style', type: 'select', value:get_style(`${type}-font-style`), opt: [
                {value:'normal', text:T('normal') }, 
                {value:'italic', text:T('italic') }] },
        { name: 'margin-top', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-top`) },
        { name: 'margin-left', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-left`) },
        { name: 'margin-right', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-right`) },
        { name: 'margin-bottom', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-bottom`) },
        { name: 'width', type: 'number', min:1, max:100, value:get_int_style(`${type}-width`) },
        { name: 'border-width', type: 'number', min:0, max:10, value:get_int_style(`${type}-border-width`) },
        { name: 'border-style', type: 'select', value:get_int_style(`${type}-border-style`) , opt: [
            { value: 'none', text:T('none') },
            { value: 'hidden', text:T('hidden') },
            { value: 'dotted', text:T('dotted') },
            { value: 'dashed', text:T('dashed') },
            { value: 'solid', text:T('solid') },
            { value: 'double', text:T('double') },
            { value: 'groove', text:T('groove') },
            { value: 'ridge', text:T('ridge') },
            { value: 'inset', text:T('inset') },
            { value: 'outset', text:T('outset') }] },
        { name: 'border-color', type: 'color', value:get_style(`${type}-border-color`) },
        { name: 'border-radius', type: 'number', min:0, max:50, value:get_int_style(`${type}-border-radius`) },
        { name: 'line-height', type: 'number', min:1, max:100, value:get_int_style(`${type}-line-height`) },
        { name: 'text-align', type: 'select', value:get_style(`${type}-text-align`) , opt: [
            { value: 'left', text: T('left') },
            { value: 'center', text: T('center') },
            { value: 'right', text: T('right') }]},
        { name: 'height', type: 'number', min:0, max:100, value: get_int_style(`${type}-height`)  }
    ];

    let fields = new Array();
    let styles = get_filtered(type);
    styles.forEach(style => {
        for (let i = 0; i < params.length; i++) {
            if (params[i].name === style.name) {
                let param = params[i];
                let id = `${type}-${style.name}`;
                switch (param.type) {
                    case 'string':
                        fields.push(create_text(id, style.desc, param.value, on_style_string));
                        break;
                    case 'number':
                        fields.push(create_number(id, style.desc, param.min, param.max, param.value, on_style_number));
                        break;
                    case 'float':
                        fields.push(create_float(id, style.desc, param.step, param.min, param.max, param.value, on_style_float));
                        break;
                    case 'checkbox':
                        fields.push(create_checkbox(id, style.desc, param.value, on_style_checkbox));
                        break;
                    case 'color':
                        fields.push( create_color(id, style.desc, param.value, on_style_color ));
                        break;
                    case 'select':
                        fields.push(create_select(id, style.desc, param.opt, param.value, on_style_select));
                        break;
                }
            }
        }
    });
    fields.push(create_button('st-close', T('close'), (t,v) => {
        let body = document.querySelector('html');
        let editor = document.getElementById('st-editor');
        remove_childs(editor);
        body.removeChild(editor);
    }));
    editor = create_form('st-editor', T(type), fields );
    
    let body = document.querySelector('html');
    body.insertBefore(editor, body.firstChild);
}

function on_style_string(target,value) {
    console.log( `on_style_string(${target.id},${value})`);
}

function on_style_number(target,value) {
    console.log( `on_style_number(${target.id},${value})`);
}

function on_style_float(target,value) {
    console.log( `on_style_float(${target.id},${value})`);
}

function on_style_color(target,value) {
    console.log( `on_style_color(${target.id},${value})`);
}

function on_style_select(target,value) {
    console.log( `on_style_select(${target.id},${value})`);
    
}

function on_style_checkbox(target,value ) {
    console.log( `on_style_checkbox(${target.id},${value})`);
}


class styler {

    constructor(type) {

        if( styler._editor ) {
            styler._editor.close();
        }
        styler._editor = new form('style-edit', T('styles') );
        
    
        const params = [
            { name: 'background', type: 'color', value: get_style(`${type}-background`) },
            { name: 'color', type: 'color', value: get_style(`${type}-color`)  },
            { name: 'font-family', type: 'string', value: get_style(`${type}-font-family`)  },
            { name: 'font-size', type: 'float', step: 0.05, value: get_float_style(`${type}-font-size`) },
            { name: 'font-weight', type: 'select', value: get_style(`${type}-font-weight`), opt:
                [   {value:'normal', text:T('normal')},
                    {value:'bold', text:T('bold')} ]},
            { name: 'font-style', type: 'select', value:get_style(`${type}-font-style`), opt: [
                    {value:'normal', text:T('normal') }, 
                    {value:'italic', text:T('italic') }] },
            { name: 'margin-top', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-top`) },
            { name: 'margin-left', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-left`) },
            { name: 'margin-right', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-right`) },
            { name: 'margin-bottom', type: 'number', min:0, max:100, value:get_int_style(`${type}-margin-bottom`) },
            { name: 'width', type: 'number', min:1, max:100, value:get_int_style(`${type}-width`) },
            { name: 'border-width', type: 'number', min:0, max:10, value:get_int_style(`${type}-border-width`) },
            { name: 'border-style', type: 'select', value:get_int_style(`${type}-border-style`) , opt: [
                { value: 'none', text:T('none') },
                { value: 'hidden', text:T('hidden') },
                { value: 'dotted', text:T('dotted') },
                { value: 'dashed', text:T('dashed') },
                { value: 'solid', text:T('solid') },
                { value: 'double', text:T('double') },
                { value: 'groove', text:T('groove') },
                { value: 'ridge', text:T('ridge') },
                { value: 'inset', text:T('inset') },
                { value: 'outset', text:T('outset') }] },
            { name: 'border-color', type: 'color', value:get_style(`${type}-border-color`) },
            { name: 'border-radius', type: 'number', min:0, max:50, value:get_int_style(`${type}-border-radius`) },
            { name: 'line-height', type: 'number', min:1, max:100, value:get_int_style(`${type}-line-height`) },
            { name: 'text-align', type: 'select', value:get_style(`${type}-text-align`) , opt: [
                { value: 'left', text: T('left') },
                { value: 'center', text: T('center') },
                { value: 'right', text: T('right') }]},
            { name: 'height', type: 'number', min:0, max:100, value: get_int_style(`${type}-height`)  }
        ];
    
        let styles = get_filtered(type);
        styles.forEach(style => {
            for (let i = 0; i < params.length; i++) {
                if (params[i].name === style.name) {
                    let param = params[i];
                    switch (param.type) {
                        case 'string':
                            styler._editor.add( new form_text(style.desc,param.value,on_style_string));
                            break;
                        case 'number':
                            styler._editor.add( new form_number(style.desc,param.value,on_style_number));
                            break;
                        case 'float':
                            styler._editor.add( new form_float(style.desc,param.value,on_style_float));
                            break;
                        case 'checkbox':
                            styler._editor.add( new form_checkbox(style.desc,param.value,on_style_checkbox));
                            break;
                        case 'color':
                            styler._editor.add( new form_color(style.desc,param.value,on_style_color));
                            break;
                        case 'select':
                            styler._editor.add( new form_select(style.desc,param.opt,param.value, on_style_color));
                            break;
                    }
                }
            }
        });
        styler._editor.add( new form_button(T('close'), () => { styler._editor.close(); }));
        styler._editor.open();        
    }

    close() {
        styler._editor.close();
        styler._editor = null;
    }
}
