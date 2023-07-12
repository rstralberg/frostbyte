
function get_style(name) {
    return getComputedStyle(document.querySelector('html')).getPropertyValue('--' + name);
}

function set_style(name,value) {
    
    let curValue = getComputedStyle(document.documentElement).getPropertyValue('--' + name);
    document.documentElement.style.setProperty('--' + name, value);
}

function set_border_color_style(name, value) {
    let index = name.search('#');
    if(index!=-1) name = name.slice(0,index);
    let border = parse_border_style(get_style(name));
    border.rgb = parse_rgb(value);
    set_style( name, build_border(border));
}

function set_border_size_style(name,value) {
    let index = name.search('#');
    if(index!=-1) name = name.slice(0,index);
    let border = parse_border_style(get_style(name));
    border.size = parseInt(value);
    set_style(name, build_border(border));
}

function set_bool_style(name,value) {
    set_style(name,value?'true':'false');
}

function set_bold_style(name, bold) {
    set_style(name,bold?'bold':'normal');    
}

function set_italic_style(name, italic) {
    set_style(name,italic?'italic':'normal');    
}

function set_string_style(name, value ) {
    set_style(name,  '"' + value + '"');
}

function set_px_style( name, value ) {
    set_style(name, value + 'px');
}

function set_em_style( name, value ) {
    set_style(name, value + 'em');
}

function set_vw_style( name, value ) {
    set_style(name, value + 'vw');
}

function set_vh_style( name, value ) {
    set_style(name, value + 'vh');
}

function get_int_style( name) {
    return parseInt(get_style(name));
}

function get_float_style( name) {
    return parseFloat(get_style(name));
}

function get_boolean_style( name) {
    return get_style(name)=='true';
}

function get_italic_style(name) {
    return get_style(name)=='italic';
}

function get_border_color_style(name) {
    let index = name.search('#');
    if(index!=-1) name = name.slice(0,index);
    return rgb_to_style( parse_border_style(get_style(name)).rgb);
}

function get_border_size_style(name) {
    let index = name.search('#');
    if(index!=-1) name = name.slice(0,index);
    return parse_border_style(get_style(name)).size;
}

function safe_replace_class(elem,from,to) {
    safe_remove_class(elem,from);
    safe_add_class(elem,to);
}

function safe_add_class(elem,cls) {
    if(!elem.classList.contains(cls)) {
        elem.classList.add(cls);
    }
}

function safe_remove_class(elem,cls) {
    if(elem.classList.contains(cls)) {
       elem.classList.remove(cls);
    }
}

function safe_toggle_class(elem,cls) {
    if( elem.classList.contains(cls)) {
        safe_remove_class(elem,cls);
    }
    else {
        safe_add_class(elem,cls);
    }
}


function apply_block_style(div) {
    let style = JSON.parse(div.getAttribute('data-block-style'));
    
    if( typeof style.background === 'string' )
        div.style.background = style.background;

    if( typeof style.color === 'string') 
        div.style.color = style.color;

    if( typeof style.border === 'string') 
        div.style.border = style.border;


}