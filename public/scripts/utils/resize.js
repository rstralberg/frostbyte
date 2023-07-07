class Resize {
    static isResizing = false;
    static holdResizing = false;
    static startX;
    static startY;
    static startWidth;
    static startHeight;
    static resizable;
}


function start_resize() {
    Resize.resizable = get_selection();
    if (Resize.resizable) {
        Resize.holdResizing = false;
        Resize.resizable.addEventListener('mousedown', (e) => {
            if (Resize.resizable) {
                Resize.resizable.classList.add('block-resizing');
                Resize.isResizing = true;
                Resize.startX = e.clientX;
                Resize.startY = e.clientY;

                if (document.defaultView && Resize.resizable) {
                    Resize.startWidth = parseInt(document.defaultView.getComputedStyle(Resize.resizable).width, 10);
                    Resize.startHeight = parseInt(document.defaultView.getComputedStyle(Resize.resizable).height, 10);
                }
            }
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stop_resize);
            document.addEventListener('mouseleave', stop_resize);
        });
    }
}

/**
* @param {{ ctrlKey: boolean; clientY: number; }} e
*/
function resize(e) {
    if (Resize.isResizing && Resize.resizable && !Resize.holdResizing) {
        const height = Resize.startHeight + (e.clientY - Resize.startY);
        Resize.resizable.style.height = height + "px";
    }
}

function stop_resize() {
    Resize.isResizing = false;
    Resize.holdResizing = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stop_resize);
    let e = get_selection();
    if (e) {
        safe_replace_class(e, 'block-resizing','block-selected');
        let height = e.getAttribute('data-height');
        if( typeof height != 'undefined') {
            let bh = (e.clientHeight/document.querySelector('main').clientHeight)*100;
            e.style.height = bh.toPrecision(1) + 'vh';
            e.setAttribute('data-height', e.style.height);
        }
        for (let i = 0; i < e.children.length; i++) {
            let element = e.children[i];

            if (element.tagName.toLowerCase() === 'canvas') {

                let canvas = element;
                let content_src = element.getAttribute('data-src');
                let img = document.createElement('img');
                img.addEventListener('load', (ev) => {

                    let extra = canvas.classList.contains('shadow') ? 35 : 0;
                    let dim = scaling(e?.clientWidth, e?.clientHeight - extra, img.width, img.height);

                    canvas.setAttribute('width', dim.w + 'px');
                    canvas.setAttribute('height', dim.h + 'px');

                    let ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                });
                img.src = content_src;
            }

            else if (element.tagName.toLowerCase() === 'iframe') {

                let dim = scaling(e?.clientWidth - 4, e?.clientHeight - 4, element.clientWidth, element.clientHeight);
                element.style.height = dim.h + 'px';
                element.style.width = dim.w + 'px';
            }
        }
    }
}
