
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
            name: 'bg1',
            bg: get_style('bg1'),
            fg: get_style('fg1'),
            listener: on_bg1
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Meny och Fotrad',
            name: 'bg2',
            bg: get_style('bg2'),
            fg: get_style('fg2'),
            listener: on_bg2
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Upplyst',
            name: 'bg3',
            bg: get_style('bg3'),
            fg: get_style('fg3'),
            listener: on_bg3
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Skrivfält',
            name: 'bg4',
            bg: get_style('bg4'),
            fg: get_style('fg4'),
            listener: on_bg4
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Aktiva skrivfält',
            name: 'bg4h',
            bg: get_style('bg4h'),
            fg: get_style('fg4h'),
            listener: on_bg4h
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Upplysta skrivfält',
            name: 'bg4l',
            bg: get_style('bg4l'),
            fg: get_style('fg4l'),
            listener: on_bg4l
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Avsnitt',
            name: 'bg5',
            bg: get_style('bg5'),
            fg: get_style('fg5'),
            listener: on_bg5
        },
        {
            type: FormType.Color_Bg_Fg,
            label: 'Avsnitt upplyst',
            name: 'bg5s',
            bg: get_style('bg5s'),
            fg: get_style('fg5s'),
            listener: on_bg5s
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

    function on_bg1(e) {
        set_style('bg1', e.bg);
        set_style('fg1', e.fg);
    }

    function on_bg2(e) {
        set_style('bg2', e.bg);
        set_style('fg2', e.fg);
    }

    function on_bg3(e) {
        set_style('bg3', e.bg);
        set_style('fg3', e.fg);
    }

    function on_bg4(e) {
        set_style('bg4', e.bg);
        set_style('fg4', e.fg);
    }

    function on_bg4h(e) {
        set_style('bg4h', e.bg);
        set_style('fg4h', e.fg);
    }

    function on_bg4l(e) {
        set_style('bg4l', e.bg);
        set_style('fg4l', e.fg);
    }

    function on_bg5(e) {
        set_style('bg5', e.bg);
        set_style('fg5', e.fg);
    }

    function on_bg5s(e) {
        set_style('bg5s', e.bg);
        set_style('fg5s', e.fg);
    }

    function on_title_fg(e) {
        set_style('title_fg', e.fg);
    }

    function on_save(e) {

        sql_update( 'theme', 
        [
            'bg1', 'fg1',
            'bg2', 'fg2',
            'bg3', 'fg3',
            'bg4', 'fg4',
            'bg4h', 'fg4h',
            'bg4l', 'fg4l',
            'bg5', 'fg5',
            'bg5s', 'fg5s',
            'title_fg'
        ],
        [
            sql(get_hexcolor_style('bg1')),
            sql(get_hexcolor_style('fg1')),
            sql(get_hexcolor_style('bg2')),
            sql(get_hexcolor_style('fg2')),
            sql(get_hexcolor_style('bg3')),
            sql(get_hexcolor_style('fg3')),
            sql(get_hexcolor_style('bg4')),
            sql(get_hexcolor_style('fg4')),
            sql(get_hexcolor_style('bg4h')),
            sql(get_hexcolor_style('fg4h')),
            sql(get_hexcolor_style('bg4l')),
            sql(get_hexcolor_style('fg4l')),
            sql(get_hexcolor_style('bg5')),
            sql(get_hexcolor_style('fg5')),
            sql(get_hexcolor_style('bg5s')),
            sql(get_hexcolor_style('fg5s')),
            sql(get_hexcolor_style('title_fg'))
        ],
        '`name`='+ sql(theme.name)
        );
    }
}