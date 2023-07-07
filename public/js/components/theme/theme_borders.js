
/*
    public $nav_border;
    public $footer_border;
    public $main_border;
*/

function edit_theme_borders(theme) {

    create_form('edit-theme-borders', {
        title: 'Redigera kantlinjer',
        pos: { x: '41vw', y: '26vh' },
        size: { w: '41vw', y: 'auto' },
        cancel: false,
        fixed: true
    }, [
        {
            type: FormType.List,
            name: 'borders',
            label: 'Kantlinjer',
            items: [
                {
                    value: 'none',
                    text: 'Välj'
                },
                {
                    value: 'nav',
                    text: 'Meny'
                },
                {
                    value: 'footer',
                    text: 'Fotrad'
                },
                {
                    value: 'main',
                    text: 'Huvudsida'
                },
            ],
            selected: 'none',
            listener: on_borders
        },
        {
            type: FormType.Color,
            name: 'color',
            label: 'Färg',
            value: '',
            listener: on_color
        },
        {
            type: FormType.Number,
            name: 'size',
            label: 'Bredd',
            value: 0,
            listener: on_size
        },
        {
            type: FormType.Number,
            name: 'radius',
            label: 'Rundning',
            value: 8,
            listener: on_radius
        },
        {
            type: FormType.Button,
            name: 'save',
            value: 'Spara',
            listener: on_save
        }
    ]);
    var radiusname = '';
    var bordername = '';


    function on_borders(e) {

        radiusname = `${e.value}_radius`;
        bordername = `${e.value}_border`;

        let radius = get_int_style(radiusname);
        let border = parse_border_style(get_style(bordername));

        document.getElementById('color').value = border.color;
        document.getElementById('size').value = border.size;
        document.getElementById('radius').value = radius;
    }

    function on_color(e) {

        let border = parse_border_style(get_style(bordername));

        set_style(bordername, build_border_style({
            size: border.size,
            color: rgb_to_hex(parse_rgb(e.value)),
            type: 'solid'
        }));
    }

    function on_size(e) {

        let border = parse_border_style(get_style(bordername));

        set_style(bordername, build_border_style({
            size: parseInt(e.value),
            color: border.color,
            type: 'solid'
        }));
    }

    function on_radius(e) {
        set_style(radiusname, parseInt(e.value) + 'px');
    }

    function on_save(e) {

        let border = get_style(bordername);
        let radius = get_int_style(radiusname);

        sql_update('theme',
            [
                bordername,
                radiusname
            ],
            [
                sql(border),
                sql(radius + 'px')

            ],
            `\`name\`=${sql(theme.name)}`);
    }
}


