// 'text'
// 'align'

function create_text_block(div, data) {
    div.style.textAlign = data.align;
    div.innerHTML = data.text;
}

function text_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_text_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_text_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_text_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_text_clear_formatting);
    add_align_tools(menu);
}

function on_text_bold() {

}

function on_text_italic() {
    
}

function on_text_underline() {
    
}

function on_text_clear_formatting() {
    
}