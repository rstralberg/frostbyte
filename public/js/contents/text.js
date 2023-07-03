

function create_new_text() {

    const aligns = [
        { value: 'left', text: 'Vänster' },
        { value: 'center', text: 'Mitten' },
        { value: 'right', text: 'Höger' }
    ];

    create_form('text-create', {title: 'Skapa Text', action:'Klar' }, [
        {
            type: FormType.Text,
            name: 'text',
            label: 'Kort text',
            value: 'Du kan skriva mer sedan ...'
        },
        {
            type: FormType.List,
            name: 'align',
            label: 'Postion',
            items: aligns,
            selected: 'left'
        }]).then(
            (result) => {

                var content = {
                    align: result.get('align'),
                    text: encodeURIComponent(result.get('text'))
                };

                sql_insert('section',
                    ['page_id', 'type', 'height', 'pos', 'content'],
                    [sql(Global.page.id),
                    sql('text'),
                    sql(12),
                    sql(document.querySelector('main').childElementCount),
                    sql(JSON.stringify(content))])
                    .then(
                        (id) => {
                            let container = document.querySelector('main');
                            let section = document.createElement('section');
                            
                            section.contentEditable = true;
                            create_section_id(section,id);
                            container.appendChild(section);
                            
                            draw_text(section, content);
                        }
                    );
            });
}

function draw_text(section, content) {
    section.style.textAlign = content.align;
    section.innerHTML = decodeURIComponent(content.text);
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_text_tools(section) {

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
    function on_normal() { section.innerHTML = section.innerText; }
    function on_link() {
        let selection = window.getSelection();
        if (selection.rangeCount) {
            var range = selection.getRangeAt(0);
            var text = range.extractContents();
            if (text.textContent.length > 0) {

                create_form( 'text-link', { title:'Länk', action:'Spara' }, [
                    {
                        type: FormType.Text,
                        name: 'text',
                        label: 'text',
                        value: text.textContent,
                        readonly: true
                    },
                    {
                        type: FormType.Text,
                        name: 'link',
                        label: 'Länk',
                        value: 'https://'
                    }
                ]).then(
                    function (resolve) {
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
        section.style.textAlign = 'left';
    }
    function on_center() {
        section.style.textAlign = 'center';
    }
    function on_right() {
        section.style.textAlign = 'right';
    }
}

function delete_text(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
    .then( 
        () => {
            document.querySelector('main').removeChild(section);
        }
    );
}

function entering_text(section) {
    show_text_tools(section);
    section.contentEditable = Global.user.valid ? 'true' : 'false';
}

function leaving_text(section) {
    section.contentEditable = false;
    leaving_section(section, {
        align: section.style.textAlign,
        text: encodeURIComponent(section.innerHTML)});
}
