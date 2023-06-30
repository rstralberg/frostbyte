
function edit_theme_colors(theme) {

    create_form('ed-theme-colors', {
        title: 'Redigera färgerna',
        action: 'Spara',
        pos: { x: '2vw', y: '0vh' },
        size: { w: '60vw', h: 'auto' },
        zindex: 999999
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
}