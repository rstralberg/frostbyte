function load_navbar() {

    return new Promise((resolve) => {


        sql_select('page', ['id', 'parent', 'title'], null, 'pos asc').then((pages) => {


            var parents = new Array();
            pages.forEach(page => {
                page.id = parseInt(page.id);
                page.parent = parseInt(page.parent);
                page.title = decodeURIComponent(page.title);
                if (page.parent === 0) {
                    parents.push({
                        id: page.id,
                        parent: page.parent,
                        title: page.title,
                        subs: new Array()
                    });
                }
            });

            parents.forEach(parent => {
                pages.forEach(page => {
                    page.id = parseInt(page.id);
                    page.parent = parseInt(page.parent);
                    page.title = decodeURIComponent(page.title);
                    if (page.parent === parent.id) {
                        parent.subs.push({
                            id: page.id,
                            parent: page.parent,
                            title: page.title,
                        });
                    }

                });
            });

            var nav = document.querySelector('nav');
            nav.id = 'top-nav';
            if (!nav.classList.contains('topnav')) {
                nav.classList.add('topnav');
            }

            var img = null;
            if (is_valid(Config.logo, false)) {
                img = document.createElement('img');
                img.classList.add('logo');
                img.addEventListener('load', (e) => {
                    let a = document.createElement('a');
                    a.classList.add('logo');
                    a.href = `/${pages[0].id}`;
                    a.id = 'logo';
                    a.appendChild(img);
                    nav.insertBefore(a, nav.firstChild);
                });
            }

            for (let i = 0; i < parents.length; i++) {
                let parent = parents[i];

                if (parent.subs.length == 0) {
                    let a = document.createElement('a');
                    a.href = parent.id;
                    a.innerText = parent.title;
                    // om aktuell a.classList.add('active');
                    nav.appendChild(a);
                }
                else {

                    let sub = document.createElement('div');
                    sub.classList.add('dropdown');
                    nav.appendChild(sub);

                    let btn = document.createElement('dropbtn');
                    sub.appendChild(btn);
                    btn.classList.add('dropbtn');
                    btn.innerText = parent.title;

                    let i = document.createElement('i');
                    i.classList.add('fa', 'fa-caret-down');
                    btn.append(i);


                    let subcontent = document.createElement('div');
                    subcontent.classList.add('dropdown-content');
                    sub.appendChild(subcontent);

                    for (let j = 0; j < parent.subs.length; j++) {
                        let sub = parent.subs[j];
                        let a = document.createElement('a');
                        a.href = sub.id;
                        a.innerText = sub.title;
                        subcontent.appendChild(a);
                    }
                }

            }

            let langdown = document.createElement('select');
            langdown.classList.add('nav-lang');
            
            let option = document.createElement('option');
            option.value = 'sv';
            option.innerText = 'Svenska';
            langdown.appendChild(option);

            option = document.createElement('option');
            option.value = 'en';
            option.innerText = 'English';
            langdown.appendChild(option);
            
            langdown.addEventListener( 'click', (e) => {
                sql_update('config', ['language'], [sql(e.target.value)], 'id=1').then( () => {
                    load_translation(e.target.value);
                    window.location = '/';
                });
            });
            nav.appendChild(langdown);
            
            var dropdown = document.createElement('select');
            dropdown.classList.add('nav-select');
            sql_select('theme', ['name'], null, 'name asc').then( (themes) => {
                themes.forEach(theme => {
                    let option = document.createElement('option');
                    option.value = theme.name;
                    option.innerText = theme.name;
                    if( theme.name === Config.theme ) {
                        option.selected = true;
                    }
                    dropdown.appendChild(option);
                });
            });
            nav.appendChild(dropdown);
            dropdown.addEventListener('change', (e) => {
                apply_theme(e.target.value);
            });


            // dropdown = document.createElement('select');
            // dropdown.classList.add('nav-select');
            
            // sql_select('theme', ['name'], null, 'name asc').then( (themes) => {
            //     themes.forEach(theme => {
            //         let option = document.createElement('option');
            //         option.value = theme.name;
            //         option.innerText = theme.name;
            //         if( theme.name === Config.theme ) {
            //             option.selected = true;
            //         }
            //         dropdown.appendChild(option);
            //     });
            // });
            // nav.appendChild(dropdown);
            // dropdown.addEventListener('change', (e) => {
            //     apply_theme(e.target.value);
            // });


            let a = document.createElement('a');
            a.id = 'log-in-out';
            a.classList.add('login', 'nav-right');
            a.innerHTML = User.valid ? Trans.tag('logout') : Trans.tag('login');
            a.addEventListener('click', (e) => {
                if (User.valid) {
                    logout();
                } else {
                    login();
                }
            });
            nav.appendChild(a);

            a = document.createElement('a');
            a.href = "javascript:void(0);";
            a.classList.add("icon");
            a.innerHTML = '&#9776;';
            a.addEventListener('click', (e) => {
                var top = document.getElementById('top-nav');
                if (top.classList.contains('responsive')) {
                    top.classList.remove('responsive');
                }
                else {
                    top.classList.add('responsive');
                }
            });
            nav.append(a);

            navbar_logged_in(User.valid);

            if (img) {
                img.src = Config.logo;
            }
            resolve();
        });
    });
}

function navbar_logged_in(logged_in) {
    let element = document.getElementById('log-in-out');
    if (is_valid(element)) {
        element.innerText = logged_in ? Trans.tag('logout') : Trans.tag('logout');
    }
}

function navbar_rename_item(id, title) {
    let navbar = document.querySelector('nav');
    let items = navbar.querySelectorAll('a');
    items.forEach(item => {
        if (item.pathname === `/${id}` && 
            !item.classList.contains('fa') && 
            !item.classList.contains('logo')) {
            item.innerHTML = title;
            return;
        }
    });
}


function update_navbar() {
    let nav = document.querySelector('nav');
    remove_childs(nav);
    load_navbar();
}

