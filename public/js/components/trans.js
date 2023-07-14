
class Trans {

    static _translations = new Map();

    static clear() {
        Trans._translations.clear();
    }

    static add(tag, expr) {
        Trans._translations.set(tag, expr);
    }

    static tag(tag) {
        let t = Trans._translations.get(tag);
        return !is_valid(t) ? `[${tag}]` : t;
    }

}

function load_translation(code) {
    return new Promise((resolve, reject) => {
        sql_select('translation', ['*'], 'code=' + sql(code)).then((translations) => {
            Trans.clear();
            translations.forEach(tr => {
                Trans.add(tr.tag, decodeURIComponent(tr.exp));
            });
            resolve();
        },
            () => { reject(); });
    });
}

