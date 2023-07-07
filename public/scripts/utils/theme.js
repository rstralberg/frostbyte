
function save_current_theme() {

    let id = get_int_style('theme_id');
    let query = 'update theme set ';
    query += 'app=\'' + encodeURIComponent(JSON.stringify(
        {
            'font_app': get_style('font-app'),
            'fsize_app': get_style('fsize-app'),
            'width_app': get_style('width-app'),
            'bg_app': get_style('bg-app'),
            'fg_app': get_style('fg-app')
        })) + '\',';

    query += 'top=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_top': get_style('bg-top'),
            'border_top': get_style('border-top'),
            'radius_top': get_style('radius-top'),
            'shadow_top': get_style('shadow-top'),
            'height_top': get_style('height-top')
        })) + '\',';

    query += 'nav=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_nav': get_style('bg-nav'),
            'fg_nav': get_style('fg-nav'),
            'border_nav': get_style('border-nav'),
            'hi_bg_nav': get_style('hi-bg-nav'),
            'hi_fg_nav': get_style('hi-fg-nav'),
            'hi_border_nav': get_style('hi-border-nav'),
            'bold_nav': get_style('bold-nav'),
            'fsize_nav': get_style('fsize-nav'),
            'shadow_nav': get_style('shadow-nav'),
            'radius_nav': get_style('radius-nav')
        })) + '\',';

    query += 'page=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_page': get_style('bg-page'),
            'fg_page': get_style('fg-page'),
            'border_page': get_style('border-page'),
            'radius_page': get_style('radius-page'),
            'shadow_page': get_style('shadow-page')
        })) + '\',';

    query += 'footer=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_footer': get_style('bg-footer'),
            'fg_footer': get_style('fg-footer'),
            'border_footer': get_style('border-footer'),
            'radius_footer': get_style('radius-footer'),
            'bold_footer': get_style('bold-footer'),
            'fsize_footer': get_style('fsize-footer'),
            'align_footer': get_style('align-footer'),
            'shadow_footer': get_style('shadow-footer'),
            'height_footer': get_style('height-footer')
        })) + '\',';

    query += 'buttons=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_btn': get_style('bg-btn'),
            'fg_btn': get_style('fg-btn'),
            'border_btn': get_style('border-btn'),
            'hi_bg_btn': get_style('hi-bg-btn'),
            'hi_fg_btn': get_style('hi-fg-btn'),
            'hi_border_btn': get_style('hi-border-btn'),
            'fsize_btn': get_style('fsize-btn'),
            'bold_btn': get_style('bold-btn'),
            'shadow_btn': get_style('shadow-btn'),
            'radius_btn': get_style('radius-btn'),
        })) + '\',';

    query += 'links=\'' + encodeURIComponent(JSON.stringify(
        {
            'fg_link': get_style('fg-link'),
            'hi_fg_link': get_style('hi_fg-link'),
            'bold_link': get_style('bold-link'),
        })) + '\',';

    query += 'headers=\'' + encodeURIComponent(JSON.stringify(
        {
            'fg_title': get_style('fg-title'),
            'fsize_title': get_style('fsize-title'),
            'bold_title': get_style('bold-title'),
            'align_title': get_style('align-title'),
            'fg_h': get_style('fg-h'),
            'bold_h': get_style('bold-h'),
            'align_h': get_style('align-h'),
            'fsize_h1': get_style('fsize-h1'),
            'fsize_h2': get_style('fsize-h2'),
            'fsize_h3': get_style('fsize-h3'),
        })) + '\',';

    query += 'input=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_inp': get_style('bg-inp'),
            'fg_inp': get_style('fg-inp'),
            'hi_bg_inp': get_style('hi-bg-inp'),
            'hi_fg_inp': get_style('hi-fg-inp'),
            'border_inp': get_style('border-inp'),
            'radius_inp': get_style('radius-inp'),
            'shadow_inp': get_style('shadow-inp'),
            'fsize_inp': get_style('fsize-inp'),
        })) + '\',';

    query += 'blocks=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_block': get_style('bg-block'),
            'fg_block': get_style('fg-block'),
            'border_block': get_style('border-block'),
            'radius_block': get_style('radius-block'),
            'shadow_block': get_style('shadow-block'),
            'fsize_block': get_style('fsize-block'),
        })) + '\',';

    query += 'quote=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_quote': get_style('bg-quote'),
            'fg_quote': get_style('fg-quote'),
            'fstyle_quote': get_style('fstyle-quote'),
        })) + '\',';

    query += 'code=\'' + encodeURIComponent(JSON.stringify(
        {
            'bg_code': get_style('bg-code'),
            'fg_code': get_style('fg-code'),
            'font_code': get_style('font-code'),
            'fstyle_code': get_style('fstyle-code'),
        })) + '\' ';

    query += 'where id=' + id;

    sql_update(query);
}

