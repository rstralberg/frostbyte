
function implement_section(div, id) {

    let text = sql_load_text(id);
    if( text != null )
    {
        div.setAttribute('data-text-opt', text.opt);
        div.setAttribute('data-text-text', text.text);
        draw_section(div);
    }
}

function draw_section(div) {
    safe_add_class(div, 'block-text');
    
    let opt = div.getAttribute('data-text-opt');
    let text = div.getAttribute('data-text-text');
    switch (text.opt) {
        case 'title':
            safe_add_class(div, 'block-title');
            div.innerHTML = '<h1>' + text + '</h1>';
            break;
        case 'h1':
        case 'h2':
        case 'h3':
            div.innerHTML = '<' + opt + '>' + text + '</' + opt + '>';
            break;
        default:
            div.innerHTML = text;
            break;
    }
}


function create_section() {

    let block_id = sql_add_block(get_page().id, 'text');
    let impl_id = sql_add_text(block_id,Lexer.RANDOM_TEXT, '');
    sql_update_block_impl(block_id,impl_id);

    let block = sql_load_block(block_id); 
    if (block ) {
        get_container().appendChild(render_block(initialize_block(block)));
    }
}

function save_section(div) {
    let id = div.getAttribute('data-block-impl-id');
    let opt = div.getAttribute('data-text-opt');
    let text = div.innerHTML;
    sql_update_text(id, text, opt);
}

function toolbar_section(toolbar) {

    toolbar.appendChild(toolbar_item('text-bold', Lexer.BOLD, bold));
    toolbar.appendChild(toolbar_item('text-italic', Lexer.ITALIC, italic));
    toolbar.appendChild(toolbar_item('text-underline', Lexer.UNDERLINE, underline));
    toolbar.appendChild(toolbar_item('text-underline', Lexer.NORMAL, clear_format));
}

function clear_format() {
    let elem = get_selection();
    elem.innerHTML = elem.innerText;
}

function toggle_opt(opt, param) {
    return opt.includes(param) ? '' : param;
}

function toggle_param(type) {
    let div = get_selection();
    let opt = div.getAttribute('data-text-opt');
    opt = toggle_opt(opt, type);
    div.setAttribute('data-text-opt', opt);
    draw_section(div);
}

function title(e) {
    toggle_param('title');
}

function h1(ev) {
    toggle_param('h1');
}

function h2(ev) {
    toggle_param('h2');
}

function h3(ev) {
    toggle_param('h3');
}

function add_html_tag(tag) {
    let selection = window.getSelection();
    if (selection.rangeCount) {
        let range = selection.getRangeAt(0);
        let span = document.createElement(tag);
        span.appendChild(range.extractContents());
        range.insertNode(span);
        get_selection().focus(); // keep focus on the editor
    }
}

function underline(ev) {
    add_html_tag('u');
}

function bold(ev) {
    add_html_tag('b');
}

function italic(ev) {
    add_html_tag('i');
}

function align_left(ev) {
    content_align('left');
}

function align_center(ev) {
    content_align('center');
}

function align_right(ev) {
    content_align('right');
}

function content_align(align) {
    let div = get_selection();
    div.style.textAlign = align;
    for( let i = 0; i < div.children.length; i++) {
        div.children[i].style.textAlign = align;
    }
}
