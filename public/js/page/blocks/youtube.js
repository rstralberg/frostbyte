// 'youtube'
// 'align'

function create_youtube_block(div, data) {
    div.style.youtubeAlign = data.align;
    div.innerHTML = data.youtube;
}

function youtube_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_youtube_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_youtube_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_youtube_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_youtube_clear_formatting);
    add_align_tools(menu);
}

function on_youtube_bold() {

}

function on_youtube_italic() {
    
}

function on_youtube_underline() {
    
}

function on_youtube_clear_formatting() {
    
}