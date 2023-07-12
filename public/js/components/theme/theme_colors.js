
function edit_theme_colors(theme) {

    create_form('edit-theme-colors', {
        title: 'Redigera färgerna',
        pos: { x: '41vw', y: '26vh' },
        size: { w: '41vw', h: 'auto' },
        cancel: false,
        fixed: true
    }, [
        {
            type: FormType.Color_Bg_Fg,
            label: 'Övergripande',
            name: 'common',
            bg: get_style('background'),
            fg: get_style('color'),
            listener: on_common
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Meny och Fotrad',
            name: 'bars',
            bg: get_style('bars_background'),
            fg: get_style('bars_color'),
            listener: on_bars
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Upplyst',
            name: 'instense',
            bg: get_style('intense_background'),
            fg: get_style('intense_color'),
            listener: on_intense
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Titlar',
            name: 'titles',
            bg: get_style('titles_background'),
            fg: get_style('titles_color'),
            listener: on_titles
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Skrivfält',
            name: 'ctl',
            bg: get_style('ctl_background_hover'),
            fg: get_style('ctl_color_hover'),
            listener: on_ctl
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Aktive skrivfält',
            name: 'ctl_active',
            bg: get_style('ctl_background_active'),
            fg: get_style('ctl_color_active'),
            listener: on_ctl_active
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Avsnitt',
            name: 'section',
            bg: get_style('section_background'),
            fg: get_style('section_color'),
            listener: on_section
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Avsnitt upplyst',
            name: 'section_selected',
            bg: get_style('section_selected_background'),
            fg: get_style('section_selected_color'),
            listener: on_section_selected
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Knappar',
            name: 'button',
            bg: get_style('button_background'),
            fg: get_style('button_color'),
            listener: on_button
        },
        {
            type: FormType.Color,
            label: 'Titlars färg ',
            name: 'title_fg',
            value: get_style('title_fg'),
            listener: on_title_fg
        },
        {
            type: FormType.Button,
            name: 'save',
            value: 'Spara',
            listener: on_save

        }
    ]);

    function on_common(e) {
        set_style('background', e.bg);
        set_style('color', e.fg);
    }

    function on_bars(e) {
        set_style('bars_background', e.bg);
        set_style('bars_color', e.fg);
    }

    function on_intense(e) {
        set_style('intense_background', e.bg);
        set_style('intense_color', e.fg);
    }

    function on_titles(e) {
        set_style('titles_background', e.bg);
        set_style('titles_color', e.fg);
    }

    function on_ctl(e) {
        set_style('ctl_background_hover', e.bg);
        set_style('ctl_color_hover', e.fg);
    }

    function on_ctl_active(e) {
        set_style('ctl_background_active', e.bg);
        set_style('ctl_color_active', e.fg);
    }

    function on_section(e) {
        set_style('section_background', e.bg);
        set_style('section_color', e.fg);
    }

    function on_section_selected(e) {
        set_style('section_selected_background', e.bg);
        set_style('section_selected_color', e.fg);
    }

    function on_button(e) {
        set_style('button_background', e.bg);
        set_style('button_color', e.fg);
    }

    function on_title_fg(e) {
        set_style('title_fg', e.fg);
    }

    function on_save(e) {

        sql_update( 'theme', 
        [
            'background', 'color',
            'bars_background', 'bars_color',
            'intense_background', 'intense_color',
            'titles_background', 'titles_color',
            'ctl_background_hover', 'ctl_color_hover',
            'ctl_background_active', 'ctl_color_active',
            'section_background', 'section_color',
            'section_selected_background', 'section_selected_color',
            'title_fg'
        ],
        [
            sql(get_hexcolor_style('background')),
            sql(get_hexcolor_style('color')),
            sql(get_hexcolor_style('bars_background')),
            sql(get_hexcolor_style('bars_color')),
            sql(get_hexcolor_style('intense_background')),
            sql(get_hexcolor_style('intense_color')),
            sql(get_hexcolor_style('titles_background')),
            sql(get_hexcolor_style('titles_color')),
            sql(get_hexcolor_style('ctl_background_hover')),
            sql(get_hexcolor_style('ctl_color_hover')),
            sql(get_hexcolor_style('ctl_background_active')),
            sql(get_hexcolor_style('ctl_color_active')),
            sql(get_hexcolor_style('section_background')),
            sql(get_hexcolor_style('section_color')),
            sql(get_hexcolor_style('section_selected_background')),
            sql(get_hexcolor_style('section_selected_color')),
            sql(get_hexcolor_style('title_fg'))
        ],
        '`name`='+ sql(theme.name)
        );
    }
}