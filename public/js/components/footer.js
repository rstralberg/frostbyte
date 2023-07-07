
function load_footer() {
    let container = document.querySelector('footer');
    container.innerText = `${html_decode(Config.siteowner)}. All rights reserverd ${new Date().getFullYear()}`;
}
