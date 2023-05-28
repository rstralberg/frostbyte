// 'empty'
// 'align'

function create_empty_block(div, data) {
    div.style.emptyAlign = data.align;
    div.innerHTML = data.empty;
}

function empty_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_empty_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_empty_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_empty_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_empty_clear_formatting);
    add_align_tools(menu);
}

function on_empty_bold() {

}

function on_empty_italic() {
    
}

function on_empty_underline() {
    
}

function on_empty_clear_formatting() {
    
}