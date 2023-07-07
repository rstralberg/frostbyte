
function create_navbar() {

    let navbar = document.querySelector('nav');
    safe_add_class(navbar,'top');
    remove_childs(navbar);

    // Drag navbar links around
    let draggedItem = null;
    navbar.addEventListener('dragstart', function (e) {
        if (e.target.getAttribute('draggable') == 'yes') {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', draggedItem.innerHTML);
        }
    });

    navbar.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    navbar.addEventListener('drop', function (e) {
        if (e.target.getAttribute('draggable') == 'yes') {

            if (e.ctrlKey) {

                let dest = e.target;
                let src = draggedItem;
                let parent = e.target.parentNode;
                let dropcontent = null;
                if (!dest.classList.contains('dropbtn')) {
                    parent.removeChild(dest);
                    parent.removeChild(src);

                    let dropdown = document.createElement('div');
                    dropdown.classList.add('dropdown');
                    dropdown.setAttribute('draggable', 'yes');
                    topnav.appendChild(dropdown);

                    let dropbutton = document.createElement('button');
                    dropbutton.classList.add('dropbtn');
                    dropbutton.setAttribute('draggable', 'yes');
                    dropbutton.innerText = dest.innerText;
                    dropdown.appendChild(dropbutton);

                    dropcontent = document.createElement('div');
                    dropcontent.classList.add('dropdown-content');
                    dropcontent.setAttribute('id', dest.getAttribute('id'));
                    dropcontent.setAttribute('draggable', 'yes');

                    dropdown.appendChild(dropcontent);

                    dropcontent.appendChild(src);
                    parent.appendChild(dropdown);
                }
                else {
                    topnav.removeChild(src);
                    dropcontent = dest.nextSibling;
                    dropcontent.appendChild(src);
                    //dropcontent.setAttribute('id', dest.parentNode.getAttribute('id'));

                }
                update_navbar_sub_positions(dropcontent);
            }
            else {
                if (e.target.classList.contains('topnav')) {
                    e.target.insertBefore(draggedItem, e.target.nextSibling);
                } else {
                    e.target.parentNode.insertBefore(draggedItem, e.target.nextSibling);
                }
                update_navbar_positions();

            }
        }
    });

    // The navbar
    let topnav = document.createElement('div');
    safe_add_class(topnav, 'topnav');
    topnav.id = 'topnav';
    topnav.setAttribute('draggable','yes');
            
    navbar.appendChild(topnav);

    let pages = sql_load_pages(0);
    pages.forEach(page => {
        let pagechilds = sql_load_pages(page.id);
        if (pagechilds) {
            
            let dropdown = document.createElement('div');
            safe_add_class(dropdown, 'dropdown');
            dropdown.setAttribute('draggable','yes');
            topnav.appendChild(dropdown);

            let dropbutton = document.createElement('a');
            safe_add_class(dropbutton, 'nav_item');
            dropbutton.style.lineHeight = '14px';
            dropbutton.setAttribute('draggable','yes');
            dropbutton.innerText = page.title;
            dropdown.appendChild(dropbutton);

            let dropcontent = document.createElement('div');
            safe_add_class(dropcontent, 'dropdown-content');
            dropcontent.id = 'p' + page.id;
            dropdown.appendChild(dropcontent);


            pagechilds.forEach(child => {
                let a = document.createElement('a');
                safe_add_class(a, 'nav_item');
                a.setAttribute('data-page-id', child.id);
                a.setAttribute('data-page-parent_id', child.parent_id);
                a.setAttribute('data-page-author', child.author);
                a.setAttribute('draggable','yes');
                a.id = 'p' + child.id;
                a.href = child.id;
                a.innerText = child.title;
                dropcontent.appendChild(a);

                if( child.id == get_page().id ) {
                    dropbutton.style.border = '2px solid white';
                    dropbutton.style.background = 'orange';
                    dropbutton.style.color = 'black';
                }
    
                });
        }
        else {
            let a = document.createElement('a');
            safe_add_class(a, 'nav');
            safe_add_class(a, 'nav_item');
            a.setAttribute('data-page-id', page.id);
            a.setAttribute('data-page-parent_id', page.parent_id);
            a.setAttribute('data-page-author', page.author);
            a.setAttribute('draggable','yes');
            if(page.id == get_page().id ) {
                a.style.border = '2px solid white';
                a.style.background = 'orange';
                a.style.color = 'black';
            }
            a.href = page.id;
            a.id = 'p' + page.id;
            a.innerText = page.title;
            topnav.appendChild(a);
        }
    });

    let user = get_curuser();
    if (user && user.username.length) {
        let a = document.createElement('a');
        safe_add_class(a, 'nav_item');
        safe_add_class(a, 'navbar-user');

        a.href = '#';
        a.innerText = user.username.toUpperCase();
        a.addEventListener('click', (e) => {
            iform(Lexer.SELECT_WHAT_TO_DO, Lexer.CANCEL, [], [
                new iParam('logout', 'button', Lexer.LOGOUT, '', [], (e) => {
                    set_curuser(null);
                    set_cookie('username', null);
                    window.location = '/' + get_page().id;
                }),
                new iParam('edit', 'button', Lexer.EDIT_ACCOUNT, '', [], (e) => {
                    edit_user(user);
                })]);
        });
        topnav.appendChild(a);

    }

    let a = document.createElement('a');
    safe_add_class(a, 'nav-icon');
    safe_add_class(a, 'icon');
    a.href = 'javascript:void(0);';
    a.innerHTML = '&#9776;';
    a.addEventListener('click', (e) => {
        let x = document.getElementById("topnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    });
    topnav.appendChild(a);

    let shadows = get_style('bar_shadow');
    if (shadows.indexOf('1') < 0) {
        topnav.style.minHeight = (topnav.clientHeight - 16) + 'px';
    }

}

function update_navbar_positions() {
    let navbar = document.getElementById('topnav');
    let pos = 0;
    for (let i = 0; i < navbar.children.length; i++) {
        let item = navbar.children[i];
        if (item.draggable) {
            sql_update_page_pos(item.id.slice(1), pos++);
        }
    }
}

function update_navbar_sub_positions(dropcontent) {

    let parent_id = dropcontent.getAttribute('id').slice(1);
    sql_update_page_parent_id(parent_id,0);

    let pos = 0;
    for (let i = 0; i < dropcontent.children.length; i++) {
        let item = dropcontent.children[i];
        if (item.draggable) {
            let page_id = item.getAttribute('data-page-id');
            let title = item.innerText;
            let author = item.getAttribute('data-page-author');
            sql_update_page(page_id, parent_id, pos, title, author);
        }
    }
}