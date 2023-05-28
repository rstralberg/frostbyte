// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Application main entry called by PHP on start
// - args 
//      lang - language (current sv or en)
//      login - true on a login attempt
//      user - current user if logged in, else null
//      page - current page name
//      fonts - avaible fonts
//
function main(args) {

    const PANELAREA = 'panelarea';
    const SIDEPANELS = 'sidepanels';
    const LEFTPANEL = 'left-panel';
    const CENTERPANEL = 'centerpanel';
    const NAVBAR = 'navbar';
    const FOOTER = 'footer';
    const RIGHTPANEL = 'right-panel';

    global.init();
    console.log('before load page');
    global.page = load_page(args.page);
    if(global.page )
        console.log('after load page is valid.');
    else
        console.log('after load page is NULL.');
    
    let username = '';
    if( args.user ) {
        username = args.user;
    } else {
        username = get_cookie('username');
    }
    if( username ) {
        let user = load_user(username);
        if(user) {
            global.user = user;
            set_cookie('username', user.username);
        }
    }

    load_lexer(args.lang);

    window.selected = null;
    let body = document.querySelector('body');
    body.classList.add('body');
    {
        // PANELS
        let panel_area = document.createElement('div');
        panel_area.classList.add(PANELAREA);
        panel_area.id = PANELAREA;
        body.appendChild(panel_area);
        {
            // LEFT PANEL
            var left_panel = document.createElement('div');
            left_panel.classList.add(SIDEPANELS);
            left_panel.id = LEFTPANEL;
            panel_area.appendChild(left_panel);

            // CENTER PANEL
            let center_panel = document.createElement('main');
            center_panel.classList.add(CENTERPANEL);
            center_panel.id = CENTERPANEL;
            panel_area.appendChild(center_panel);
            {

                // NAVBAR
                var navbar = document.createElement('nav');
                navbar.classList.add(NAVBAR);
                center_panel.appendChild(navbar);

                // BLOCKS
                var blocks = document.createElement('div');
                blocks.classList.add(CENTERPANEL);
                blocks.style.marginBlock = '10vh';
                blocks.id = 'blocks';
                center_panel.appendChild(blocks);

                // FOOTER
                var footer = document.createElement(FOOTER);
                footer.classList.add(FOOTER);
                center_panel.appendChild(footer);
            }

            // RIGHT PANEL
            var right_panel = document.createElement('div');
            right_panel.classList.add(SIDEPANELS);
            right_panel.id = RIGHTPANEL;
            panel_area.appendChild(right_panel);
        }
    }

    fill_left_panel(left_panel);
    fill_navbar(navbar);
    fill_center_panel(blocks, global.page.name);
    fill_footer(footer);
    fill_right_panel(right_panel);

    if( args.login ) {
        login();
    }
}