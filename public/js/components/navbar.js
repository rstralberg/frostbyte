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

            parents.forEach(parent => {
                console.log( parent.title );
                parent.subs.forEach(sub => {
                    console.log( '--- ' + sub.title);
                });
            });

            var nav = document.querySelector('nav');
            nav.id = 'topnav';
            if (!nav.classList.contains('topnav')) {
                nav.classList.add('topnav');
            }

            var img = null;
            if (is_valid(Global.config.logo, false)) {
                img = document.createElement('img');
                img.classList.add('logo');
                img.addEventListener('load', (e) => {
                    let a = document.createElement('a');
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

                    let btn = document.createElement('button');
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

            let a = document.createElement('a');
            a.id = 'log-in-out';
            a.classList.add('nav-right');
            a.innerHTML = is_valid(Global.user) && Global.user.valid ? 'Logga ut' : 'Logga in';
            a.addEventListener('click', (e) => { 
                if ( is_valid(Global.user) && Global.user.valid ) {
                    logout(); 
                } else {
                    login();
                }});
            nav.appendChild(a);

            a = document.createElement('a');
            a.href = "javascript:void(0);";
            a.classList.add("icon");
            a.innerHTML = '&#9776;';
            a.addEventListener('click', (e) => {
                var top = document.getElementById('topnav');
                if (top.classList.contains('responsive')) {
                    top.classList.remove('responsive');
                }
                else {
                    top.classList.add('responsive');
                }
            });
            nav.append(a);
            
            navbar_logged_in(Global.user.valid);

            if (img) {
                img.src = Global.config.logo;
            }
            resolve();
        });
    });
}

function navbar_logged_in(logged_in) {
    let element = document.getElementById('log-in-out');
    if( is_valid(element )) {
        element.innerText = logged_in ? 'Logga ut' : 'Logga in';
    }
}

function navbar_rename_item(id, title) {
    let navbar = document.querySelector('nav');
    for (let i = 0; i < navbar.children.length; i++) {
        let item = navbar.children[i];
        if (item.id === `${id}`) {
            item.innerHTML = title;
            break;
        }
    }
}

function update_navbar() {
    let nav = document.querySelector('nav');
    remove_childs(nav);
    load_navbar();
}

