
function create_picture() {

    create_form('Bild', 'Ladda upp', [
        {
            type: FormType.Image,
            name: 'url',
            label: 'Välj bild',
            value: '',
            size: 300,
            shadow: true
        },
        {
            type: FormType.Text,
            name: 'title',
            label: 'Titel',
            value: ''
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        }
    ]).then(
        (resolve) => {
            
            let content = {
                url: encodeURIComponent(resolve['url']),
                shadow: resolve['shadow'],
                title: resolve['title']
            };

            sql_insert('section',
                ['page_id', 'type', 'height', 'pos', 'content'],
                [sql(Global.page.id),
                sql('picture'),
                sql(DEFAULT_HEIGHT),
                sql(document.querySelector('main').childElementCount),
                sql(JSON.stringify(content))])
                .then(
                    (id) => {
                        let container = document.querySelector('main');
                        let section = document.createElement('section');
                        
                        section.style.height = `${DEFAULT_HEIGHT}vh`;
                        section.classList.add('section-edit');
                        section.setAttribute('data-type', 'picture');
                        section.setAttribute('data-page-id', Global.page.id);
                        section.contentEditable = true;
                        set_section_id(section,id);
                        container.appendChild(section);
                        
                        draw_picture(section, content);
                    }
                );
        });
}

function draw_picture(section, content) {
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
   
    section.style.textAlign = content.align;
    
    var img = document.createElement('img');
    img.addEventListener('load', (e) => {
        draw_image(section, img, content.shadow, content.title, content.align);
        on_picture_resize(section);
        let figcap = verify_object(section.querySelector('figcaption'), 'object');
        figcap.style.textAlign = content.align;        
    });
    
    section.addEventListener('dblclick', () => {
        show_fullsize(decodeURIComponent(content.url));
    });

    img.src = decodeURIComponent(content.url);
    
}

function show_picture_tools(section) {

    show_tools('Bild', [
            { title: 'Skugga', func: on_shadow },
            { title: 'Titel', func: on_title },
            { title: 'Vänster', func: on_left },
            { title: 'Mitten', func: on_center },
            { title: 'Höger', func: on_right }]);
    
    function on_shadow() {
        let img = section.querySelector('img');
        if( is_valid(img)) {
            if( img.classList.contains('shadow') ) {
                img.classList.remove('shadow');
            }
            else {
                img.classList.add('shadow');
            }
        }
    }
    function on_title() {

        create_form('Bildens titel', 'Ändra', [
            {
                type: FormType.Text,
                name: 'title',
                value: section.querySelector('figcaption').innerText,
                label: 'Titel'
            }
        ])
        .then(
            (result) => {
                section.querySelector('figcaption').innerText = result['title'];
            }
        );  

    }
    function on_left() {
        section.style.textAlign = 'left';
        let caption = section.querySelector('figcaption');
        if( is_valid(caption)) {
            caption.style.textAlign = 'left';
        }
    }
    function on_center() {
        section.style.textAlign = 'center';
        let caption = section.querySelector('figcaption');
        if( is_valid(caption)) {
            caption.style.textAlign = 'center';
        }
    }
    function on_right() {
        section.style.textAlign = 'right';
        let caption = section.querySelector('figcaption');
        if( is_valid(caption)) {
            caption.style.textAlign = 'right';
        }
    }
}

function delete_picture(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
    .then( 
        () => {
            document.querySelector('main').removeChild(section);
        }
    );
}

function entering_picture(section) {
    show_picture_tools(section);
    section.contentEditable = Global.user.valid ? 'true' : 'false';
}

function leaving_picture(section) {
    leaving_section(section, {
        align: section.style.textAlign,
        url:encodeURIComponent(section.querySelector('img').src),
        shadow: section.querySelector('img').classList.contains('shadow'),
        title: section.querySelector('figcaption').innerText });
}

function on_picture_resize(section) {
    let figure = section.querySelector('figure');
    figure.style.height = section.clientHeight + 'px';
    let img = section.querySelector('img');
    let containerWidth = figure.offsetWidth;
    let containerHeight = figure.offsetHeight - DRAW_IMAGE_SHADOW_SPACE;
    let imgWidth = img.width;
    let imgHeight = img.height;
    let widthRatio = containerWidth / imgWidth;
    let heightRatio = containerHeight / imgHeight;
    let scale = Math.min(widthRatio, heightRatio);
    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;
    img.style.marginTop = '8px';
    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';
}

function show_fullsize(url) {

    let view = document.createElement('div');
    view.classList.add('ifullscreen');
    view.id = 'fullscreen';
    view.style.textAlign = 'center';
    var canvas = document.createElement('canvas');
    view.appendChild(canvas);

    var img = document.createElement('img');
    img.addEventListener('load', () => {
        let appdim = get_app_dimension();
        let dim = scaling(appdim.width, appdim.height-24, img.width, img.height);
        canvas.width = dim.w ;
        canvas.height = dim.h ;
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    });

    let close = document.createElement('button');
    close.classList.add('button');
    close.innerHTML = 'Stäng';
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