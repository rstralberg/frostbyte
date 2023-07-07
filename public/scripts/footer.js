
function create_footer() {
    let footer = document.querySelector('footer');
    remove_childs(footer);
   
    let i = document.createElement('i');
    i.innerText =  get_config().siteowner + ' ' + new Date().getFullYear() + ' All rights reserved.';        
    footer.appendChild(i);
}


