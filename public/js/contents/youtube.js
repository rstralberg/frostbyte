

function create_youtube() {

    create_form('Skapa youtube', 'Klar', [
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
            name: 'url',
            label: 'Klistra in',
            value: ''
        },
        {
            type: FormType.Checkbox,
            name: 'shadow',
            label: 'Skugga',
            value: true
        }])
        .then(
            (result) => {

                var content = {
                    url : encodeURIComponent( extract_youtube_track(result['url'])),
                    shadow: result['shadow']
                };

                sql_insert('section',
                    ['page_id', 'type', 'height', 'pos', 'content'],
                    [sql(Global.page.id),
                    sql('youtube'),
                    sql(DEFAULT_HEIGHT),
                    sql(document.querySelector('main').childElementCount),
                    sql(JSON.stringify(content))])
                    .then(
                        (id) => {
                            let container = document.querySelector('main');
                            let section = document.createElement('section');
                            
                            section.style.height = `${DEFAULT_HEIGHT}vh`;
                            section.classList.add('section-edit');
                            section.setAttribute('data-type', 'youtube');
                            section.setAttribute('data-page-id', Global.page.id);
                            section.contentEditable = true;
                            create_section_id(section,id);
                            container.appendChild(section);
                            
                            draw_youtube(section, content);
                        }
                    );
            });
}

function draw_youtube(section, content) {

{/* <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/65it0Slapwk?controls=0" 
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
</iframe> */}


    let iframe = document.createElement('iframe');
    iframe.width = section.clientWidth-2*Global.YOUTUBE_MARGIN;
    iframe.height = Math.round(parseInt(iframe.width)/1.77);
    iframe.src =`https://www.youtube.com/embed/${decodeURIComponent(content.url)}`;
    iframe.title = decodeURIComponent(content.title);
    iframe.style.border = 'none';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.margin = `${Global.YOUTUBE_MARGIN}px`;

    section.style.height =`${pixels_to_vh(parseInt(iframe.height)+Global.YOUTUBE_MARGIN)}vh`;
    if( content.shadow ) {
        iframe.classList.add('shadow');
    }
    section.appendChild(iframe);
    
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_youtube_tools(section) {

    show_tools('youtube', [
        { title: 'Skugga', func: on_shadow },
        { title: 'Titel', func: on_title }]);

    function on_shadow() {
        let iframe = section.querySelector('iframe');
        if( iframe.classList.contains('shadow')) {
            iframe.classList.remove('shadow');
        }
        else {
            iframe.classList.add('shadow');
        }
    }
    function on_title() {
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
        shadow: iframe.classList.contains('shadow') });
}

function extract_youtube_track(url) {
    let words = url.split('/');
    if (words && words.length > 0)
        return words[words.length - 1];
    else
        return url;
}
