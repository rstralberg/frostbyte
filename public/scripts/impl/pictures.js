
function implement_picture(div, id) {

    safe_add_class(div, 'block-picture');
    

    let picture = sql_load_picture(id);
        
    let main = document.querySelector('main');
    let h=  ((picture.height + ((picture.shadow?1:0)*4))/100) * main.clientHeight
    div.style.height = h + 'px';
    div.style.marginBottom = (picture.shadow ? 32 : 0) + 'px';

    div.setAttribute('data-picture-title', picture.title);
    div.setAttribute('data-picture-url', picture.url);
    div.setAttribute('data-picture-shadow', picture.shadow);
    
    render_picture(div);
}

function render_picture(div) {
    if (div) {
        remove_childs(div);

        let images = div.getAttribute('data-picture-url').split(',');
        images.forEach(img => {

            let canvas = document.createElement('canvas');
            div.appendChild(canvas);

            canvas.setAttribute('data-src', img);
            canvas.addEventListener('dblclick', () => {
                handle_picture(canvas);
            });
        });
        draw_picture(div);

    }
}

function draw_picture(div) {
    let shadows = div.getAttribute('data-picture-shadow') == 'true';
    let title = div.getAttribute('data-picture-title');
    
    for (let i = 0; i < div.children.length; i++) {
        let element = div.children[i];

        if (element.tagName.toLowerCase() === 'canvas') {

            let canvas = element;
            let content_src = element.getAttribute('data-src');
            let img = document.createElement('img');
            img.addEventListener('load', () => {

                let extra = shadows ? 35 : 0;
                let dim = scaling(div.clientWidth, div.clientHeight - extra, img.width, img.height);

                canvas.setAttribute('width', dim.w + 'px');
                canvas.setAttribute('height', dim.h + 'px');

                if (shadows) {
                    safe_add_class(canvas, 'shadow');
                }
                else {
                    safe_remove_class(canvas, 'shadow')
                }
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.font = '14px Georgia';

                ctx.fillStyle = '#000000';
                ctx.fillText(title,8, canvas.height-2);

                ctx.fillStyle = '#ffffff';
                ctx.fillText(title,5, canvas.height-4);

            });
            img.src = content_src;
        }
    }
}

function create_picture() {
    upload_file(Lexer.SELECT_IMAGE, Lexer.IMAGE_TYPES, get_page().id,
        (response) => {
            let block_id = sql_add_block(get_page().id, 'picture');
            let impl_id = sql_add_picture(block_id,response.url,response.title,true,30);
            sql_update_block_impl(block_id, impl_id);
            let block = sql_load_block(block_id);
            get_container().appendChild(render_block(initialize_block(block)));
        });
}

function resize_picture(on) {
    if (on) {
        get_selection().removeAttribute('style');
        start_resize();
    }
    else {
        get_selection().setAttribute('style', 'max-height:' + get_selection().clientHeight + 'px');
        stop_resize();
    }

}

function toolbar_picture(toolbar) {

    toolbar.appendChild(toolbar_item('pics-resize', Lexer.RESIZE, resize_picture));
    toolbar.appendChild(toolbar_item('pics-shadow', Lexer.SHADOW, picture_shadow));
}

function save_picture(div) {

    sql_update(`update block set 
        \`pos\`=${calc_block_pos(div)} 
        where \`id\`=${parseInt(div.getAttribute('data-block-impl-id'))}`);
}

function pictures_layout() {

    // div , {= get_selection();
    // let content = JSON.parse(div.getAttribute('data-content'));

    // const COLS = 'pic-columns';
    // const MAX_SIZE = 'pic-max-height';

    // iform(Lexer.PICTURE, Lexer.CHANGE, [
    //     { name: COLS, type: 'text', label: Lexer.COLUMNS, value: content.cols },
    //     { name: MAX_SIZE, type: 'text', label: Lexer.MAX_HEIGHT, value: content.max }],
    //     (response) => {

    //         let cols = iform_get(response, COLS);
    //         let max = iform_get(response, MAX_SIZE);

    //         content.cols = cols;
    //         content.max = max;

    //         sql_update('update blocks set '
    //             + 'content=' + sql_content(content) + ' '
    //             + 'where id=' + block_id());

    //         div.setAttribute('data-content', JSON.stringify(content));
    //         div.setAttribute('style', 'height:' + max + 'px;max-height:' + max + 'px');

    //         remove_childs(div);
    //         render_picture(content, div);
    //     });
}

function picture_shadow() {

    let div = get_selection();
    let shadow = div.getAttribute('data-picture-shadow') == 'true';
    for_each_child(div,shadow, (shadow,elem)=> {
        if( elem.tagName === 'CANVAS') {
            if( shadow ) {
                safe_add_class( elem, 'shadow');
            }
            else {
                safe_remove_class( elem, 'shadow');
            }
        }
    });
    shadow = !shadow;
    div.setAttribute('data-picture-shadow', shadow);
}    

function add_picture() {

    let div = get_selection();
    let block_id = parseInt(div.getAtttribute('data-block-id'));
 
    upload_file(Lexer.SELECT_IMAGE, Lexer.IMAGE_TYPES, get_page().id,
    (response) => {
        let url = div.getAttribute('data-picture-url');
        url += ';' + response.url;

        let block_id = sql_add_block(get_page().id, 'picture');
        let impl_id = sql_add_picture(block_id,url,response.title,true,30);
        sql_update_block_impl(block_id, impl_id);
        let block = sql_load_block(block_id);
        get_container().appendChild(render_block(initialize_block(block)));
    });
}

function handle_picture(selection) {
    if (selection) 
    {
        let block_id = parseInt(get_selection().getAttribute('data-block-id'));
        let user = get_curuser();
        if (user && user.system) {
            selection.style.border = '2px solid red';
            let content = JSON.parse(get_selection().getAttribute('data-content'));

            let form = document.createElement('form');
            safe_add_class(form, 'userform');
            if (content.pictures.length > 1) {
                form.appendChild(ibutton('delete', Lexer.DELETE_IMAGE, (_id) => {
                    let selected_image = 0;
                    for (let i = 0; i < content.pictures.length; i++) {
                        if (selection.getAttribute('data-src') == content.pictures[i]) {
                            selected_image = i;
                            break;
                        }
                    }
                    content.pictures.splice(selected_image, 1);
                    sql_update('update blocks set '
                        + 'content=' + sql_content(content) + ' '
                        + 'where id=' + block_id);
                    render_picture(content, get_selection());

                }));
            }
            form.appendChild(ibutton('replace', Lexer.REPLACE_IMAGE, (_id) => {
                let selected_image = 0;
                for (let i = 0; i < content.pictures.length; i++) {
                    if (selection.getAttribute('data-src') == content.pictures[i]) {
                        selected_image = i;
                        break;
                    }
                }

                upload_file(Lexer.SELECT_IMAGE, Lexer.IMAGE_TYPES, get_page().id,
                    (file) => {
                        content.pictures[selected_image] = file;
                        sql_update('update blocks set '
                            + 'content=' + sql_content(content) + ' '
                            + 'where id=' + block_id);
                        render_picture(content, get_selection());
                    },
                    (file) => {
                        alert(Lexer.UPLOAD_FAILED + ' ' + file);
                    });
            }));
        }
        else {
            let view = document.createElement('div');
            safe_add_class(view, 'fullscreen')
            view.id = 'fullscreen';

            let canvas = document.createElement('canvas');
            view.appendChild(canvas);

            let content_src = selection.getAttribute('data-src');
            let img = document.createElement('img');
            img.addEventListener('load', () => {

                let dim = scaling(view.clientWidth, view.clientHeight, img.width, img.height);

                canvas.setAttribute('width', dim.w + 'px');
                canvas.setAttribute('height', dim.h + 'px');

                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            });

            let close = document.createElement('button');
            safe_add_class(close, 'modal-close');
            safe_add_class(close, 'content_button');

            close.innerHTML = Lexer.CLOSE;
            close.style.width = '100%';
            close.style.position = 'relative';
            close.addEventListener('click', function (e) {
                let m = document.getElementById('fullscreen');
                if (m) {
                    document.querySelector('body').removeChild(m);
                }
            });
            view.appendChild(close);
            document.querySelector('body').appendChild(view);
            img.src = content_src;
        }
    }
}

