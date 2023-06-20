

function create_spacer() {

    var content = {
    };

    sql_insert('section',
        ['page_id', 'type', 'height', 'pos', 'content'],
        [sql(Global.page.id),
        sql('spacer'),
        sql(DEFAULT_HEIGHT),
        sql(document.querySelector('main').childElementCount),
        sql(JSON.stringify(content))])
        .then(
            (id) => {
                let container = document.querySelector('main');
                let section = document.createElement('section');

                section.style.height = `${DEFAULT_HEIGHT}vh`;
                section.classList.add('section-edit');
                section.setAttribute('data-type', 'spacer');
                section.setAttribute('data-page-id', Global.page.id);
                section.contentEditable = false;
                create_section_id(section, id);
                container.appendChild(section);

                draw_spacer(section, content);
            }
        );
}


function draw_spacer(section, content) {
    section.contentEditable = false;
    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_spacer_tools(section) {
    show_tools('spacer', []);
}

function delete_spacer(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
        .then(
            () => {
                document.querySelector('main').removeChild(section);
                update_sections_pos_and_height();
            }
        );
}

function entering_spacer(section) {
    show_spacer_tools(section);
    section.contentEditable = false;
}

function leaving_spacer(section) {
    section.contentEditable = false;
    leaving_section(section, {});
}


