
/*
    Content:

    title
    date
    author
    content
    more
*/

function create_new_blog() {

    var more_id = -1;
    var more_title = '';
    var media_content = {};
    var media_type = 'none';

    var page_array = new Array();
    page_array.push({
        value: 'none',
        text: Trans.tag('none')
    });
    sql_select('page', ['id', 'title'], 'host=0').then(
        (pages) => {
            pages.forEach(page => {
                page_array.push({
                    value: page.id,
                    text: decodeURIComponent(page.title)
                });
            });
            create_form('blog-create', {
                title: Trans.tag('create-blog-post'),
                action: Trans.tag('create'),
                size: { w: '60vw', h: 'auto' }
            }, [
                {
                    type: FormType.Text,
                    name: 'blog-title',
                    label: Trans.tag('create'),
                },
                {
                    type: FormType.List,
                    name: 'page-ref',
                    label: Trans.tag('page-reference'),
                    items: page_array,
                    selected: 'none',
                    listener: on_select_page
                },
                {
                    type: FormType.TextArea,
                    name: 'blog-text',
                    label: Trans.tag('text'),
                    rows: 20,
                    cols: 80,
                },
                {
                    type: FormType.List,
                    name: 'media-select',
                    label: Trans.tag('media'),
                    items: [
                        { value: 'none', text: Trans.tag('none') },
                        { value: 'picture', text: Trans.tag('image') },
                        { value: 'youtube', text: 'YouTube' },
                        { value: 'audio', text: 'MP3' },
                        { value: 'soundcloud', text: 'Soundcloud' },
                        { value: 'spotify', text: 'Spotify' }
                    ],
                    selected: 'none',
                    listener: on_media_select
                },
                {
                    type: FormType.List,
                    label: Trans.tag('media-position'),
                    name: 'media-pos',
                    items: [
                        { value: 'top-left', text: Trans.tag('before-text-at-left') },
                        { value: 'top-center', text: Trans.tag('before-text-at-center') },
                        { value: 'top-right', text: Trans.tag('before-text-at-right') },
                        { value: 'bottom-left', text: Trans.tag('after-text-at-left') },
                        { value: 'bottom-center', text: Trans.tag('after-text-at-center') },
                        { value: 'bottom-right', text: Trans.tag('after-text-at-right') },

                    ],
                    selected: 'top-center'
                },
                {
                    type: FormType.Checkbox,
                    label: Trans.tag('shadow'),
                    name: 'media-shadow',
                    value: true
                },

            ]).then(
                (result) => {
                    let date = new Date();

                    for (let i = 0; i < page_array.length; i++) {
                        if (parseInt(page_array[i].value) === parseInt(result.get('page-ref'))) {
                            more_title = page_array[i].text;
                            more_id = parseInt(page_array[i].value);
                        }
                    }

                    var content = {
                        title: '<hr>' + result.get('blog-title'),
                        author: User.fullname,
                        date: date.toLocaleDateString(),
                        text: result.get('blog-text'),
                        more: more_id,
                        more_title: more_title,
                        media: {
                            content: media_content,
                            type: media_type,
                            pos: result.get('media-pos'),
                            shadow: result.get('media-shadow'),
                        }
                    };

                    let sql_content = blog_to_sql(content);
                    let blog_content = sql_to_blog(sql_content);

                    sql_insert('section',
                        ['page_id', 'type', 'height', 'pos', 'content'],
                        [sql(Page.id),
                        sql('blog'),
                        sql(40),
                        sql(document.querySelector('main').childElementCount),
                        sql(JSON.stringify(blog_to_sql(content)))])
                        .then(
                            (id) => {
                                let container = document.querySelector('main');
                                let section = document.createElement('section');

                                section.contentEditable = true;
                                create_section_id(section, id);
                                container.appendChild(section);

                                draw_blog(section, content);
                            },
                            () => { }
                        );
                },
                () => {});
        },
        (reject) => { }
    );

    function on_media_select(e) {

        if (e.value !== 'none') {
            let func = window['media_form_' + e.value];
            if (is_valid(func)) {
                func().then((content) => {
                    media_type = e.value;
                    media_content = content;
                },
                    () => {
                    });
            }
        }
    }

    function on_select_page(e) {
        more_id = e.value === 'none' ? -1 : parseInt(e.value);
        more_title = e.innerText;
    }
}

function draw_blog(section, content) {

    section.style.background = get_style('background');
    section.style.height = 'auto';

    let titlediv = document.createElement('div');
    titlediv.classList.add('blog-title');
    titlediv.innerHTML = decodeURIComponent(content.title);
    titlediv.readonly = true;
    section.appendChild(titlediv);

    let infodiv = document.createElement('div');
    infodiv.classList.add('blog-info');
    infodiv.innerHTML = content.date + '<br>' + decodeURIComponent(content.author);
    infodiv.setAttribute('data-date', content.date);
    infodiv.setAttribute('data-author', decodeURIComponent(content.author));
    infodiv.readonly = true;
    section.appendChild(infodiv);

    if( content.media.pos.startsWith('top-') ) {
        let mediadiv = document.createElement('div');
        mediadiv.classList.add('blog-media');
        let align = content.media.pos.slice('top-'.length);
        mediadiv.style.textAlign = align;

        let func = window['draw_'+content.media.type];
        if( is_valid(func)) {
            func(mediadiv, content.media.content);
        }
        mediadiv.setAttribute( 'data-media-content', JSON.stringify(content.media.content));
        section.appendChild( mediadiv );
    }
    
    let textdiv = document.createElement('div');
    textdiv.classList.add('blog-text');
    textdiv.innerHTML = decodeURIComponent(content.text);
    section.appendChild(textdiv);

    if( content.media.pos.startsWith('bottom-') ) {
        let mediadiv = document.createElement('div');
        mediadiv.classList.add('blog-media');
        let align = content.media.pos.slice('bottom-'.length);
        mediadiv.style.textAlign = align;

        let func = window['draw_'+content.media.type];
        if( is_valid(func)) {
            func(mediadiv, content.media.content);
        }
        mediadiv.setAttribute( 'data-media', JSON.stringify(content.media));
        section.appendChild( mediadiv );
    }

    if (content.more.length > 0) {
        let morebutton = document.createElement('a');
        morebutton.classList.add('blog-more');
        morebutton.innerText = decodeURIComponent(content.more_title);
        morebutton.href = content.more;
        section.appendChild(morebutton);
    }

    section.addEventListener('mouseup', (e) => {
        mark_section_selected(section);
    });
}

function show_blog_tools(section) {

    show_tools('blog', [
        { title: Trans.tag('bold'), func: on_bold },
        { title: Trans.tag('italic'), func: on_italic },
        { title: Trans.tag('underline'), func: on_underline },
        { title: Trans.tag('large'), func: on_h1 },
        { title: Trans.tag('small'), func: on_h3 },
        { title: Trans.tag('mark'), func: on_mark },
        { title: Trans.tag('normal'), func: on_normal },
        { title: Trans.tag('link'), func: on_link },
        { title: Trans.tag('left'), func: on_left },
        { title: Trans.tag('center'), func: on_center },
        { title: Trans.tag('right'), func: on_right }]);

    function on_bold() { format_selection('b'); }
    function on_italic() { format_selection('i'); }
    function on_underline() { format_selection('u'); }
    function on_h1() { format_selection('h1'); }
    function on_h3() { format_selection('h3'); }
    function on_mark() { format_selection('mark'); }
    function on_normal() { section.innerHTML = section.innerblog; }
    function on_link() {
        let selection = window.getSelection();
        if (selection.rangeCount) {
            var range = selection.getRangeAt(0);
            var blog = range.extractContents();
            if (blog.blogContent.length > 0) {

                create_form('blog-link', { title: 'Länk', action: 'Spara' }, [
                    {
                        type: FormType.blog,
                        name: 'blog',
                        label: 'blog',
                        value: blog.blogContent,
                        readonly: true
                    },
                    {
                        type: FormType.blog,
                        name: 'link',
                        label: 'Länk',
                        value: 'https://'
                    }
                ]).then(
                    function (resolve) {
                        let a = document.createElement('a');
                        a.classList.add('link');
                        a.href = resolve.get('link');
                        a.appendChild(blog);
                        range.insertNode(a);
                    }
                );
            }
        }
    }
    function on_left() {
        section.style.blogAlign = 'left';
    }
    function on_center() {
        section.style.blogAlign = 'center';
    }
    function on_right() {
        section.style.blogAlign = 'right';
    }
}

function delete_blog(section) {
    sql_delete('section', `id=${parse_section_id(section)}`)
        .then(
            () => {
                document.querySelector('main').removeChild(section);
            }
        );
}

function entering_blog(section) {
    show_blog_tools(section);
    section.querySelector('.blog-text').contentEditable = User.valid ;
}

function leaving_blog(section) {
    
    section.querySelector('.blog-text').contentEditable = false;

    let title = verify_object(section.querySelector('.blog-title'),'object');
    let info = verify_object(section.querySelector('.blog-info'),'object');
    let text = verify_object(section.querySelector('.blog-text'),'object');
    let more = section.querySelector('.blog-more');
    more = is_valid(more)?more:null;
    let mediadiv = verify_object(section.querySelector('.blog-media'), 'object');
    let media = is_valid(mediadiv ) ? JSON.parse(mediadiv.getAttribute('data-media')) : null;
    if( !is_valid( info.getAttribute('data-date') ) ) {
        let date = new Date();
        info.setAttribute('data-date', date.toLocaleDateString());
    }

    let content = {
        title: title.innerText,
        author: info.getAttribute('data-author'),
        date: info.getAttribute('data-date'),
        text: text.innerHTML,
        more: more? more.href:'0',
        more_title: more? more.innerText : '',
        media: media
    };

    leaving_section( section, blog_to_sql(content) );
}


function blog_to_sql(content) {
    return {
        title: encodeURIComponent(content.title),
        author: encodeURIComponent(content.author),
        text: encodeURIComponent(content.text),
        more: content.more,
        more_title: encodeURIComponent(content.more_title),
        date: content.date,
        media: {
            type: is_valid(content.media) ? content.media.type : 'none',
            pos: is_valid(content.media) ? content.media.pos : 'left',
            shadow: is_valid(content.media) ? content.media.shadow : 0,
            content: is_valid(content.media) ? content.media.content : {}
        }
    }
}

function sql_to_blog(sql) {
    return {
        title: decodeURIComponent(sql.title),
        author: decodeURIComponent(sql.author),
        text: decodeURIComponent(sql.text),
        more: parseInt(sql.more),
        date: sql.date,
        more_title: decodeURIComponent(sql.more_title),
        media: sql.media
    };
}