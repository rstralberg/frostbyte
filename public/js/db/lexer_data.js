
class lexer_data {
    static _lex = new Map();
    static t(tag) {
        return lexer_data._lex.get(tag);
    }
}

function load_lexer(lang) {
    let data = sql_read('lexer',
        ['tag', 'txt'],
        `\`lang\`=${sql_string(lang)}`, [],
        sql_mode.mutli);
    if (data) {
        data.forEach(v => {
            lexer_data._lex.set(v.tag, html_decode(v.txt));
        });
    }
}

function T(tag) {
    let s = lexer_data.t(tag);
    if (typeof s === 'string') {
        return s;
    }
    let config = sql_read('config', ['language'], 'id=1', '');
    sql_write('lexer', ['lang', 'tag', 'eng', 'txt'],
        [sql_string(config.language),
        sql_string(tag),
        sql_string(tag),
        sql_string(tag)
        ],
        'lang=' + sql_string(config.language) + ' and '
        + 'tag=' + sql_string(tag));
    return `[${tag}]`;
}
