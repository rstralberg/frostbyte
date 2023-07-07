
class Global {
    static MAX_IMAGE_SIZE = 1024;

    static get navbar() { return Global._navbar; }
    static set navbar(n) { Global._navbar = n; }

    static get selected() { return Global._selected; }
    static set selected(s) { Global._selected = s; }

}
