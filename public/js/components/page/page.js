
class Page {
    static FORM_EDIT = 'page-edit-main';
    static FORM_DELETE = 'page-delete';
    static FORM_DELETE_TREE = 'page-delete-tree';
    static FORM_DUPLICATE = 'page-duplicate';
    static FORM_DUPLICATE_TREE = 'page-duplicate-tree';
    static FORM_CREATE_PAGE = 'page-create';
    static FORM_RENAME_PAGE = 'page-rename';
    static FORM_MENU = 'page-menu';
    static FORM_MENU_TREE = 'page-menu-tree';
    static FORM_MENU_ACTION = 'page-menu-action';
    static FORM_ALL = 'page-all';
    static FORM_ALL_ACTION = 'page-all-action';
    static FORM_ORDER = 'page-order';

    static set id(v) { Page._id = v; }
    static set parent(v) { Page._parent = v; }
    static set title(v) { Page._title = v; }
    static set author(v) { Page._author = v; }
    static set pos(v) { Page._pos = v; }
    static set showtitle(v) { Page._showtitle = v; }
    static set host(v) { Page._host = v; }
    static set blog(v) { Page._blog = v; }
    static set blogheader(v) { Page._blogheader = v; }

    static get id() { return Page._id; }
    static get parent() { return Page._parent; }
    static get title() { return Page._title; }
    static get author() { return Page._author; }
    static get pos() { return Page._pos; }
    static get showtitle() { return Page._showtitle; }
    static get host() { return Page._host; }
    static get blog() { return Page._blog;}
    static get blogheader() { return Page._blogheader; }

    static set page(p) {
        Page.id = p.id;
        Page.parent = p.parent;
        Page.title = p.title;
        Page.author = p.author;
        Page.pos = p.pos;
        Page.showtitle = p.showtitle;
        Page.host = p.host;
        Page.blog = p.blog;
        Page.blogheader = p.blogheader;
    }

    static get page() {
        return {
            id: Page.id,
            parent: Page.parent,
            title: Page.title,
            author: Page.author,
            pos: Page.pos,
            showtitle: Page.showtitle,
            host: Page.host,
            blog: Page.blog,
            blogheader: Page.blogheader
        };
    }

    static sql_to_page(sql) {
        return {
            id: parseInt(sql.id),
            parent: parseInt(sql.parent),
            title: decodeURIComponent(sql.title),
            author: decodeURIComponent(sql.author),
            pos: parseInt(sql.pos),
            showtitle: parseInt(sql.showtitle) > 0,
            host: parseInt(sql.host) > 0,
            blog: parseInt(sql.blog) > 0,
            blogheader: decodeURIComponent(sql.blogheader),
        }
    }

    static page_to_sql(page) {
        return {
            id: sql(page.id),
            parent: sql(page.parent),
            title: sql(encodeURIComponent(page.title)),
            author: sql(encodeURIComponent(page.author)),
            pos: sql(page.pos),
            showtitle: sql(page.showtitle ? 1 : 0),
            host: sql(page.host ? 1 : 0),
            blog: sql(page.blog ? 1 : 0),
            blogheader: sql(encodeURIComponent(page.blogheader))
        };
    }
}

function load_page(id) {
    return new Promise((resolve) => {
        sql_select('page', ['*'], `id=${id}`, 'pos asc').then(
            (pages) => {
                if (pages.length === 0) {
                    logg(`Could not find page with id=${id}`);
                    resolve();
                } else {

                    Page.page = Page.sql_to_page(pages[0]);
                    if( Page.showtitle  ) {
                        let pagetitle = document.getElementById('page-title');
                        pagetitle.innerHTML = Page.title;
                    }
                    if( Page.blog ) {
                        let pagetitle = document.getElementById('page-title');
                        let div = document.createElement('div');
                        div.classList.add('blog-header');
                        div.innerHTML = Page.blogheader ;
                        pagetitle.appendChild(div);
                        
                    }
                    load_page_sections(id);
                    resolve();
                }
            },
            () => {
                resolve();
            });
    });
}

