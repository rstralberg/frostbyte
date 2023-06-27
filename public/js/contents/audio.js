
function create_new_audio() {

    create_form('audio-create', { title: 'Ljud', action: 'Spara' }, [
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
            type: FormType.Text,
            name: 'text',
            label: 'Text',
            value: 'Här kan du skriva lite om låten'
        }
    ])
        .then(
            (resovle) => {

                let content = {
                    url: encodeURIComponent(resovle.get('url')),
                    text: encodeURIComponent(resovle.get('text')),
                    shadow: resovle.get('shadow'),
                    title: encodeURIComponent(resovle.get('title'))
                };

                sql_insert('section',
                    ['page_id', 'type', 'height', 'pos', 'content'],
                    [sql(Global.page.id),
                    sql('audio'),
                    sql(12),
                    sql(document.querySelector('main').childElementCount),
                    sql(JSON.stringify(content))])
                    .then(
                        (id) => {
                            let container = document.querySelector('main');
                            let section = document.createElement('section');

                            section.contentEditable = false;
                            section.classList.add('section-edit');
                            section.setAttribute('data-type', 'audio');
                            section.setAttribute('data-page-id', Global.page.id);
                            section.id = create_section_id(id);
                            container.appendChild(section);

                            draw_audio(section, content);
                        }
                    );
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
    textdiv.innerHTML = decodeURIComponent(content.text);
    textdiv.style.margin = '8px';
    textdiv.style.textAlign = content.align;
    textdiv.contentEditable = Global.user.valid;

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
    section.contentEditable = Global.user.valid;
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
        text: encodeURIComponent(text.innerHTML),
        title: encodeURIComponent(title.innerHTML),
        align: text.style.textAlign
    });
}

