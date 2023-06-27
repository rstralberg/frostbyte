

function create_new_spotify() {

    create_form( 'spotify-create', { title:'Skapa spotify', action:'Klar'}, [
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
                    url: encodeURIComponent(result.get('spotify')),
                    shadow: result.get('shadow')
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
                            section.classList.add('spotify');
                            create_section_id(section, id);
                            container.appendChild(section);
                        });
            });
}

function draw_spotify(section, content) {

    section.innerHTML = decodeURIComponent(content.url);
    section.classList.add('spotify');
    
    if (content.shadow) {
        let frame = section.querySelector('iframe');
        if( is_valid(frame)) frame.classList.add('shadow');
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

