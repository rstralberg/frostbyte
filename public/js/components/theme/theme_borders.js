
/*
    public $nav_border;
    public $footer_border;
    public $main_border;
*/

function edit_theme_borders(theme) {

    var cur_target = 'none';
    var cur_border = '0px solid #000000';

    create_form('ed-theme-borders', {
        title: 'Redigera kantlinjer',
        action: 'Spara',
        pos: { x: '2vw', y: '0vh' },
        // size: { w: '60vw', h: 'auto' },
        zindex: 999999
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
        }])
        .then(
            (values) => {

                let bordername = `${values.get('borders')}_border`;
                let radiusname = `${values.get('borders')}_radius`;
                
                let border = build_border_style( {
                    size: values.get('size'),
                    type: 'solid',
                    color: rgb_to_hex(parse_rgb(values.get('color')))
                });
                
                sql_update('theme', 
                [
                    bordername, 
                    radiusname
                ],
                [
                    sql(border),
                    sql(parseInt(values.get('size')))
                    
                ],
                `\`name\`=${sql(theme.name)}`);
            });




    function on_borders(e) {
        cur_target = e.value;
        cur_border = parse_border_style(get_style(cur_target + '_border'));
        let radius = get_int_style(cur_target + '_radius');
        document.getElementById('color').value = cur_border.color;
        document.getElementById('size').value = cur_border.size;
        document.getElementById('radius').value = radius;
    }

    function on_color(e) {
        let rgb = parse_rgb(e.value);
        cur_border.color = rgb_to_hex(rgb);
        set_style(cur_target + '_border', build_border_style(cur_border));
    }

    function on_size(e) {
        let border = parse_border_style(get_style(cur_target + '_border'));
        border.size = parseInt(e.value);
        set_style(cur_target + '_border', build_border_style(border));
    }

    function on_radius(e) {
        set_style(cur_target + '_radius', parseInt(e.value) + 'px');
    }

}

