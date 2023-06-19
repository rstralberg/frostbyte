
class Global 
{
    static get config()   { return Global._config; }
    static set config(c)  { Global._config = c; }

    static get user()   { return Global._user; }
    static set user(u)  { Global._user = u; }

    static get page()   { return Global._page; }
    static set page(p)  { Global._page = p; }

    static get navbar()   { return Global._navbar; }
    static set navbar(n)  { Global._navbar = n; }

    static get selected() { return Global._selected;}
    static set selected(s) {Global._selected = s;}

}
