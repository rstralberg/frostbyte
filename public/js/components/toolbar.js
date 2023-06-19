

function load_toolbar() {

    let container = document.querySelector('.left');
    var toolbar = document.createElement('div');
    toolbar.classList.add('vert-menu');
    toolbar.id = 'toolbar';
    toolbar.style.display = 'none';
    toolbar.style.fontSize = '0.9em';


    let fieldset = document.createElement('fieldset');

    toolbar.appendChild(fieldset);
    tb_add(fieldset, '#ffff00', 'Stäng', () => {
        toolbar.element.style.display = 'none';
    });

    // // Spara aktuell sektion
    // // ------------------
    // tb_add(fieldset, '#00ff00', 'Spara', () => {
    //     // let func = window[`save_${info.type}`];
    //     // if (is_valid(func)) {
    //     //     func();
    //     // }
    // });

    // Bara om du är författare eller power-user
    // ------------------
    if (Global.page.author === Global.user.username || Global.user.power) {

        // Bara om du är power-user
        // ------------------
        if (Global.user.power) {
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
            tb_add(fieldset, '#ffc0c0', 'Tema', edit_theme);
        }

        let fieldset = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.innerText = 'Sidor';
        fieldset.appendChild(legend);
        toolbar.appendChild(fieldset);

        // Bara om du är power-user
        // ------------------
        if (Global.user.power) {

            // Skapa ny sida
            // ------------------
            tb_add(fieldset, '#c0ffc0', 'Ny', create_page);

            // Radera aktuell sida
            // ------------------
            tb_add(fieldset, '#c0ffc0', 'Radera', delete_page);

        }

        // Döp om aktuell sida
        // ------------------
        tb_add(fieldset, '#c0ffc0', 'Namge', rename_page);
    }

    // Bara om du är författare eller power-user
    // -----------------------
    if (Global.page.author === Global.user.username || Global.user.power) {

        let fieldset = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.innerText = 'Sektion';
        fieldset.appendChild(legend);
        toolbar.appendChild(fieldset);

        // Ny sektion
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Ny', create_section);

        // Radera aktuell sektion
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Radera', () => {
            delete_section(Global.selected);
        });

        // Flytta sektionen uppåt
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Upp', () => {
            let section = Global.selected;
            if (is_valid(section.previousElementSibling, false)) {
                let prev = section.previousElementSibling;
                prev.parentNode.insertBefore(section, prev);
            }
            section.focus();
        });

        // Flytta sektionen nedåt
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Ned', () => {
            let section = Global.selected;;
            if (is_valid(section.nextElementSibling, false)) {
                let next = section.nextElementSibling;
                next.parentNode.insertBefore(section, next.nextSibling);
            }
            section.focus();
        });

        // Öka sektiones storlek
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Större', () => {
            let section = Global.selected;
            section.style.height = `${section.clientHeight + 10}px`;
            let func = window[`on_${section.getAttribute('data-type')}_resize`];
            if (is_valid(func)) {
                func(section);
            }
            section.focus();
        });

        // Minska sektiones storlek
        // -----------------------
        tb_add(fieldset, '#c0c0ff', 'Mindre', () => {
            let section = Global.selected;
            if (section.clientHeight > 32) {
                section.style.height = `${section.clientHeight - 10}px`;
                let func = window[`on_${section.getAttribute('data-type')}_resize`];
                if (is_valid(func)) {
                    func(section);
                }
            }
            section.focus();
        });
    }
    container.appendChild(toolbar);
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

    if (Global.user.valid) {
        let toolbar = document.getElementById('toolbar');
        toolbar.style.display = 'grid';

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

