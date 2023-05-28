// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Some globals use in the app
// Although its said that globals should be avoided
// I found that these ones is really handy
//

class global {

    static init() {
        global.page = null;
        global.user = null;
        global.selected_div = null;
        global.selected_block = null;
    }
    
    static set page(page) {
        global._page = page;
    }

    static get page() {
        return global._page;
    }

    static set selected_div(div) {
        global._selected_div = div;
    }

    static get selected_div() {
        return global._selected_div;
    }

    static set selected_block(block) {
        global._selected_block = block;
    }

    static get selected_block() {
        return global._selected_block;
    }

    static set user(usr) {
        global._user = usr;
    }

    static get user() {
        return global._user;
    }
}