// 'url'
// 'size'
// 'shadow'
// 'align
// 'title'

function create_picture_block(div,data) {


    let canvas = document.createElement('canvas');
    canvas.classList.add(div.classList[0]);
    div.appendChild(canvas);

    canvas.addEventListener('dblclick', () => {
        show_fullsize(data.url);
    });

    let img = document.createElement('img');
    img.addEventListener('load', () => {

        let extra = data.shadow === 'true' ? 35 : 0;
        let dim = scaling(div.clientWidth, div.clientHeight - extra, img.width, img.height);

        canvas.setAttribute('width', dim.w + 'px');
        canvas.setAttribute('height', dim.h + 'px');

        if (data.shadow === 'true') {
            canvas.classList.add('shadow');
        }
        else {
            canvas.classList.remove('shadow');
        }
        
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = '16px Ariel';

        ctx.fillStyle = '#000000';
        ctx.fillText(data.title,8, canvas.height-2);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.title,5, canvas.height-4);
    });
    img.src = data.url;
}


function picture_selected(div,block, data) {
    let menu = show_toolsmenu();
    add_tool(menu,'icons/image.svg', T('picture'), on_picture_image);
    add_tool(menu,'icons/shadow.svg', T('shadow'), on_picture_shadow);
    add_tool(menu,'icons/title.svg', T('title'), on_picture_title);
    add_align_tools(menu);

}

function on_picture_image() 
{}

function on_picture_shadow() 
{}

function on_picture_title() 
{}

//     create() {
//     upload_file(Lexer.SELECT_IMAGE, Lexer.IMAGE_TYPES, get_page().id,
//         (response) => {
//             let block_id = sql_add_block(get_page().id, 'picture');
//             let impl_id = sql_add_picture(block_id,response.url,response.title,true,30);
//             sql_update_block_impl(block_id, impl_id);
//             let block = sql_load_block(block_id);
//             get_container().appendChild(render_block(initialize_block(block)));
//         });
// }

    // resize(on) {
    // if (on) {
    //     Block.selected().removeAttribute('style');
    //     start_resize();
    // }
    // else {
    //     Block.selected().setAttribute('style', 'max-height:' + Block.selected().clientHeight + 'px');
    //     stop_resize();
    // }

// }

//     toolbar(toolbar) {

//     toolbar.appendChild(toolbar_item('pics-resize', Lexer.RESIZE, this.resize));
//     toolbar.appendChild(toolbar_item('pics-shadow', Lexer.SHADOW, this.shadow));
// }

//     save(div) {

//     SQL.update(`update block set 
//         \`pos\`=${calc_block_pos(div)} 
//         where \`id\`=${parseInt(div.getAttribute('data-block-impl-id'))}`);
// }


//     shadow() {

//     let div = Block.selected();
//     let shadow = div.getAttribute('data-picture-shadow') == 'true';
//     for_each_child(div,shadow, (shadow,elem)=> {
//         if( elem.tagName === 'CANVAS') {
//             if( shadow ) {
//                 safeAddClass( elem, 'shadow');
//             }
//             else {
//                 safe_remove_class( elem, 'shadow');
//             }
//         }
//     });
//     shadow = !shadow;
//     div.setAttribute('data-picture-shadow', shadow);
// }    

//     add() {

//     let div = Block.selected();
//     let block_id = parseInt(div.getAtttribute('data-block-id'));
 
//     upload_file(Lexer.SELECT_IMAGE, Lexer.IMAGE_TYPES, get_page().id,
//     (response) => {
//         let url = div.getAttribute('data-picture-url');
//         url += ';' + response.url;

//         let block_id = sql_add_block(get_page().id, 'picture');
//         let impl_id = sql_add_picture(block_id,url,response.title,true,30);
//         sql_update_block_impl(block_id, impl_id);
//         let block = sql_load_block(block_id);
//         get_container().appendChild(render_block(initialize_block(block)));
//     });
// }

function show_fullsize(url) {

    let view = document.createElement('div');
    view.classList.add('ifullscreen');
    view.id = 'fullscreen';

    let canvas = document.createElement('canvas');
    view.appendChild(canvas);

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
    close.classList.add('button');
    close.innerHTML = T('close');
    close.style.width = '100%';
    close.style.position = 'relative';
    close.addEventListener('click', function (e) {
        let m = document.getElementById('fullscreen');
        if (m) {
            document.querySelector('html').removeChild(m);
        }
    });
    view.appendChild(close);
    
    document.querySelector('html').appendChild(view);
    img.src = url;
}


