
const T_EDITOR = 'theme-editor';
const THEME_OPS = { name: 'style', value: 'display:grid;grid-template-columns:1fr 2fr' };

function theme_editor() {

    // Enable drag around support
    var mousePosition;
    var offset = [0, 0];
    var isDown = false;

    let editor = document.createElement('div');
    editor.id = T_EDITOR;
    safe_add_class(editor, 'itheme-edit');
    safe_add_class(editor, 'shadow');

    editor.addEventListener('mousedown', (ev) => {
        isDown = true;
        offset = [
            editor.offsetLeft - ev.clientX,
            editor.offsetTop - ev.clientY
        ];
    }, true);
    editor.addEventListener('mouseup', (ev) => {
        isDown = false;
    }, true);
    editor.addEventListener('mousemove', (ev) => {
        ev.preventDefault();
        if (isDown) {
            mousePosition = {
                x: ev.clientX,
                y: ev.clientY
            };
            editor.style.left = (mousePosition.x + offset[0]) + 'px';
            editor.style.top = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);

    editor.appendChild(theme_selector());
    editor.appendChild(theme_style_selector());

    let anchor = document.getElementById('main-modal');
    anchor.appendChild(editor);
    anchor.style.display = 'flex';


    let controls = document.createElement('div');
    controls.style.display = 'block';
    controls.style.width = '60vw';
    controls.style.display = 'flex';
    controls.id = 'theme-controls';
    editor.append(controls);


    theme_app();
    editor.append(theme_internal_buttons());


    function theme_selector() {

        let div = document.createElement('div');
        div.style.display = 'grid';
        div.style.gridTemplateColumns = '120px 200px'
        div.style.textAlign = 'left';

        let label = document.createElement('label');
        safe_add_class(label, 'ilabel');
        // safe_add_class(label, 'fixed-width-100');
        label.innerHTML = Lexer.THEME;
        label.for = 'theme-selector';
        div.appendChild(label);

        // load a theme
        let select = document.createElement('select');
        safe_add_class(select, 'iselect');
        // safe_add_class(select, 'fixed-width-200');

        select.name = 'theme-selector';
        select.setAttribute('size', 1);
        select.addEventListener('change', (e) => {
            request('load_theme', [{ key: 'theme-name', value: select.options[select.selectedIndex].value }],
                (response) => {
                    // TODO! Apply load theme
                });
        });

        // get avaible themes
        let theme_names = sql_select('select name from theme');
        for (let i = 0; i < theme_names.length; i++) {
            let v = theme_names[i];
            let option = document.createElement('option');
            safe_add_class(option, 'ioption');
            option.setAttribute('value', v.name);
            option.innerText = ' ' + v.name + ' ';
            select.appendChild(option);
        }
        div.appendChild(select);

        return div;
    }

    function theme_style_selector() {

        let div = document.createElement('div');
        div.style.display = 'grid';
        div.style.gridTemplateColumns = '120px 200px'
        div.style.textAlign = 'left';

        let label = document.createElement('div');
        safe_add_class(label, 'ilabel');
        label.innerHTML = Lexer.COMPONENT;
        label.for = 'theme-selector';
        div.appendChild(label);

        let select = document.createElement('select');
        safe_add_class(select, 'iselect');
        select.setAttribute('size', 1);

        // actually the func parameter isn't use or needed but
        // this was a way to ger rid of complaint about them not beeing used
        const editfuncs = [
            { type: 'app', desc: Lexer.T_APP },
            { type: 'top', desc: Lexer.T_TOP },
            { type: 'nav', desc: Lexer.T_BAR },
            { type: 'page', desc: Lexer.T_MAIN },
            { type: 'footer', desc: Lexer.T_FOOTER },
            { type: 'buttons', desc: Lexer.T_BTN },
            { type: 'links', desc: Lexer.T_LINKS },
            { type: 'headers', desc: Lexer.T_HEADER },
            { type: 'input', desc: Lexer.T_INP },
            { type: 'blocks', desc: Lexer.T_SECTIONS },
            { type: 'quote', desc: Lexer.T_QUOTE },
            { type: 'code', desc: Lexer.T_CODE },
        ];

        div.appendChild(select);
        select.setAttribute('name', 'theme-selector');
        for (let i = 0; i < editfuncs.length; i++) {
            let v = editfuncs[i];

            let option = document.createElement('option');
            safe_add_class(option, 'ioption');
            option.setAttribute('value', v.type);
            option.innerText = ' ' + v.desc + ' ';
            select.appendChild(option);
        }

        select.addEventListener('change', (e) => {
            let func = window['theme_' + select.options[select.selectedIndex].value];
            if (func) {
                func();
            }
        });
        return div;
    }

    function theme_app() {

        let div = document.getElementById('theme-controls');
        remove_childs(div);

        let curfont = get_style('font-app');
        let fonts = new Array();
        for (let i = 0; i < window.ed_fonts.length; i++) {
            let fontname = window.ed_fonts[i].slice(0, -'.ttf'.length);
            if(fontname == curfont ) {
                fontname = '*' + fontname;
            }
            fonts.push(fontname);
        }


        // font-family:var(--font-app);
        // font-size:var(--fsize-app);
        // width:var(--width-app);
        // background:var(--bg-app);
        // color:var(--fg-app);

        div.appendChild(iformchild([
            new iParam('bg-app', 'color', Lexer.BACKGROUND, get_style('bg-app'), [THEME_OPS], set_style),
            new iParam('fg-app', 'color', Lexer.TEXT, get_style('fg-app'), [THEME_OPS], set_style),
            new iParam('font-app', 'select', Lexer.FONT, fonts, [THEME_OPS], set_string_style),
            new iParam('fsize-app', 'float', Lexer.FONT, get_float_style('fsize-app'), [THEME_OPS], set_em_style),
            new iParam('width-app', 'number', Lexer.APP + ' ' + Lexer.WIDTH, get_int_style('width-app'), [THEME_OPS], set_vw_style),
            new iParam('height-top', 'number', Lexer.TOP + ' ' + Lexer.HEIGHT, get_int_style('height-top'), [THEME_OPS], set_vh_style),
            new iParam('height-footer', 'number', Lexer.FOOTER + ' ' + Lexer.HEIGHT, get_int_style('height-footer'), [THEME_OPS], set_vh_style)],
            [], null));

    }
}

function theme_top() {

    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-top);
    // border:var(--border-top);
    // border-radius:var(--radius-top);
    // height:var(--height-top);
    // width:var(--width-app);

    div.appendChild(iformchild([
        new iParam('bg-top', 'color', Lexer.BACKGROUND, get_style('bg-top'), [THEME_OPS], set_style),
        new iParam('border-top#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-top'), [THEME_OPS], set_border_color_style),
        new iParam('border-top#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-top'), [THEME_OPS], set_border_size_style),
        new iParam('radius-top', 'number', Lexer.RADIUS, get_int_style('radius-top'), [THEME_OPS], set_px_style)
    ], [], null));
}

function theme_nav() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    div.appendChild(iformchild([
        new iParam('bg-nav', 'color', Lexer.BACKGROUND, get_style('bg-nav'), [THEME_OPS], set_style),
        new iParam('fg-nav', 'color', Lexer.TEXT, get_style('fg-nav'), [THEME_OPS], set_style),
        new iParam('border-nav#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-nav'), [THEME_OPS], set_border_color_style),
        new iParam('border-nav#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-nav'), [THEME_OPS], set_border_size_style),
        new iParam('hi-bg-nav', 'color', Lexer.ACTIVE + ' ' + Lexer.BACKGROUND, get_style('hi-bg-top'), [THEME_OPS], set_style),
        new iParam('hi-fg-nav', 'color', Lexer.ACTIVE + ' ' + Lexer.TEXT, get_style('hi-fg-top'), [THEME_OPS], set_style),
        new iParam('hi-border-nav#1', 'color', Lexer.ACTIVE + Lexer.BORDER_COLOR, get_border_color_style('hi-border-nav'), [THEME_OPS], set_border_color_style),
        new iParam('hi-border-nav#2', 'number', Lexer.ACTIVE + Lexer.BORDER_SIZE, get_border_size_style('hi-border-nav'), [THEME_OPS], set_border_color_style),
        new iParam('radius-nav', 'number', Lexer.RADIUS, get_int_style('radius-top'), [THEME_OPS], set_px_style),
        new iParam('fsize-nav', 'float', Lexer.FONT + ' ' + Lexer.SIZE, get_float_style('fsize-top'), [THEME_OPS], set_em_style),
        new iParam('bold-nav', 'checkbox', Lexer.BOLD, get_style('bold-top') == 'bold', [THEME_OPS], set_bold_style),
    ], [], null));

    // background:var(--bg-nav);
    // color:var(--fg-nav);
    // border:var(--border-nav);
    // border-radius:var(--radius-nav);
    // font-size:var(--fsize-nav);
    // font-weight:var(--bold-nav);
    // background:var(--hi-bg-nav);
    // color:var(--hi-fg-nav);
    // border:var(--hi-border-nav);
    // background:var(--hi-bg-nav);
    // color:var(--hi-fg-nav);
    // border:var(--hi-border-nav);

}

function theme_page() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-page);
    // color:var(--fg-page);
    // border:var(--border-page);
    // border-radius:var(--radius-page);
    // width:var(--width-app);

    div.appendChild(iformchild([
        new iParam('bg-page', 'color', Lexer.BACKGROUND, get_style('bg-nav'), [THEME_OPS], set_style),
        new iParam('fg-page', 'color', Lexer.TEXT, get_style('fg-nav'), [THEME_OPS], set_style),
        new iParam('border-page#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-page'), [THEME_OPS], set_border_color_style),
        new iParam('border-page#1', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-page'), [THEME_OPS], set_border_size_style),
        new iParam('radius-page', 'number', Lexer.RADIUS, parseInt(get_style('radius-top')), [THEME_OPS], set_px_style),
    ], [], null));
}

function theme_footer() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-footer);
    // color:var(--fg-footer);
    // border:var(--border-footer);
    // border-radius:var(--radius-footer);
    // font-weight:var(--bold-footer);
    // font-size:var(--fsize-footer);
    // text-align:var(--align-footer);
    // width:var(--width-app);
    // height:var(--height-footer);

    let align = get_style('align-footer');
    let aligns = ['left', 'center', 'right'];
    for (let i = 0; i < aligns.length; i++) {
        if (aligns[i] == align) {
            aligns[i] = '*' + aligns[i];
        }
    }

    div.appendChild(iformchild([
        new iParam('bg-footer', 'color', Lexer.BACKGROUND, get_style('bg-footer'), [THEME_OPS], set_style),
        new iParam('fg-footer', 'color', Lexer.TEXT, get_style('fg-footer'), [THEME_OPS], set_style),
        new iParam('border-footer#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-footer'), [THEME_OPS], set_border_color_style),
        new iParam('border-footer#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-footer'), [THEME_OPS], set_border_size_style),
        new iParam('radius-footer', 'number', Lexer.RADIUS, get_int_style('radius-footer'), [THEME_OPS], set_px_style),
        new iParam('bold-footer', 'checkbox', Lexer.BOLD, get_style('bold-footer') == 'bold', [THEME_OPS], set_bold_style),
        new iParam('fsize-footer', 'float', Lexer.FONT + ' ' + Lexer.SIZE, get_float_style('fsize-footer'), [THEME_OPS], set_em_style),
        new iParam('align-footer', 'select', Lexer.ALIGN, aligns, [THEME_OPS], on_align),
    ], [], null));

    function on_align(id, value) {

    }
}

function theme_buttons() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-btn);
    // color:var(--fg-btn);
    // background:var(--hi-bg-btn);
    // color:var(--hi-fg-btn);
    // border:var(--border-btn);
    // border:var(--hi-border-btn);
    // border-radius:var(--radius-btn);
    // font-weight:var(--bold-btm);
    // font-size:var(--fsize-btn);

    div.appendChild(iformchild([
        new iParam('bg-btn', 'color', Lexer.BACKGROUND, get_style('bg-btn'), [THEME_OPS], set_style),
        new iParam('fg-btn', 'color', Lexer.TEXT, get_style('fg-btn'), [THEME_OPS], set_style),
        new iParam('hi-bg-btn', 'color', Lexer.ACTIVE + ' ' + Lexer.BACKGROUND, get_style('hi-bg-btn'), [THEME_OPS], set_style),
        new iParam('hi fg-btn', 'color', Lexer.ACTIVE + ' ' + Lexer.TEXT, get_style('hi-fg-btn'), [THEME_OPS], set_style),
        new iParam('border-btn#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-btn'), [THEME_OPS], set_border_color_style),
        new iParam('border-btn#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-btn'), [THEME_OPS], set_border_size_style),
        new iParam('hi-border-btn', 'color', Lexer.ACTIVE + ' ' + Lexer.BORDER_COLOR, get_border_color_style('hi-border-btn'), [THEME_OPS], set_border_color_style),
        new iParam('hi-border-btn', 'number', Lexer.ACTIVE + ' ' + Lexer.BORDER_SIZE, get_border_color_style('hi-border-btn'), [THEME_OPS], set_border_size_style),
        new iParam('radius-btn', 'number', Lexer.RADIUS, get_int_style('radius-btn'), [THEME_OPS], set_px_style),
        new iParam('bold-btn', 'checkbox', Lexer.BOLD, get_style('fsize-footer') == 'bold', [THEME_OPS], set_bold_style),
        new iParam('fsize-btn', 'float', Lexer.FONT + ' ' + Lexer.SIZE, get_float_style('fsize-btn'), [THEME_OPS], set_em_style),
    ], [], null));

}

function theme_links() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // color:var(--fg-link);
    // font-weight:var(--bold-link);

    div.appendChild(iformchild([
        new iParam('fg-link', 'color', Lexer.LINK + ' ' + Lexer.COLOR, get_style('fg-link'), [THEME_OPS], set_style),
        new iParam('bold-link', 'checkbox', Lexer.BOLD, get_style('bold-link') == 'bold', [THEME_OPS], set_bold_style),
    ], [], null));
}

function theme_headers() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    let title_aligns = new Array('left', 'center', 'right');
    let title_align = get_style('align-title');
    for (let i = 0; i < title_aligns.length; i++) {
        if (title_aligns[i] == title_align) {
            title_aligns[i] = '*' + title_aligns[i];
        }
    }

    let h_aligns = new Array('left', 'center', 'right');
    let h_align = get_style('align-h');
    for (let i = 0; i < h_aligns.length; i++) {
        if (h_aligns[i] == h_align) {
            h_aligns[i] = '*' + h_aligns[i];
        }
    }



    // color:var(--fg-title);
    // font-size:var(--fsize-title);
    // font-weight:var(--bold-title);
    // text-align:var(--align-title);
    // color:var(--fg-h);
    // font-weight:var(--bold-h);
    // text-align:var(--align-h);[
    // font-size:var(--fsize-h1);
    // font-size:var(--fsize-h2);
    // font-size:var(--fsize-h3);

    div.appendChild(iformchild([
        new iParam('fg-title', 'color', Lexer.TITLE + ' ' + Lexer.TEXT, get_style('fg-title'), [THEME_OPS], set_style),
        new iParam('fsize-title', 'float', Lexer.TITLE + ' ' + Lexer.SIZE, parseFloat(get_style('fsize-title')), [THEME_OPS], set_em_style),
        new iParam('bold-title', 'checkbox', Lexer.TITLE + ' ' + Lexer.BOLD, get_style('bold-title'), [THEME_OPS], set_bold_style),
        new iParam('align-title', 'select', Lexer.TEXT + ' ' + Lexer.ALIGN, title_aligns, [THEME_OPS], on_align_title),
        new iParam('fg-h', 'color', Lexer.HEADER + ' ' + Lexer.TEXT, get_style('fg-h'), [THEME_OPS], set_style),
        new iParam('bold-h', 'checkbox', Lexer.HEADER + ' ' + Lexer.BOLD, get_style('bold-h'), [THEME_OPS], set_bold_style),
        new iParam('align-h', 'select', Lexer.HEADER + ' ' + Lexer.ALIGN, h_aligns, [THEME_OPS], on_align_h),
        new iParam('fsize-h1', 'float', Lexer.HEADER + '-1 ' + Lexer.SIZE, parseFloat(get_style('fsize-h1')), [THEME_OPS], set_em_style),
        new iParam('fsize-h2', 'float', Lexer.HEADER + '-2 ' + Lexer.SIZE, parseFloat(get_style('fsize-h2')), [THEME_OPS], set_em_style),
        new iParam('fsize-h3', 'float', Lexer.HEADER + '-3 ' + Lexer.SIZE, parseFloat(get_style('fsize-h3')), [THEME_OPS], set_em_style),
    ], [], null));

    function on_align_title(id, value) {

    }

    function on_align_h(id, value) {

    }
}

function theme_input() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-inp);
    // color:var(--fg-inp);
    // background:var(--hi-bg-inp);
    // color:var(--hi-fg-inp);
    // border:var(--border-inp);
    // border-radius:var(--radius-inp);
    // font-size:var(--fsize-inp);

    div.appendChild(iformchild([
        new iParam('bg-inp', 'color', Lexer.BACKGROUND, get_style('bg-inp'), [THEME_OPS], set_style),
        new iParam('fg-inp', 'color', Lexer.TEXT, get_style('fg-inp'), [THEME_OPS], set_style),
        new iParam('hi-bg-inp', 'color', Lexer.ACTIVE + ' ' + Lexer.BACKGROUND, get_style('hi-bg-inp'), [THEME_OPS], set_style),
        new iParam('hi-fg-inp', 'color', Lexer.ACTIVE + ' ' + Lexer.TEXT, get_style('hi-fg-inp'), [THEME_OPS], set_style),
        new iParam('border_inp#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-inp'), [THEME_OPS], set_border_color_style),
        new iParam('border_inp#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-inp'), [THEME_OPS], set_border_size_style),
        new iParam('radius-inp', 'number', Lexer.RADIUS, parseInt(get_style('radius-inp')), [THEME_OPS], set_px_style),
        new iParam('fsize-inp', 'float', Lexer.FONT + ' ' + Lexer.SIZE, parseFloat(get_style('fsize-inp')), [THEME_OPS], set_em_style),
    ], [], null));
}

function theme_blocks() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-block);
    // color:var(--fg-block);
    // border:var(--border-block);
    // border-radius:var(--radius-block);
    // font-size:var(--fsize-block);

    div.appendChild(iformchild([
        new iParam('bg-block', 'color', Lexer.BACKGROUND, get_style('bg-block'), [THEME_OPS], set_style),
        new iParam('fg-block', 'color', Lexer.TEXT, get_style('fg-block'), [THEME_OPS], set_style),
        new iParam('border_block#1', 'color', Lexer.BORDER_COLOR, get_border_color_style('border-block'), [THEME_OPS], set_border_color_style),
        new iParam('border_block#2', 'number', Lexer.BORDER_SIZE, get_border_size_style('border-block'), [THEME_OPS], set_border_size_style),
        new iParam('radius-block', 'number', Lexer.RADIUS, parseInt(get_style('radius-block')), [THEME_OPS], set_px_style),
        new iParam('fsize-block', 'float', Lexer.FONT + ' ' + Lexer.SIZE, parseFloat(get_style('fsize-block')), [THEME_OPS], set_em_style),
    ], [], null));

}

function theme_quote() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    // background:var(--bg-quote);
    // color:var(--fg-quote);
    // font-style:var(--fstyle-quote);


    div.appendChild(iformchild([
        new iParam('bg-quote', 'color', Lexer.BACKGROUND, get_style('bg-quote'), [THEME_OPS], set_style),
        new iParam('fg-quote', 'color', Lexer.TEXT, get_style('fg-quote'), [THEME_OPS], set_style),
        new iParam('fstyle-quote', 'checkbox', Lexer.ITALIC, get_italic_style('fstyle-quote'), [THEME_OPS], set_italic_style),
    ], [], null));
}

function theme_code() {
    let div = document.getElementById('theme-controls');
    remove_childs(div);

    let fonts = new Array();
    for (let i = 0; i < window.ed_fonts.length; i++) {
        fonts.push(window.ed_fonts[i].slice(0, -4));
    }

    // background:var(--bg-code);
    // color:var(--fg-code);
    // font-family:var(--font-code);
    // font-style:var(--fstyle-code);

    div.appendChild(iformchild([
        new iParam('bg-code', 'color', Lexer.BACKGROUND, get_style('bg-code'), [THEME_OPS], set_style),
        new iParam('fg-code', 'color', Lexer.TEXT, get_style('fg-code'), [THEME_OPS], set_style),
        new iParam('font-code', 'select', Lexer.FONT, fonts, [THEME_OPS], set_string_style),
        new iParam('fstyle-code', 'checkbox', Lexer.ITALIC, get_italic_style('fstyle-code'), [THEME_OPS], set_italic_style),
    ], [], null));
}

function theme_internal_buttons() {

    let div = document.createElement('div');
    div.style.textAlign = 'left';

    let newbtn = document.createElement('button');
    safe_add_class(newbtn, 'ibutton');
    safe_add_class(newbtn, 'shadow');
    newbtn.style.width = '120px';
    newbtn.innerText = Lexer.T_NEW;
    newbtn.addEventListener('click', (ev) => {
    });
    div.appendChild(newbtn);

    let save = document.createElement('button');
    safe_add_class(save, 'ibutton');
    safe_add_class(save, 'shadow');
    save.style.width = '120px';
    save.innerText = Lexer.SAVE;
    save.addEventListener('click', (ev) => {
        save_current_theme();
    });
    div.appendChild(save);

    let close = document.createElement('button');
    safe_add_class(close, 'ibutton');
    safe_add_class(close, 'shadow');
    close.style.width = '120px';
    close.innerText = Lexer.CLOSE;
    close.addEventListener('click', (ev) => {
        let anchor = document.getElementById('main-modal');
        remove_childs(anchor);
        anchor.style.display = 'none';
    });
    div.appendChild(close);
    return div;
}
