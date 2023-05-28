// 'spotify'
// 'align'

function create_spotify_block(div, data) {
    div.style.spotifyAlign = data.align;
    div.innerHTML = data.spotify;
}

function spotify_selected(div,block, data) {
    div.setAttribute('contenteditable','true');
    
    let menu = show_toolsmenu();
    add_tool(menu,'icons/bold.svg', T('bold'), on_spotify_bold);
    add_tool(menu,'icons/italic.svg', T('italic'), on_spotify_italic );
    add_tool(menu,'icons/underline.svg', T('underline'), on_spotify_underline );
    add_tool(menu,'icons/format-clear.svg', T('clear_format'), on_spotify_clear_formatting);
    add_align_tools(menu);
}

function on_spotify_bold() {

}

function on_spotify_italic() {
    
}

function on_spotify_underline() {
    
}

function on_spotify_clear_formatting() {
    
}