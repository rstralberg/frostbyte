
function centerInParent(parent, element) {
    if (parent && element) {
        element.style.top =
            Math.round(parent.offsetTop + (parent.clientHeight - element.clientHeight) / 2) + 'px';
        element.style.left =
            Math.round(parent.offsetLeft + (parent.clientWidth - element.clientWidth) / 2) + 'px';
    }
}

function remove_childs(parent) {
    while (parent && parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function html_decode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent === null ? '' : doc.documentElement.textContent;
}

function scaling(max_w, max_h, w, h) {
    let scale = max_h / h;
    w *= scale;
    h *= scale;
    if (w > max_w) {
        scale = max_w / w;
        w *= scale;
        h *= scale;
    }
    return {
        w: Math.round(w),
        h: Math.round(h)
    };
}


function openFullScreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}

function clamp(min, max, val) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}

function for_each_child(elem, arg, func) {
    for (let i = 0; i < elem.children.length; i++) {
        func(arg, elem.children[i]);
    }
}

function remove_all_spaces(str) {
    return str.replace(/\s/g, '');
}

function safe_boolean(v) {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v != 0;
    if (typeof v === 'string') return v === 'true';
    return v;
}

function add_quotes(str) {
    return `"${str}"`;
}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent === null ? '' : doc.documentElement.textContent;
}

function get_height_as_vh(div) {
    return Math.round((div.clientHeight / get_app_dimension().height) * 100);
}

function calc_pixel_height_as_vh(pixels) {
    return Math.round((pixels / get_app_dimension().height) * 100);
}

function vh_to_pixels(vh) {
    return Math.round((vh / 100) * get_app_dimension().height);
}

function pixels_to_vh(pixels) {
    return Math.round((pixels / get_app_dimension().height) * 100);
}

function get_app_dimension() {
    return {
        width: document.querySelector('body').clientWidth,
        height: document.querySelector('.left').clientHeight
    };
}


function format_selection(tag) {
    let selection = window.getSelection();
    if (selection.rangeCount) {
        let range = selection.getRangeAt(0);
        let span = document.createElement(tag);
        span.appendChild(range.extractContents());
        range.insertNode(span);
    }
}
