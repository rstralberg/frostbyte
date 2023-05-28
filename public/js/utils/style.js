
function get_style(name) {
    return getComputedStyle(document.querySelector('html')).getPropertyValue('--' + name);
}

function set_style(name, value) {
    document.documentElement.style.setProperty('--' + name, value);
}

function set_bool_style(name, value) {
    set_style(name, value ? 'true' : 'false');
}

function set_quoted_string_style(name, value) {
    set_style(name, '"' + value + '"');
}

function set_px_style(name, value) {
    set_style(name, value + 'px');
}

function set_em_style(name, value) {
    set_style(name, value + 'em');
}

function set_vw_style(name, value) {
    set_style(name, value + 'vw');
}

function set_vh_style(name, value) {
    set_style(name, value + 'vh');
}

function get_int_style(name) {
    return parseInt(get_style(name));
}

function get_float_style(name) {
    return parseFloat(get_style(name));
}

function get_bool_style(name) {
    return get_style(name) == 'true';
}

function get_filtered(filter) {
    let styles = new Array();
    let gs = getComputedStyle(document.querySelector('html'))
    for (let i = 0; i < gs.length; i++) {
        let item = gs.item(i);
        let start = `--${filter}-`;
        if (item.startsWith(start)) {
            let name = item.slice(start.length);
            let media = name.endsWith('-media');
            if( media ) {
                name = name.substring(0, name.length-'-media'.length);
            }
            let style = {
                style: item,
                name: name,
                value: gs.getPropertyValue(item),
                media: media,
                desc: T(name)
            };
            styles.push(style);
        }

    };
    return styles;
}

function filtered_style_to_string(style) {
    return `{ style:${style.style}, name:${style.name}, value:${style.value}, media:${style.media}, desc:${style.desc} }`;
}
