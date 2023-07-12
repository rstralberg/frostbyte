

function create_new_youtube() {

    create_form('youtube-create', { title: 'Skapa youtube', action: 'Klar' }, [
        {
            type: FormType.TextArea,
            name: 'info',
            rows: 4,
            cols: 60,

            readonly: true,
            value: 'Gå till spotify och välj din låt. Klicka sedan på "Dela" ' +
                'och välj sedan "Bädda in". Klicka senda på "Kopiera" ' +
                'och klistra in här nedan'
        },
        {
            type: FormType.TextArea,
            name: 'url',
            label: 'Klistra in',
            rows: 6,
            cols: 80
        },
        {
            type: FormType.List,
            name: 'align',
            label: 'Posiiton',
            items: [
                { value: 'left', text: 'Vänster'},
                { value: 'center', text: 'Mitten'},
                { value: 'right', text: 'Höger'}
            ],
            selected: 'center'
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        }])
        .then((result) => {
            media_create_youtube({
                url: result.get('url'),
                shadow: result.get('shadow'),
                align: result.get('align')
            });
        });
}

function draw_youtube(section, content) {

    section.classList.add('youtube');
    section.style.textAlign = content.align;
    section.innerHTML = decodeURIComponent(content.url);

    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_youtube_tools(section) {

    show_tools('YouTube', [
        { title: 'Skugga', func: on_shadow },
        { title: 'Vänster', func: on_left },
        { title: 'Mitten', func: on_center },
        { title: 'Höger', func: on_right }]);

    function on_left() {
        section.style.textAlign = 'left';
    }
    function on_center() {
        section.style.textAlign = 'center';
    }
    function on_right() {
        section.style.textAlign = 'right';
    }

    function on_shadow() {
        let iframe = section.querySelector('iframe');
        if (iframe.classList.contains('shadow')) {
            iframe.classList.remove('shadow');
        }
        else {
            iframe.classList.add('shadow');
        }
    }
}

function delete_youtube(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
        .then(
            () => {
                document.querySelector('main').removeChild(section);
            }
        );
}

function entering_youtube(section) {
    show_youtube_tools(section);
    section.contentEditable = false;
}

function leaving_youtube(section) {
    section.contentEditable = false;
    let iframe = section.querySelector('iframe');
    leaving_section(section, {
        url: encodeURIComponent(iframe.src),
        shadow: iframe.classList.contains('shadow'),
        align: section.style.textAlign
    });
}


function media_form_youtube() {

    return new Promise((resolve, reject) => {

        create_form('youtube-create', {
            title: 'Skapa youtube',
            action: 'Skapa'
        }, [
            {
                type: FormType.TextArea,
                name: 'info',
                rows: 4,
                cols: 60,

                readonly: true,
                value: 'Gå till spotify och välj din låt. Klicka sedan på "Dela" ' +
                    'och välj sedan "Bädda in". Klicka senda på "Kopiera" ' +
                    'och klistra in här nedan'
            },
            {
                type: FormType.TextArea,
                name: 'url',
                label: 'Klistra in',
                rows: 4,
                cols: 80
            },
            {
                type: FormType.Checkbox,
                name: 'shadow',
                label: 'Skugga',
                value: true
            }]).then((values) => {
                resolve({
                    url: values.get('url'),
                    shadow: values.get('shadow')
                });
            },
                () => { reject(); });
    });
}

function media_create_youtube(content) {

    content.url = encodeURIComponent(content.url);
    content.shadow = content.shadow ? 1 : 0;

    sql_insert('section',
        ['page_id', 'type', 'height', 'pos', 'content'],
        [sql(Page.id),
        sql('youtube'),
        sql(42),
        sql(document.querySelector('main').childElementCount),
        sql(JSON.stringify(content))])
        .then(
            (id) => {
                let container = document.querySelector('main');
                let section = document.createElement('section');

                section.contentEditable = false;
                create_section_id(section, id);
                container.appendChild(section);

                draw_youtube(section, content);
            }
        );
}