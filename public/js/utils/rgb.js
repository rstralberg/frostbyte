
function hsv2rgb(hsv) {
    let h = hsv.hue, s = hsv.sat, v = hsv.val;
    let rgb, i, data = [];
    if (s === 0) {
        rgb = [v, v, v];
    } else {
        h = h / 60;
        i = Math.floor(h);
        data = [v * (1 - s), v * (1 - s * (h - i)), v * (1 - s * (1 - (h - i)))];
        switch (i) {
            case 0:
                rgb = [v, data[2], data[0]];
                break;
            case 1:
                rgb = [data[1], v, data[0]];
                break;
            case 2:
                rgb = [data[0], v, data[2]];
                break;
            case 3:
                rgb = [data[0], data[1], v];
                break;
            case 4:
                rgb = [data[2], data[0], v];
                break;
            default:
                rgb = [v, data[0], data[1]];
                break;
        }
    }
    return rgb;
}



function parse_rgb(rgb) {
    rgb = rgb.replace(', ', ',');
    rgb = rgb.replace(', ', ',');
    const colorMatch = rgb.match(/\d+/g);
    return {
        r: parseInt(colorMatch[0]),
        g: parseInt(colorMatch[1]),
        b: parseInt(colorMatch[2]) };
}

function parse_rgba(rgba) {
    rgba = rgba.replace(', ', ',');
    rgba = rgba.replace(', ', ',');
    rgba = rgba.replace(', ', ',');
    const colorMatch = rgba.match(/\d+/g);
    return {
        r: parseInt(colorMatch[0]),
        g: parseInt(colorMatch[1]),
        b: parseInt(colorMatch[2]),
        a: parseInt(colorMatch[3]) };
}

function build_rgb(rgb) {
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}

function rgba2rgb(rgba) {
    rgba = rgba.replace(', ', ',');
    rgba = rgba.replace(', ', ',');
    rgba = rgba.replace(', ', ',');
    const colorMatch = rgba.match(/\d+/g);
    return build_rgb( {
        r: parseInt(colorMatch[0]),
        g: parseInt(colorMatch[1]),
        b: parseInt(colorMatch[2]) });
    
}

function hexcolor_to_rgb(hex) {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    return { r:r, g:g, b:b };
}

function hexcolor_to_style(hex) {
    return rgb_to_style(hexcolor_to_rgb(hex));
}

function stylecolor_to_hex(color) {
    let rgb = parse_rgb(color);
    return '#' + to_hexbyte(rgb.r) + to_hexbyte(rgb.g) + to_hexbyte(rgb.b);
}

function stylecolor_a_to_hex(color) {
    let rgba = parse_rgba(color);
    return to_hexbyte(rgba.r) + to_hexbyte(rgba.g) + to_hexbyte(rgba.b + to_hexbyte(rgba.a));
}

function rgba_to_hex(rgba) {
    return to_hexbyte(rgba.r) + to_hexbyte(rgba.g) + to_hexbyte(rgba.b)+ to_hexbyte(rgba.a);
}
function rgb_to_hex(rgb) {
    return to_hexbyte(rgb.r) + to_hexbyte(rgb.g) + to_hexbyte(rgb.b);
}
function rgb_to_style(rgb) {
    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}

function style_to_rgba(color) {
    let expr = 'rgba(';
    let i = color.indexOf(expr);
    if( i !== -1 ) {
        color = color.slice(expr.length + i);
        color = color.split(',');
        return {
            r: parseInt(color[0]),
            g: parseInt(color[1]),
            b: parseInt(color[2]),
            a: parseFloat(color[3])
        };
    }
    
    expr = 'rgb(';
    i = color.indexOf(expr)
    if ( i  !== -1 ) {
        color = color.slice(expr.length + i);
        color = color.split(',');
        return {
            r: parseInt(color[0]),
            g: parseInt(color[1]),
            b: parseInt(color[2]),
            a: 1
        };
    }
    
    expr = '#'
    i = color.indexOf(expr);
    if ( i !== -1 ) {
        color = color.slice(expr.length + i);
        let rgb = hexcolor_to_rgb(color);
        return {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: 1
        };
    }

    return null;
}