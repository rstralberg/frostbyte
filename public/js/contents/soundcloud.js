

function create_soundcloud() {

    create_form('soundcloud-create', { title:'Skapa soundcloud', action:'Klar' }, [
        {
            type: FormType.TextArea,
            name: 'info',
            rows: 4,
            cols: 60,

            readonly: true,
            value: 'Gå till Soundcloud och välj din låt. Klicka sedan på "Share" ' +
                    'och välj där fliken "Embedd". Kopiera sedan det som finns i fältet ' +
                    '"Code" och klistra in här nedan'
        },
        {
            type: FormType.Text,
            name: 'soundcloud',
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
                    url: encodeURIComponent(result['soundcloud']),
                    shadow: result['shadow']
                };

                sql_insert('section',
                    ['page_id', 'type', 'height', 'pos', 'content'],
                    [sql(Global.page.id),
                    sql('soundcloud'),
                    sql(40),
                    sql(document.querySelector('main').childElementCount),
                    sql(JSON.stringify(content))])
                    .then(
                        (id) => {
                            let container = document.querySelector('main');
                            let section = document.createElement('section');
                            section.contentEditable = false;
                            create_section_id(section,id);
                            container.appendChild(section);
                            
                            draw_soundcloud(section, content);
                        }
                    );
            });
}

function draw_soundcloud(section, content) {

    section.innerHTML = decodeURIComponent(content.url);
    section.classList.add('soundcloud');
    

    if( content.shadow ) {
        section.querySelector('iframe').classList.add('shadow');
    }
                            
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_soundcloud_tools(section) {

    show_tools('soundcloud', [
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

function delete_soundcloud(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
    .then( 
        () => {
            document.querySelector('main').removeChild(section);
        }
    );
}

function entering_soundcloud(section) {
    show_soundcloud_tools(section);
    section.contentEditable = false;
}

function leaving_soundcloud(section) {
    section.contentEditable = false;
    leaving_section(section, {
        url: encodeURIComponent(section.innerHTML),
        shadow: section.querySelector('iframe').classList.contains('shadow')
    });
}

