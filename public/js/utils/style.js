
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

function get_hexcolor_style(name) {
    let color = get_style(name);
    if( color.includes('#')) {
        return color;
    }
    else if( color.includes('rgb')) { 
        return stylecolor_to_hex(color);
    }
    else {
        console.error('Color format not supported in "' + name + '" = ' + color);
    }
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
            if (media) {
                name = name.substring(0, name.length - '-media'.length);
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


function parse_border_style(style) {
    // 2px solid #101010
    let border = {
        size: 0,
        type: 'solid',
        color: '000000'
    };

    let words = style.split(' ');
    for( let i=0; i < words.length; i++) {
        let word = words[i].trim();
        if(word.includes('px')) {
            border.size = parseInt(word);
        } else if ( word.includes('#') ) {
            border.color = word.substring(1);
        } else if ( word.includes('rgb')) {
            word = word.substring( 'rgb('.length);
            word = word.substring( + word.length-1);
            let parts = word.split(',');
            let r = parseInt(parts[0]);
            let g = parseInt(parts[1]);
            let b = parseInt(parts[2]);
            border.color = to_hexbyte(r) + to_hexbyte(g) + to_hexbyte(b);
        }
        else {
            border.type = word;
        }
    }
    return border;
}

function build_border_style(border)  {
    return `${border.size}px ${border.type} #${border.color}`;
}