
class navbar {

    static get inst() { return navbar._inst; }
    static set inst(v) { navbar._inst = v; }
    static get selected() { return navbar._selected; } 
    static set selected(s) { navbar._selected = s; } 

    get elem() { return this._elem; }
    get pages() { return this._pages; } // array of pages

    constructor(elem, pages) {
        this._elem = elem;
        this._pages = pages;
        this._selected = null;
    }
}

function fill_navbar(navbar) {
    let pages = load_top_pages();
    if( pages) {
        pages.forEach((page) => {
            navbar.appendChild(create_navlink(page.name, page.title, on_page_select));
        });    
    }
    page_data.current = pages[0];
}

function create_navlink(name,text,func) {
    
    let a = document.createElement('button');
    a.classList.add('navlinks');
    a.innerHTML = text;
    a.addEventListener('click', (e) => {
        func(name)
    });
    
    return a;

}