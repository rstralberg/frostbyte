
const SectionType = {

    audio: 'audio',
    picture: 'picture',
    soundcloud: 'soundcloud',
    spacer: 'spacer',
    spotify: 'spotify',
    text: 'text',
    youtube: 'youtube',
    textimage: 'textimage',
    imagetext: 'imagetext'
};

function create_section() {

    const types = [
        { value: SectionType.text, text: 'Text' },
        { value: SectionType.picture, text: 'Bild' },
        { value: SectionType.imagetext, text: 'Bild & Text' },
        { value: SectionType.spacer, text: 'Tomrum' },
        { value: SectionType.audio, text: 'Ljud' },
        { value: SectionType.soundcloud, text: 'SoundCloud' },
        { value: SectionType.spotify, text: 'Spotify' },
        { value: SectionType.youtube, text: 'YouTube' },
    ];
    create_form('section-create', { title: 'Skapa avsnitt', action: 'Skapa' }, [
        {
            type: FormType.List,
            label: 'Typ av avsnitt',
            name: 'type',
            items: types,
            selected: SectionType.text
        }
    ]).then(
        (result) => {
            let func = window[`create_${result['type']}`];
            if (func) {
                func();
            }
        });
}

function delete_section() {
    if (is_valid(Global.selected)) {
        let func = window[`delete_${Global.selected.getAttribute('data-type')}`];
        if (func) {
            func(Global.selected);
            Global.selected = null;
        }
    }

}
function mark_section_selected(section) {
    if (Global.user.valid && is_valid(section )) {

        if( is_valid(Global.selected) && !is_same_section(Global.selected,section) ) {
            let func = window[`leaving_${Global.selected.getAttribute('data-type')}`];
            if (is_valid(func)) {
                console.log(`Leaving ${Global.selected.id}`);
                func(Global.selected);
           }
        }

        Global.selected = section;
        section.classList.add('section-edit');
        let func = window[`entering_${section.getAttribute('data-type')}`];
        if (is_valid(func)) {
            console.log(`Entering ${section.id}`);
            func(section);
        }
    }
}

function leaving_section(cursection, content) {
    
    let container = document.querySelector('main');

    for (let i = 0; i < container.childElementCount; i++) {
        
        let section = container.children[i];
        if( section.classList.contains('section-edit')) {
            section.classList.remove('section-edit');
        }
        
        if (is_same_section(cursection, section)) {
            sql_update('section', ['pos', 'height', 'content'],
            [   sql(i),
                get_height_as_vh(cursection),   
                sql(JSON.stringify(content))],
            `id=${parse_section_id(cursection)}`);
        }
        else {
            sql_update('section', ['pos', 'height'],
                [sql(i),
                sql(get_height_as_vh(section))],
                `id=${parse_section_id(section)}`);
        }
    }
}

function load_page_sections(id) {

    sql_select('section', ['*'], `page_id=${id}`, '`pos` asc').then(
        (sections) => {
            if (sections.length === 0) {
                logg(`Sidan med id=${id} hade inga avsnitt`);
            }
            else {
                var container = document.querySelector('main');
                remove_childs(container);

                sections.forEach(sec => {
                    let id = parseInt(sec.id);
                    let type = sec.type;
                    let func = window[`draw_${type}`];
                    if (is_valid(func)) {
                        let secdiv = document.createElement('section');
                        secdiv.id = `s-${id}`;
                        secdiv.style.height = `${sec.height}vh`;
                        secdiv.setAttribute('data-type', type);
                        secdiv.setAttribute('data-page-id', sec.page_id);
                        container.appendChild(secdiv);
                        func(secdiv, JSON.parse(sec.content));
                    }
                });
            }
        });
}

function parse_section_id(section) {
    return parseInt(section.id.slice('s-'.length));
}

function create_section_id( id) {
    return `s-${id}`;
}

function is_same_section(s1, s2) {
    if (!is_valid(s1)) return false;
    if (!is_valid(s2)) return false;
    return s1.id === s2.id;
}