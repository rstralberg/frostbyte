
function fill_footer(footer) {
    
    let config = load_config();
    footer.innerText = 
        html_decode(config.siteowner) + 
        '. All rights reserverd ' + new Date().getFullYear();

}