
class Section {

    static FORM_SECTION_CREATE = 'section-create';

    static Type = {
        none: 'none',
        audio: 'audio',
        picture: 'picture',
        soundcloud: 'soundcloud',
        spotify: 'spotify',
        text: 'text',
        youtube: 'youtube',
        textimage: 'textimage',
        imagetext: 'imagetext',
        blog: 'blog'
    };

    #_id = 0;
    #_page_id = 0;
    #_type = '';
    #_height = '';
    #_pos = 0;
    #_content = '';
    #_selected = null;

    set id(v) { this.#_id = v; }
    set page_id(v) { this.#_page_id = v; }
    set type(v) { this.#_type = v; }
    set height(v) { this.#_height = v; }
    set pos(v) { this.#_pos = v; }
    set content(v) { this.#_content = v; }
    set selected(v) { this.#_selected = v; }


    get id() { return this.#_id; }
    get page_id() { return this.#_page_id; }
    get type() { return this.#_type; }
    get height() { return this.#_height; }
    get pos() { return this.#_pos; }
    get content() { return this.#_content; }
    get selected() { return this.#_selected; }

    set section(v) {
        this.id = v.id;
        this.page_id = v.page_id;
        this.type = v.type;
        this.height = v.height;
        this.pos = v.pos;
        this.content = v.content;
    }

    get section() {
        return {
            id: this.id,
            page_id: this.page_id,
            type: this.type,
            height: this.height,
            pos: this.pos,
            content: this.content,
        };
    }

    sql_to_section(sql) {
        return {
            id: parseInt(sql.id),
            page_id: parseInt(sql.page_id),
            type: sql.type,
            height: sql.height,
            pos: parseInt(sql.pos),
            content: JSON.parse(decodeURIComponent(sql.content)),
        };
    }

    section_to_sql(sec) {
        return {
            id: sec.id,
            page_id: sec.page_id,
            type: sec.type,
            height: sec.height,
            pos: sec.pos,
            content: JSON.stringify(encodeURIComponent(sec.content)),
        };
    }
}


function create_section() {

    const types = [
        { value: Section.Type.none, text: Trans.tag('select') },
        { value: Section.Type.blog, text: Trans.tag('blog-post') },
        { value: Section.Type.text, text: Trans.tag('text') },
        { value: Section.Type.picture, text: Trans.tag('image') },
        { value: Section.Type.imagetext, text: Trans.tag('image-and-text') },
        { value: Section.Type.audio, text: Trans.tag('sound') },
        { value: Section.Type.soundcloud, text: 'SoundCloud' },
        { value: Section.Type.spotify, text: 'Spotify' },
        { value: Section.Type.youtube, text: 'YouTube' },
    ];
    create_form(Section.FORM_SECTION_CREATE, {
        title: Trans.tag('create-section')
    }, [
        {
            type: FormType.List,
            label: Trans.tag('type-of-section'),
            name: 'type',
            items: types,
            selected: Section.Type.none,
            listener: on_selected
        }
    ]);

    function on_selected(e) {
        if (e.value !== 'none') {
            let func = window[`create_new_${e.value}`];
            close_form(Section.FORM_SECTION_CREATE);
            if (func) {
                func();
            }
        }
    }
}

function delete_section() {
    if (is_valid(Section.selected)) {
        let func = window[`delete_${Section.selected.getAttribute('data-type')}`];
        if (func) {
            func(Section.selected);
            Section.selected = null;
        }
    }

}
function mark_section_selected(section) {
    if (User.valid && is_valid(section)) {

        if (is_valid(Section.selected) && !is_same_section(Section.selected, section)) {
            let func = window[`leaving_${Section.selected.getAttribute('data-type')}`];
            if (is_valid(func)) {
                func(Section.selected);
            }
        }

        Section.selected = section;
        section.classList.add('section-edit');
        let func = window[`entering_${section.getAttribute('data-type')}`];
        if (is_valid(func)) {
            func(section);
        }
    }
}

function leaving_section(cursection, content) {

    let container = document.querySelector('main');

    for (let i = 0; i < container.childElementCount; i++) {

        let section = container.children[i];
        if (section.classList.contains('section-edit')) {
            section.classList.remove('section-edit');
        }

        if (is_same_section(cursection, section)) {
            sql_update('section', ['pos', 'height', 'content'],
                [sql(i),
                sql(get_height_as_vh(cursection)),
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
                        secdiv.style.height = sec.height;
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

function create_section_id(id) {
    return `s-${id}`;
}

function is_same_section(s1, s2) {
    if (!is_valid(s1)) return false;
    if (!is_valid(s2)) return false;
    return s1.id === s2.id;
}