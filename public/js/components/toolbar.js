

function load_toolbar() {

    let container = document.querySelector('.left');
    var toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');
    toolbar.id = 'toolbar';
    toolbar.style.display = 'none';
    toolbar.style.fontSize = '0.9em';


    // Bara om du är författare eller power-user
    // ------------------
    if (Page.author === User.username || User.power) {

        // Bara om du är power-user
        // ------------------
        if (User.power) {
            let fieldset = document.createElement('fieldset');
            let legend = document.createElement('legend');

            legend.innerText = 'System';
            fieldset.appendChild(legend);
            toolbar.appendChild(fieldset);

            // Redigera inställningar
            // ------------------
            tb_add(fieldset, '#ffc0c0', 'Inställningar', edit_config);

            // Redigera användare
            // ------------------
            tb_add(fieldset, '#ffc0c0', 'Användare', edit_users);

            // Redigera tema
            // ------------------
            tb_add(fieldset, '#ffc0c0', 'Teman', edit_themes);

            // Redigera sidornas ordning
            // ----------------------------
            tb_add(fieldset, '#ffc0c0', 'Sidor', page_editor);
        }
    }

    // Bara om du är författare eller power-user
    // -----------------------
    if (Page.author === User.username || User.power) {


        let fieldset = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.innerText = 'Sida';
        fieldset.appendChild(legend);
        toolbar.appendChild(fieldset);

        // Döp om
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Ändra Titel', rename_page);

        // Visa titel
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Visa titel', show_page_title );

        // Spara
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Spara', save_page);

        fieldset = document.createElement('fieldset');
        legend = document.createElement('legend');
        legend.innerText = 'Avsnitt';
        fieldset.appendChild(legend);
        toolbar.appendChild(fieldset);

        // Ny sektion
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Nytt', create_section);

        // Radera aktuell sektion
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Radera', () => {
            if (is_valid(Section.selected)) {
                delete_section(Section.selected);
            }
        });

        // Flytta sektionen uppåt
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Upp', () => {
            let section = Section.selected;
            if (is_valid(section)) {
                if (is_valid(section.previousElementSibling, false)) {
                    let prev = section.previousElementSibling;
                    prev.parentNode.insertBefore(section, prev);
                }
                section.focus();
            }
        });

        // Flytta sektionen nedåt
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Ned', () => {
            let section = Section.selected;
            if (is_valid(section)) {
                if (is_valid(section.nextElementSibling, false)) {
                    let next = section.nextElementSibling;
                    next.parentNode.insertBefore(section, next.nextSibling);
                }
                section.focus();
            }
        });

        // Öka sektiones storlek
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Större', () => {
            let section = Section.selected;
            if (is_valid(section)) {

                let h = vh_to_pixels(parseInt(section.style.height)) + 10;
                section.style.height = pixels_to_vh(h);
                let func = window[`on_${section.getAttribute('data-type')}_resize`];
                if (is_valid(func)) {
                    func(section);
                }
                section.focus();

            }
        });

        // Minska sektiones storlek
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Mindre', () => {
            let section = Section.selected;
            if (is_valid(section)) {
                if (section.clientHeight > 32) {
                    
                    let h = vh_to_pixels(parseInt(section.style.height)) - 10;
                    section.style.height = pixels_to_vh(h);
                    
                    let func = window[`on_${section.getAttribute('data-type')}_resize`];
                    if (is_valid(func)) {
                        func(section);
                    }

                }
                section.focus();
            }
        });

        // Anpassad höjd
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Anpassa höjd', () => {
            let section = Section.selected;
            if (is_valid(section)) {
                section.style.height = 'auto';
                sql_update('section', ['height'], [sql('auto')], 'id=' + parse_section_id(section));
            }
        });

        function save_page() {
            sql_update('page',
                ['title', 'pos', 'showtitle', 'host'],
                [sql(encodeURIComponent(Page.title)),
                sql(Page.pos),
                sql(Page.showtitle ? 1 : 0),
                sql(Page.host)],
                'id=' + Page.id).then(() => {
                    let main = document.querySelector('main');
                    for (let i = 0; i < main.childElementCount; i++) {
                        let section = main.children[i];
                        let type = section.getAttribute('data-type');
                        let func = window['leaving_' + type];
                        if (is_valid(func)) {
                            console.log( 'leaving_' + type);
                            func(section);
                        }
                    }
                },
                    () => { });
        }

        function show_page_title() {
            Page.showtitle = !Page.showtitle;
            sql_update('page', ['showtitle'], [sql(Page.showtitle)], 'id=' + Page.id);
            let titlediv = document.getElementById('page-title');
            titlediv.style.display = Page.showtitle ? 'block' : 'none';
        }
    }
    container.appendChild(toolbar);
    if (User.valid) {
        let toolbar = document.getElementById('toolbar');
        toolbar.style.display = 'grid';
    }
}

function tb_add(container, color, text, func) {

    let item = document.createElement('a');
    item.classList.add('tools');
    item.innerText = text;
    item.href = '#'
    item.style.color = color;

    item.addEventListener('mousedown', (e) => {
        func(e.target.id);
    });
    container.appendChild(item);
}

function show_tools(title, tools) {

    if (User.valid) {
        let toolbar = document.getElementById('toolbar');

        let fieldset = document.getElementById('added-tools');
        if (is_valid(fieldset)) {
            toolbar.removeChild(fieldset);
        }

        fieldset = document.createElement('fieldset');
        fieldset.id = 'added-tools';
        let legend = document.createElement('legend');
        legend.innerText = title;
        fieldset.appendChild(legend);

        tools.forEach(tool => {
            tb_add(fieldset, '#ffc0ff', tool.title, tool.func);
        });

        toolbar.appendChild(fieldset);
    }
}

