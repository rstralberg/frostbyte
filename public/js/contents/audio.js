
function create_new_audio() {

    media_form_audio().then((content) => {
        media_create_audio(content).then((section) => {
            media_draw_audio(section, content);
        })
    });
}

function draw_audio(section, content) {
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
    section.contentEditable = false;


    let audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.id = 'audio-player';
    audio.style.width = '100%';
    if (content.shadow) {
        audio.classList.add('shadow');
    }

    let source = document.createElement('source');
    source.type = 'audio/mpeg';
    source.src = decodeURIComponent(content.url);
    audio.appendChild(source);
    section.appendChild(audio);

    let titlediv = document.createElement('div');
    titlediv.id = `${section.id}-title`;
    titlediv.innerHTML = decodeURIComponent(content.title);
    titlediv.style.textAlign = 'center';
    titlediv.style.fontSize = 'small';
    titlediv.style.fontStyle = 'italic';
    titlediv.contentEditable = false;
    section.appendChild(titlediv);

    let textdiv = document.createElement('div');
    textdiv.id = `${section.id}-text`;
    textdiv.value = is_valid(content.text)  ? decodeURIComponent(content.text) : '';
    textdiv.style.margin = '8px';
    textdiv.style.textAlign = content.align;
    textdiv.contentEditable = User.valid;

    section.appendChild(textdiv);
}

function show_audio_tools(section) {

    var text = section.querySelector(`#${section.id}-text`);
    var title = section.querySelector(`#${section.id}-title`);

    show_tools('Ljud', [
        { title: 'Skugga', func: on_shadow },
        { title: 'Titel', func: on_title },
        { title: 'Vänster', func: on_left },
        { title: 'Mitten', func: on_center },
        { title: 'Höger', func: on_right }]);

    function on_shadow() {
        let audio = section.querySelector('audio');
        if (is_valid(audio)) {
            if (audio.classList.contains('shadow')) {
                audio.classList.remove('shadow');
            }
            else {
                audio.classList.add('shadow');
            }
        }
    }
    function on_title() {

        create_form('audio-title', { title: 'Låtens titel', action: 'Ändra' }, [
            {
                type: FormType.Text,
                name: 'title',
                value: title.innerText,
                label: 'Titel'
            }
        ])
            .then(
                (result) => {
                    title.innerText = result.get('title');
                }
            );

    }

    function on_left() {
        text.style.textAlign = 'left';
    }
    function on_center() {
        text.style.textAlign = 'center';
    }
    function on_right() {
        text.style.textAlign = 'right';
    }
}

function delete_audio(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
        .then(
            () => {
                document.querySelector('main').removeChild(section);
            }
        );
}

function entering_audio(section) {
    show_audio_tools(section);
    section.contentEditable = User.valid;
}

function leaving_audio(section) {
    section.contentEditable = false;
    let audio = section.querySelector('audio');
    let source = audio.querySelector('source');
    let text = section.querySelector(`#${section.id}-text`);
    let title = section.querySelector(`#${section.id}-title`);

    leaving_section(section, {
        url: encodeURIComponent(source.src),
        shadow: audio.classList.contains('shadow'),
        text: encodeURIComponent(text.value),
        title: encodeURIComponent(title.innerHTML),
        align: text.style.textAlign
    });
}

function media_form_audio() {

    return new Promise((resolve, reject) => {
        create_form('audio-create', {
            title: 'MP3 Ljud',
            action: 'Spara'
        }, [
            {
                type: FormType.Upload,
                name: 'url',
                label: 'Ljudfil (mp3)',
            },
            {
                type: FormType.Checkbox,
                name: 'shadow',
                label: 'Skugga',
                value: true
            },
            {
                type: FormType.Text,
                name: 'title',
                label: 'Titel',
            },
            {
                type: FormType.TextArea,
                name: 'text',
                label: 'Text',
                rows: 4,
                cols: 80
            }
        ]).then((values) => {
            resolve({
                url: values.get('url'),
                shadow: values.get('shadow'),
                title: values.get('title'),
                text: values.get('text')
            }),
                () => { reject() };
        });
    });
}

function media_create_audio(content) {

    return new Promise((resolve, reject) => {
        content.url = encodeURIComponent(content.url);
        content.text = encodeURIComponent(content.text);
        content.shadow = content.shadow ? 1 : 0;
        content.title = encodeURIComponent(content.title);

        sql_insert('section',
            ['page_id', 'type', 'height', 'pos', 'content'],
            [sql(Page.page.id),
            sql('audio'),
            sql('20vh'),
            sql(document.querySelector('main').childElementCount),
            sql(JSON.stringify(content))])
            .then(
                (id) => {
                    let container = document.querySelector('main');
                    let section = document.createElement('section');

                    section.contentEditable = false;
                    section.classList.add('section-edit');
                    section.setAttribute('data-type', 'audio');
                    section.setAttribute('data-page-id', Page.page.id);
                    section.id = create_section_id(id);
                    container.appendChild(section);

                    resolve(section);
                },
                () => {
                    reject();
                }
            );
    });
}

function media_insert_audio(section) {

    media_form_audio().then((content) => {

        let div = document.createElement('div');

        let audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.id = 'audio-player';
        audio.style.width = '100%';
        if (content.shadow) {
            audio.classList.add('shadow');
        }

        let source = document.createElement('source');
        source.type = 'audio/mpeg';
        source.src = decodeURIComponent(content.url);
        audio.appendChild(source);
        div.appendChild(audio);

        let titlediv = document.createElement('div');
        titlediv.id = `${section.id}-title`;
        titlediv.innerHTML = decodeURIComponent(content.title);
        titlediv.style.textAlign = 'center';
        titlediv.style.fontSize = 'small';
        titlediv.style.fontStyle = 'italic';
        titlediv.contentEditable = false;
        div.appendChild(titlediv);

        let textdiv = document.createElement('div');
        textdiv.id = `${section.id}-text`;
        textdiv.innerHTML = decodeURIComponent(content.text);
        textdiv.style.margin = '8px';
        textdiv.style.textAlign = content.align;
        textdiv.contentEditable = User.valid;

        div.appendChild(textdiv);
        section.appendChild(div);
    });
}

function media_draw_audio(section, content) {

    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
    section.contentEditable = false;


    let audio = document.createElement('audio');
    audio.setAttribute('controls', '');
    audio.id = 'audio-player';
    audio.style.width = '100%';
    if (content.shadow) {
        audio.classList.add('shadow');
    }

    let source = document.createElement('source');
    source.type = 'audio/mpeg';
    source.src = decodeURIComponent(content.url);
    audio.appendChild(source);
    section.appendChild(audio);

    let titlediv = document.createElement('div');
    titlediv.id = `${section.id}-title`;
    titlediv.innerHTML = decodeURIComponent(content.title);
    titlediv.style.textAlign = 'center';
    titlediv.style.fontSize = 'small';
    titlediv.style.fontStyle = 'italic';
    titlediv.contentEditable = false;
    section.appendChild(titlediv);

    let textdiv = document.createElement('div');
    textdiv.id = `${section.id}-text`;
    textdiv.innerHTML = decodeURIComponent(content.text);
    textdiv.style.margin = '8px';
    textdiv.style.textAlign = content.align;
    textdiv.contentEditable = User.valid;

    section.appendChild(textdiv);
}

