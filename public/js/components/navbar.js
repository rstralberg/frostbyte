
function navbar_logged_in(logged_in) {
    document.getElementById('navbar-log-in').style.display = logged_in ? 'none': 'inline';
    document.getElementById('navbar-log-out').style.display = logged_in ? 'inline':'none'
}

function load_navbar() {

    sql_select('page', ['id', 'title'], '`parent`=0', '`pos` asc')
    .then(
        (pages) => {
            var container = document.querySelector('nav');
            if (is_valid(Global.config.logo, false)) {
                var img = document.createElement('img');
                img.classList.add('logo');
                img.addEventListener('load', (e) => {
                    let a = document.createElement('a');
                    a.href = '/';
                    a.id = 'logo';
                    a.appendChild(img);
                    container.appendChild(a);

                    pages.forEach(p => {
                        let a = document.createElement('a');
                        a.innerHTML = p.title;
                        a.href = `/${p.id}`;
                        a.id = p.id;
                        container.appendChild(a);
                    });
                })
                img.src = Global.config.logo;
            }
            else {
                pages.forEach(p => {
                    let a = document.createElement('a');
                    a.innerHTML = p.title;
                    a.href = `/${p.id}`;
                    a.id = p.id;
                    container.appendChild(a);
                });
            }

            let a = document.createElement('a');
            a.id = 'navbar-log-out';
            a.classList.add('nav-right');
            a.innerHTML = 'Logga ut';
            a.href = '#';
            a.addEventListener('click', (e) => { logout(); });
            container.appendChild(a);

            a = document.createElement('a');
            a.id = 'navbar-log-in';
            a.classList.add('nav-right');
            a.innerHTML = 'Logga in';
            a.href = '#';
            a.addEventListener('click', (e) => { login(); });
            container.appendChild(a);

            Global.navbar = container;
            navbar_logged_in(Global.user.valid);
        },
        (error) => { logg(`navbar: ${error}`) }
    );   
}


function navbar_rename_item(id,title) {
    let navbar = document.querySelector('nav');
    for( let i=0; i < navbar.children.length; i++ ) {
        let item = navbar.children[i];
        if ( item.id === `${id}` ) {
            item.innerHTML = title;
            break;
        }
    }
}