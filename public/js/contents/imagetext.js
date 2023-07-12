
function create_new_imagetext() {

    create_form('imagetext-create', {
        title: 'Bild och Text',
        action: 'Ladda upp'
    }, [
        {
            type: FormType.Image,
            name: 'url',
            label: 'Välj bild',
            value: '',
            size: 200,
            shadow: true
        },
        {
            type: FormType.Text,
            name: 'title',
            label: 'Titel',
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        },
        {
            type: FormType.TextArea,
            name: 'text',
            label: 'Text',
            rows: 8,
            cols: 80
        },
        {
            type: FormType.List,
            name: 'imageposition',
            label: 'Bildens position',
            items: [
                { value: 'left', text: 'Bild till vänster om text' },
                { value: 'right', text: 'Bild till höger om text' },
            ],
            selected: 'left'
        }
    ]).then(
        (resolve) => {

            let content = {
                url: encodeURIComponent(resolve.get('url')),
                shadow: resolve.get('shadow'),
                title: encodeURIComponent(resolve.get('title')),
                text: encodeURIComponent(resolve.get('text')),
                img_align: resolve.get('imageposition')
            };

            sql_insert('section',
                ['page_id', 'type', 'height', 'pos', 'content'],
                [sql(Page.id),
                sql('imagetext'),
                sql(20),
                sql(document.querySelector('main').childElementCount),
                sql(JSON.stringify(content))])
                .then(
                    (id) => {
                        let container = document.querySelector('main');
                        let section = document.createElement('section');

                        section.classList.add('section-edit');
                        section.style.height = '20vh';
                        section.id = create_section_id(id);
                        container.appendChild(section);

                        draw_imagetext(section, content);
                    });
                });
}

function draw_imagetext(section, content) {

    console.log(dump_element(section));
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });

    section.style.display = 'flex';

    let image = document.createElement('div');
    image.style.flex = '0 1 30%';
    image.style.margin = '4px';
    image.id = `${section.id}-image`;
    image.addEventListener('mouseup', (e) => {

        image.style.outline = '2px solid white';
        text.style.outline = 'none';
        show_imagetext_image_tools(section);
    });

    let text = document.createElement('div');
    text.style.flex = '1 1 70%';
    text.style.margin = '4px';
    text.style.textAlign = content.align;
    text.contentEditable = true;
    text.id = `${section.id}-text`;
    text.addEventListener('mousedown', (e) => {
        image.style.outline = 'none';
        text.style.outline = '2px solid white';
        show_imagetext_text_tools(section);
    });

    if (content.image_align === 'left') {
        section.appendChild(text);
        section.appendChild(image);
    } else {
        section.appendChild(image);
        section.appendChild(text);
    }

    var img = document.createElement('img');
    img.addEventListener('load', (e) => {
        
        draw_image(image, img, content.shadow, content.title, content.align);
        on_imagetext_resize(image);
        
        let figcap = verify_object(image.querySelector('figcaption'), 'object');
        figcap.style.textAlign = content.align;
    });

    text.innerHTML = decodeURIComponent(content.text);

    section.addEventListener('dblclick', () => {
        show_fullsize(decodeURIComponent(content.url));
    });

    img.src = decodeURIComponent(content.url);
}

function show_imagetext_image_tools(section) {

    var image_element = section.querySelector(`#${section.id}-image`);
    show_tools('Bild', [
        { title: 'Skugga', func: on_shadow },
        { title: 'Titel', func: on_title },
        { title: 'Vänster', func: on_left },
        { title: 'Höger', func: on_right }]);

    function on_shadow() {
        let img = image_element.querySelector('img');
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

        create_form('image-title', {
            title: 'Bildens titel',
            action: 'Ändra'
        }, [
            {
                type: FormType.Text,
                name: 'title',
                value: image_element.querySelector('figcaption').innerText,
                label: 'Titel'
            }
        ])
            .then(
                (result) => {
                    image_element.querySelector('figcaption').innerText = result.get('title');
                }
            );

    }
    function on_left() {
        let img_element = section.querySelector(`#${section.id}-image`);
        if (is_valid(img_element.previousElementSibling, false)) {
            let prev = img_element.previousElementSibling;
            prev.parentNode.insertBefore(img_element, prev);
        }
        img_element.focus();
    }

    function on_right() {
        let img_element = section.querySelector(`#${section.id}-image`);
        if (is_valid(img_element.nextElementSibling, false)) {
            let next = img_element.nextElementSibling;
            next.parentNode.insertBefore(img_element, next.nextSibling);
        }
        img_element.focus();
    }
}

function show_imagetext_text_tools(section) {

    var text_element = section.querySelector(`#${section.id}-text`);
    show_tools('Text', [
        { title: 'Fet', func: on_bold },
        { title: 'Kursiv', func: on_italic },
        { title: 'Stryk', func: on_underline },
        { title: 'Stor', func: on_h1 },
        { title: 'Liten', func: on_h3 },
        { title: 'Markering', func: on_mark },
        { title: 'Normal', func: on_normal },
        { title: 'Länk', func: on_link },
        { title: 'Vänster', func: on_left },
        { title: 'Mitten', func: on_center },
        { title: 'Höger', func: on_right }]);

    function on_bold() { format_selection('b'); }
    function on_italic() { format_selection('i'); }
    function on_underline() { format_selection('u'); }
    function on_h1() { format_selection('h1'); }
    function on_h3() { format_selection('h3'); }
    function on_mark() { format_selection('mark'); }
    function on_normal() { text_element.innerHTML = text_element.innerText; }
    function on_link() {
        let selection = window.getSelection();
        if (selection.rangeCount) {
            var range = selection.getRangeAt(0);
            var text = range.extractContents();
            if (text.textContent.length > 0) {

                create_form('imagetext-link', { title: 'Länk', action: 'Spara' }, [
                    {
                        type: FormType.Label,
                        name: 'text',
                        label: text,
                    },
                    {
                        type: FormType.Text,
                        name: 'link',
                        label: 'Länk',
                        value: 'https://'
                    }
                ]).then(
                    (resolve) => {
                        let a = document.createElement('a');
                        a.classList.add('link');
                        a.href = resolve.get('link');
                        a.appendChild(text);
                        range.insertNode(a);
                    }
                );
            }
        }
    }

    function on_left() {
        text_element.style.textAlign = 'left';
    }

    function on_center() {
        text_element.style.textAlign = 'center';
    }

    function on_right() {
        text_element.style.textAlign = 'right';
    }
}

function delete_imagetext(section) {

    sql_delete('section', `id=${parse_section_id(section)}`).then(
        () => {
            document.querySelector('main').removeChild(section);
            req('delete_file', {
                file: encodeURIComponent(section.querySelector('img').src)
            }).then (
                (resolve) => { },
                (reject) => { }
            )
        }
    );
}

function entering_imagetext(section) {

    let text = section.querySelector(`#${section.id}-text`);
    text.contentEditable = User.valid;
}

function leaving_imagetext(section) {
    var text = section.querySelector(`#${section.id}-text`);
    text.contentEditable = false;

    let first = section.children[0];

    leaving_section(section, {
        align: text.style.textAlign,
        image_align: first.id.includes('text') ? 'right' : 'left',
        url: encodeURIComponent(section.querySelector('img').src),
        shadow: section.querySelector('img').classList.contains('shadow'),
        title: section.querySelector('figcaption').innerText,
        text: encodeURIComponent(text.innerHTML)
    });
}

function on_imagetext_resize(section) {

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

