// 'vimeo'
// 'align'

function create_vimeo_block(div, data) {
    div.style.vimeoAlign = data.align;
    div.innerHTML = data.vimeo;
}

function vimeo_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_vimeo_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_vimeo_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_vimeo_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_vimeo_clear_formatting);
    add_align_tools(menu);
}

function on_vimeo_bold() {

}

function on_vimeo_italic() {
    
}

function on_vimeo_underline() {
    
}

function on_vimeo_clear_formatting() {
    
}