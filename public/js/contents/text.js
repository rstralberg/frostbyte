

function create_new_text() {

    const aligns = [
        { value: 'left', text: Trans.tag('left') },
        { value: 'center', text: Trans.tag('center') },
        { value: 'right', text: Trans.tag('right') }
    ];

    create_form('text-create', {
        title: Trans.tag('create-text'),
        action: Trans.tag('create') }, [
        {
            type: FormType.TextArea,
            name: 'text',
            label: 'Text',
            rows: 10,
            cols: 80
        },
        {
            type: FormType.List,
            name: 'align',
            label: Trans.tag('position'),
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
                    [sql(Page.id),
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

    show_tools(Trans.tag('text'), [
        { title: Trans.tag('bold'), func: on_bold },
        { title: Trans.tag('italic'), func: on_italic },
        { title: Trans.tag('underline'), func: on_underline },
        { title: Trans.tag('large'), func: on_h1 },
        { title: Trans.tag('small'), func: on_h3 },
        { title: Trans.tag('mark'), func: on_mark },
        { title: Trans.tag('normal'), func: on_normal },
        { title: Trans.tag('link'), func: on_link },
        { title: Trans.tag('left'), func: on_left },
        { title: Trans.tag('center'), func: on_center },
        { title: Trans.tag('right'), func: on_right }]);

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

                create_form( 'text-link', { 
                    title: Trans.tag('link'), 
                    action: Trans.tag('save') }, [
                    {
                        type: FormType.Text,
                        name: 'text',
                        label: Trans.tag('text'),
                        value: text.textContent,
                        readonly: true
                    },
                    {
                        type: FormType.Text,
                        name: 'link',
                        label: Trans.tag('link'),
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
    section.contentEditable = User.valid ;
}

function leaving_text(section) {
    section.contentEditable = false;
    leaving_section(section, {
        align: section.style.textAlign,
        text: encodeURIComponent(section.innerHTML)});
}


function insert_text(section, content ) {
    let div = document.createElement('div');
    div.style.textAlign = content.align;
    div.innerHTML = decodeURIComponent(content.text);
    div.addEventListener('mouseup', (e) => {
        mark_section_selected(div);
    });   
    section.appendChild(div);
}