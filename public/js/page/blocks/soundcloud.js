// 'soundcloud'
// 'align'

function create_soundcloud_block(div, data) {
    div.style.soundcloudAlign = data.align;
    div.innerHTML = data.soundcloud;
}

function soundcloud_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_soundcloud_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_soundcloud_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_soundcloud_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_soundcloud_clear_formatting);
    add_align_tools(menu);
}

function on_soundcloud_bold() {

}

function on_soundcloud_italic() {
    
}

function on_soundcloud_underline() {
    
}

function on_soundcloud_clear_formatting() {
    
}