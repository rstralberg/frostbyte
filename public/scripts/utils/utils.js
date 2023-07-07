
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
    return { w, h };
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

function for_each_child(elem,arg,func) {
    for( let i=0; i < elem.children.length; i++) {
        func(arg,elem.children[i]);
    }
}

