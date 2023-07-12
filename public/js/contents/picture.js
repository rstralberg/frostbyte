
function create_new_picture() {

    create_form('picture-create', {
        title: 'Bild',
        action: 'Ladda upp'
    }, [
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
            required: true
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        },
        {
            type: FormType.List,
            name: 'align',
            label: 'Postion',
            items: [
                { value: 'left', text: 'Vänster' },
                { value: 'center', text: 'Mitten' },
                { value: 'right', text: 'Höger' }
            ],
            selected: 'center'
        }
    ]).then((resolve) => {
        media_create_picture({
            url: resolve.get('url'),
            shadow: resolve.get('shadow'),
            title: resolve.get('title'),
            align: resolve.get('align')
        });
    });
}

function draw_picture(section, content) {
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });

    section.style.textAlign = content.align;
    section.contentEditable = false;


    var img = document.createElement('img');
    img.addEventListener('load', (e) => {
        draw_image(section, img, content.shadow, decodeURIComponent(content.title), content.align);
        on_picture_resize(section);
        align_picture(section, content.align);
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
        if (is_valid(img)) {
            if (img.classList.contains('shadow')) {
                img.classList.remove('shadow');
            }
            else {
                img.classList.add('shadow');
            }
        }
    }
    function on_title() {

        create_form('picture-title', { title: 'Bildens titel', action: 'Ändra' }, [
            {
                type: FormType.Text,
                name: 'title',
                value: section.querySelector('figcaption').innerText,
                label: 'Titel'
            }
        ])
            .then(
                (result) => {
                    section.querySelector('figcaption').innerText = result.get('title');
                },
                () => { }
            );

    }
    function on_left() {
        align_picture(section, 'left');
    }
    function on_center() {
        align_picture(section, 'center');
    }
    function on_right() {
        align_picture(section, 'right');
    }
}

function delete_picture(section) {
    sql_delete('section', `id=${parse_section_id(section)}`).then(
        () => {
            document.querySelector('main').removeChild(section);
            req('delete_file', { file: encodeURIComponent(section.querySelector('img').src) });
        }
    );
}

function entering_picture(section) {
    show_picture_tools(section);
    section.contentEditable = false;
}

function leaving_picture(section) {
    leaving_section(section, {
        align: section.style.textAlign,
        url: encodeURIComponent(section.querySelector('img').src),
        shadow: section.querySelector('img').classList.contains('shadow'),
        title: section.querySelector('figcaption').innerText
    });
}

function on_picture_resize(section) {

    let figure = section.querySelector('figure');
    figure.style.height = section.style.height;
    console.log( 'on_picture_resize: section ' + pixels_to_vh(section.clientHeight));
    
    let img = section.querySelector('img');
    let containerWidth = figure.offsetWidth;
    let containerHeight = figure.offsetHeight - DRAW_IMAGE_SHADOW_SPACE;
    console.log( 'container ' + pixels_to_vw(containerWidth) + ' x ' + pixels_to_vh(containerHeight));
    
    let imgWidth = img.width;
    let imgHeight = img.height;
    console.log( 'img ' + pixels_to_vw(imgWidth) + ' x ' + pixels_to_vh(imgHeight));

    let widthRatio = containerWidth / imgWidth;
    let heightRatio = containerHeight / imgHeight;
    console.log( 'ratio ' + widthRatio + ' x ' + heightRatio);

    let scale = Math.min(widthRatio, heightRatio);
    console.log( 'scale ' + scale);

    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;
    console.log( 'new img size ' + pixels_to_vw(newWidth) + ' x ' + pixels_to_vh(newHeight) );

    img.style.marginTop = '8px';
    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';

    section.style.height = figure.style.height;
    section.style.width =  'auto';
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
        let dim = scaling(appdim.width, appdim.height - 24, img.width, img.height);
        canvas.width = dim.w;
        canvas.height = dim.h;
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

function align_picture(section, align) {
    section.style.textAlign = align;
    let caption = section.querySelector('figcaption');
    if (is_valid(caption)) {
        caption.style.textAlign = align;
    }

}


function media_form_picture() {

    return new Promise((resolve, reject) => {
        create_form('picture-create', {
            title: 'Bild',
            action: 'Ladda upp'
        }, [
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
                required: true
            },
            {
                type: FormType.Checkbox,
                name: 'shadow',
                label: 'Skugga',
                value: true
            },
            {
                type: FormType.List,
                name: 'align',
                label: 'Position',
                items: [
                    { value: 'left', text: 'Vänster' },
                    { value: 'center', text: 'Mitten' },
                    { value: 'right', text: 'Höger' }
                ],
                selected: 'center'
            }]).then((values) => {
                resolve({
                    url: values.get('url'),
                    title: values.get('title'),
                    shadow: values.get('shadow'),
                    align: values.get('align')
                });
            },
                () => { reject() });

    });
}


function media_create_picture(content) {

    content.url = encodeURIComponent(content.url);
    content.shadow = content.shadow;
    content.title = encodeURIComponent(content.title);
    content.align = content.align;

    sql_insert('section',
        ['page_id', 'type', 'height', 'pos', 'content'],
        [sql(Page.id),
        sql('picture'),
        sql('20vh'),
        sql(document.querySelector('main').childElementCount),
        sql(JSON.stringify(content))])
        .then(
            (id) => {
                let container = document.querySelector('main');
                let section = document.createElement('section');

                section.contentEditable = false;
                section.classList.add('section-edit');
                section.style.height = '20vh';
                section.id = create_section_id(id);
                container.appendChild(section);
                draw_picture(section, content);
                show_picture_tools(section);
            }
        );
}


function insert_picture(section, content) {
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });

    let div = document.createElement('div');


    div.style.textAlign = content.align;
    div.contentEditable = false;

    var img = document.createElement('img');
    img.addEventListener('load', (e) => {
        draw_image(div, img, content.shadow, content.title, content.align);
        on_picture_resize(div);
        align_picture(div, content.align);
    });

    div.addEventListener('dblclick', () => {
        show_fullsize(decodeURIComponent(content.url));
    });

    img.src = decodeURIComponent(content.url);
    section.appendChild(div);
}
