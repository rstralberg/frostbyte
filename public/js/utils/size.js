
function bigger() {
    let section = Global.selected;
    section.style.height = `${section.clientHeight + 10}px`;
    let func = window[`on_${section.getAttribute('data-type')}_resize`];
    if( is_valid(func)) {
        func(section, section.clientHeight);
    }
}

function smaller() {
    let section = Global.selected;
    if( section.clientHeight > 32 ) {
        section.style.height = `${section.clientHeight - 10}px`;
        let func = window[`on_${section.getAttribute('data-type')}_resize`];
        if( is_valid(func)) {
            func(section, section.clientHeight);
        }
        }
}


function document_height() {
    let body = document.body;
    let html = document.documentElement;

    return Math.max( body.scrollHeight, body.offsetHeight, 
                      html.clientHeight, html.scrollHeight, html.offsetHeight );

}