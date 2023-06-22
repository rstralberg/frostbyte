

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
                    url : encodeURIComponent( extract_youtube_track(result['url']) ),
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

    let iframe = document.createElement('iframe');
    iframe.setAttribute('width','560');
    iframe.setAttribute('height','315');
    iframe.setAttribute('src',`https://www.youtube.com/embed/${decodeURIComponent(content.url)}`);
    iframe.setAttribute('title','YouTube video player');
    iframe.setAttribute('frameborder','0');
    iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen','true');
    iframe.style.margin = '16px';
    section.appendChild(iframe);
    section.style.height = `${pixels_to_vh(315+32)}vh`

    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_youtube_tools(section) {

    show_tools('YouTube', [
        { title: 'Skugga', func: on_shadow },
        { title: 'Titel', func: on_title },
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

