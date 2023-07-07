const MEDIA_SHADOW = 'data-media-shadow';
const MEDIA_URL = 'data-media-url';
const MEDIA_TEXT = 'data-media-text';
const MEDIA_TYPE = 'data-media-type';

class iMedia {
    id;
    type;
    url;
    shadow;

    constructor(id, type, url, shadow) {
        this.id = id;
        this.type = type;
        this.url = url;
        this.shadow = shadow;
    }
}

function implement_media(div, id) {

    let media = sql_load_media(id);
    div.setAttribute('data-media-type', media.type);
    div.setAttribute('data-media-url', media.url);
    div.setAttribute('data-media-shadow', media.shadow);

    draw_media(div);
}

function draw_media(div) {
    safe_add_class(div, 'block-media');
    remove_childs(div);
    let type = div.getAttribute('data-media-type');
    div.appendChild(implement_media_type(div, type));
}

function create_youtube() {
    create_media('youtube');
}

function create_vimeo() {
    create_media('vimeo');
}

function create_audio() {
    create_media('audio');
}

function create_spotify() {
    create_media('spotify');
}

function create_media(type) {
    const LINK_NAME = 'media-url';
    const TITLE_NAME = 'media-title';
    const SHADOW_NAME = 'media-shadow';
    let form_title = '';

    switch (type) {
        case 'youtube': form_title = Lexer.YOUTUBE; break;
        case 'vimeo': form_title = Lexer.VIMEO; break;
        case 'audio': form_title = Lexer.AUDIO; break;
        case 'spotify': form_title = Lexer.SPOTIFY; break;
    }

    iform(form_title, Lexer.CREATE, [], [
        new iParam(LINK_NAME, 'text', form_title + ' ' + Lexer.LINK, '', [], null),
        new iParam(TITLE_NAME, 'text', Lexer.TITLE, '', [], null),
        new iParam(SHADOW_NAME, 'checkbox', Lexer.SHADOW, true, [], null)],
        (response) => {
            let link = iform_get(response, LINK_NAME);
            let title = iform_get(response, TITLE_NAME);
            let shadow = iform_get(response, SHADOW_NAME);

            link = window['extract_' + type](link);

            let block_id = sql_add_block(get_page().id, 'media', 'center');
            let impl_id = sql_add_media(block_id, shadow, link, title, type);
            sql_update_block_impl(block_id,impl_id);
            
            let block = sql_load_block(block_id);
            get_container().appendChild(render_block(initialize_block(block)));
            });
}

function toolbar_media(toolbar) {
    toolbar.appendChild(toolbar_item('media-shadow', Lexer.SHADOW, media_shadow));
}

function save_media(div) {

    let impl_id = div.getAttribute('data-block-impl-id');
    let url = div.getAttribute('data-media-url');
    let title = div.getAttribute('data-media-title');
    let shadow = div.getAttribute('data-media-shadow')=='true';
    sql_update_media(impl_id, shadow, url, title);
}

function media_shadow() {
    let sel = get_selection();
    let imp_id = parseInt(sel.getAttribute('data-block-impl-id'));
    let shadow = sel.getAttribute('data-media-shadow') == 'true';
    shadow = !shadow;
    sel.setAttribute('data-media-shadow', shadow);
    sql_update_media_shadow(imp_id, shadow);
    draw_media(sel);
}

function extract_youtube(url) {
    let words = url.split('/');
    if (words && words.length > 0) {
        url = words[words.length - 1];
    }
    return url; 
}

function extract_vimeo(url) {
    let words = url.split('/');
    if (words && words.length > 0) {
        for (let i = 0; i < words.length; i++) {
            if (words[i] == 'vimeo.com' && i < words.length - 1) {
                return words[i + 1];

            }
        }
    }
    return url;
}

function extract_spotify(url) {
    let pos = url.search('track/') + 'track/'.length;
    return url.slice(pos);
}

function extract_audio(url) {
    return url;
}


function implement_media_type(div, type) {
    switch (type) {
        case 'audio': return implement_audio(div);
        case 'youtube': return implement_youtube(div);
        case 'vimeo': return implement_vimeo(div);
        case 'spotify': return implement_spotify(div);
        default:
            let msg = document.createElement('div');
            msg.innerHTML = type + ' NOT IMPLEMENTED';
            return msg;
    }
}

function implement_youtube(div) {
    
    let url = html_decode(div.getAttribute('data-media-url'));
    let shadow = div.getAttribute('data-media-shadow') == 'true';
    let title = div.getAttribute('data-block-text');

    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${url}`);
    iframe.setAttribute('title', html_decode(title));
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    
    if( shadow) {
        safe_add_class(iframe, 'shadow');
    }
    else {
        safe_remove_class(iframe, 'shadow');
    }
    return iframe;
}

function implement_vimeo(div, media) {

    let url = html_decode(div.getAttribute('data-media-url'));
    let shadow = div.getAttribute('data-media-shadow') == 'true';
    let title = div.getAttribute('data-block-text');

    let container = document.createElement('div');

    let iframe = document.createElement('iframe');
    container.appendChild(iframe);
    iframe.setAttribute('src', `https://player.vimeo.com/video/${url}?h=7a4daebb0c&byline=0`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    if( shadow ) {
        safe_add_class(iframe, 'shadow');
    }
    else {
        safe_remove_class(iframe, 'shadow');
    }

    let titlediv = document.createElement('div');
    safe_add_class(titlediv, 'media-title');
    titlediv.innerHTML = title;
    container.appendChild(titlediv);

    let script = document.createElement('script');
    script.setAttribute('src', 'https://player.vimeo.com/api/player.js');
    container.appendChild(script);

    return container;
}

function implement_spotify(div, media) {

    let url = html_decode(div.getAttribute('data-media-url'));
    let shadow = div.getAttribute('data-media-shadow') == 'true';
    
    let iframe = document.createElement('iframe');

    iframe.setAttribute('src', html_decode('https://open.spotify.com/embed/track/' + url  + '?utm_source=generator'));
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '352');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    iframe.setAttribute('loading', 'lazy');
    if( shadow ) {
        safe_add_class(iframe, 'shadow');
    }
    else {
        safe_remove_class(iframe, 'shadow');
    }

    return iframe;
}

function implement_audio(div, media) {

    let url = html_decode(div.getAttribute('data-media-url'));
    let shadow = div.getAttribute('data-media-shadow') == 'true';
    let title = div.getAttribute('data-block-text');

    let container = document.createElement(div);

    let audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.id, 'audio-player';
    audio.style.width = 'inherit';
    if( shadow) {
        safe_add_class(audio, 'shadow');
    }
    else {
        safe_remove_class(audio, 'shadow');
    }


    let source = document.createElement('source');
    source.type = 'audio/mpeg';
    source.src = html_decode(url);
    audio.appendChild(source);
    container.appendChild(audio);


    let titlediv = document.createElement('div');
    safe_add_class(titlediv, 'block-audio-title');
    titlediv.innerHTML = title;
    container.appendChild(titlediv);
    return container;
}