
function parse_border_style(border) {

    let ret = { size: 0, type: 'solid', rgb: { r: 0, g: 0, b: 0 } };
    try {
        border = border.trim(' ');
        border = border.replace(', ', ',');
        border = border.replace(', ', ',');

        let parts = border.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (part.search('none') != -1) {
                break;
            }
            if (part.search('solid') != -1 ||
                part.search('dashed') != -1 ||
                part.search('dotted') != -1) {
                ret.type = part;
            }
            else if (part.search('px') != -1) {
                ret.size = parseInt(part);
            }
            else {
                ret.srgb = parse_rgb(part);
            }
        }
    }
    catch (e) {
        console.error('Failed to parse border ' + border);
    }
    return ret;
}

function parse_border(element) {

    let ret = { size: 0, rgb: { r: 0, g: 0, b: 0 }, type: 'solid'  };
    if (element === null || typeof element === 'undefined') return ret;
    if (has_border(element)) {
        try {
            let cstyle = getComputedStyle(element);

            let border = cstyle['border'];
            border = border.replace(', ', ',');
            border = border.replace(', ', ',');

            let parts = border.split(' ');
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];
                if (part.search('none') != -1) {
                    break;
                }
                if (part.search('solid') != -1 ||
                    part.search('dashed') != -1 ||
                    part.search('dotted') != -1) {
                    ret.type = part;
                }
                else if (part.search('px') != -1) {
                    ret.size = parseInt(part);
                }
                else {
                    ret.rgb = parse_rgb(part);
                }
            }
            ret.radius = parseInt(cstyle['borderRadius']);
        }
        catch (e) {
            console.error('Failed to parse border of ' + element.id + ' where ' + element.style.border + ' and ' + element.style.radius);
        }
    }
    return ret;
}

function build_border(border) {
    return border.size + 'px ' + border.type + ' ' + build_rgb(border.rgb);
}

function has_border(element) {
    return element == 0 ||
        typeof element == 'undefined' ||
        typeof element.style == 'undefined' ||
        typeof element.style.border == 'undefined'  ? false : true;
}

