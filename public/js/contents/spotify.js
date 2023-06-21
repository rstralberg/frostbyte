

function create_spotify() {

    create_form('Skapa spotify', 'Klar', [
        {
            type: FormType.TextArea,
            name: 'info',
            rows: 4,
            cols: 60,

            readonly: true,
            value: 'Gå till spotify och välj din låt. Klicka sedan på "Dela" ' +
                'och välj sedan "Bädda in spår". Klicka senda på "Kopiera" ' +
                'och klistra in här nedan'
        },
        {
            type: FormType.Text,
            name: 'spotify',
            label: 'Klistra in',
            value: ''
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        }]).then(
            (result) => {
                var content = {
                    url: encodeURIComponent(extract_spotify_track(result['spotify'])),
                    shadow: result['shadow']
                };

                sql_insert('section',
                    ['page_id', 'type', 'height', 'pos', 'content'],
                    [sql(Global.page.id),
                    sql('spotify'),
                    sql(42),
                    sql(document.querySelector('main').childElementCount),
                    sql(JSON.stringify(content))])
                    .then(
                        (id) => {
                            let container = document.querySelector('main');
                            let section = document.createElement('section');

                            section.classList.add('section-edit');
                            section.setAttribute('data-type', 'spotify');
                            section.setAttribute('data-page-id', Global.page.id);
                            section.contentEditable = true;
                            create_section_id(section, id);
                            container.appendChild(section);
                        });
            });
}

function draw_spotify(section, content) {

    section.style.padding = '16px';

    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', htmlDecode('https://open.spotify.com/embed/track/' + content.url ));
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '352');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    iframe.setAttribute('loading', 'lazy');
    section.appendChild(iframe);

    if (content.shadow) {
        section.querySelector('iframe').classList.add('shadow');
    }

    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_spotify_tools(section) {

    show_tools('spotify', [
        { title: 'Skugga', func: on_shadow }
    ]);
    function on_shadow() 
    {
        let frame = section.querySelector('iframe');
        if( frame.classList.contains('shadow')) {
            frame.classList.remove('shadow');
        }
        else {
            frame.classList.add('shadow');
        }
    }
}

function extract_spotify_track(url) {
    let pos = url.search('track/') + 'track/'.length;
    return url.slice(pos);
}

function delete_spotify(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
        .then(
            () => {
                document.querySelector('main').removeChild(section);
            }
        );
}

function entering_spotify(section) {
    show_spotify_tools(section);
    section.contentEditable = false;
}

function leaving_spotify(section) {
    section.contentEditable = false;
    leaving_section(section, {
        url: encodeURIComponent(section.innerHTML),
        shadow: section.querySelector('iframe').classList.contains('shadow')
    });
}

