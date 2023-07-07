//  id: int
//  name: string
//  types: json 
//  app: json
//  top: json
//  nav: json
//  page: json
//  footer: json
//  buttons: json
//  links: json
//  headers: json
//  input: json
//  blocks: json
//  quote: json
//  code: json

function sql_load_theme(name) {

    let rows = sql_select('select * from theme where `name`=' + name);
    if( rows.lenght > 0) {
        let theme = rows[0];
        theme.id = parseInt(theme.id);
        theme.types = JSON.parse(theme.types);
        theme.app = JSON.parse(theme.app);
        theme.top = JSON.parse(theme.top);
        theme.nav = JSON.parse(theme.nav);
        theme.page = JSON.parse(theme.page);
        theme.footer = JSON.parse(theme.footer);
        theme.buttons = JSON.parse(theme.buttons);
        theme.links = JSON.parse(theme.links);
        theme.headers = JSON.parse(theme.headers);
        theme.input = JSON.parse(theme.input);
        theme.blocks = JSON.parse(theme.blocks);
        theme.quote = JSON.parse(theme.quote);
        theme.code = JSON.parse(theme.code);
        return theme;
    }
    else {
        return null;
    }
}

function sql_add_theme(name) {
    sql_insert(`insert into theme set 
                "name" : ${name}",
                "types" : "{\"app\":\"html\",\"top\":\"nav\",\"nav\":\".nav\",\"page\":\"main\",\"footer\":\"footer\",\"buttons\":\"button\",\"links\":\"a\",\"headers\":\"header\",\"input\":\"input\",\"blocks\":\"section\",\"quote\":\"blockquote\",\"code\":\"code\"}",
                "app" : "{\"font_app\":\"Arial\",\"fsize_app\":\"1.0em\",\"width_app\":\"80vw\",\"bg_app\":\"rgb(32,32,32)\",\"fg_app\":\"rgb(255,255,255)\"}",
                "top" : "{\"bg_top\":\"rgb(0,0,0)\",\"border_top\":\"none\",\"radius_top\":\"0px\",\"shadow_top\":\"false\",\"height_top\":\"8vh\"}",
                "nav" : "{\"bg_nav\":\"rgb(0,0,0)\",\"fg_nav\":\"rgb(255,255,255)\",\"border_nav\":\"none\",\"hi_bg_nav\":\"rgb(255,70,0)\",\"hi_fg_nav\":\"rgb(0,0,0)\",\"hi_border_nav\":\"2px solid rgb(255,255,255)\",\"bold_nav\":\"bold\",\"fsize_nav\":\"1.2em\",\"shadow_nav\":\"false\",\"radius_nav\":\"4px\"}",
                "page" : "{\"bg_page\":\"rgb(32,32,32)\",\"fg_page\":\"rgb(255,255,255)\",\"border_page\":\"none\",\"radius_page\":\"0px\",\"shadow_page\":\"false\"}",
                "footer" : "{\"bg_footer\":\"rgb(0,0,0)\",\"fg_footer\":\"rgb(255,255,255)\",\"border_footer\":\"none\",\"radius_footer\":\"0px\",\"bold_footer\":\"normal\",\"fsize_footer\":\"1.0em\",\"align_footer\":\"center\",\"shadow_footer\":\"false\",\"height_footer\":\"2vh\"}",
                "buttons" : "{\"bg_btn\":\"rgb(0,0,0)\",\"fg_btn\":\"rgb(255,255,255)\",\"border_btn\":\"2px solid rgb(255,255,255)\",\"hi_bg_btn\":\"rgb(255,70,0)\",\"hi_fg_btn\":\"rgb(0,0,0)\",\"hi_border_btn\":\"2px solid rbg(0,255,255)\",\"fsize_btn\":\"1.1em\",\"bold_btn\":\"bold\",\"shadow_btn\":\"false\",\"radius_btn\":\"4px\"}",
                "links" : "{\"fg_link\":\"rgb(0,255,255)\",\"hi_fg_link\":\"rgb(255,255,255)\",\"bold_link\":\"bold\"}",
                "headers" : "{\"fg_title\":\"rgb(255,70,0)\",\"fsize_title\":\"1.8em\",\"bold_title\":\"bold\",\"align_title\":\"left\",\"fg_h\":\"rgb(255,70,0)\",\"bold_h\":\"bold\",\"align_h\":\"left\",\"fsize_h1\":null,\"fsize_h2\":null,\"fsize_h3\":null}",
                "input" : "{\"bg_inp\":\"rgb(200,200,200)\",\"fg_inp\":\"rgb(64,64,64)\",\"hi_bg_inp\":\"rgb(255,255,255)\",\"hi_fg_inp\":\"rgb(0,0,0)\",\"border_inp\":\"2px solid rgb(0,0,0)\",\"radius_inp\":\"4px\",\"shadow_inp\":\"false\",\"fsize_inp\":\"1.0em\"}",
                "blocks" : "{\"bg_block\":\"rgb(32,32,32)\",\"fg_block\":\"rgb(255,255,255)\",\"border_block\":\"none\",\"radius_block\":\"0px\",\"shadow_block\":\"false\",\"fsize_block\":\"1.0em\"}",
                "quote" : "{\"bg_quote\":\"rgb(32,32,64)\",\"fg_quote\":\"rgb(200,200,255)\",\"fstyle_quote\":\"italic\"}",
                "code" : "{\"bg_code\":\"rgb(0,32,0)\",\"fg_code\":\"rgb(255,127,0)\",\"font_code\":\"Courier New, Courier, monospace\",\"fstyle_code\":\"normal\"}`);
}

function sql_update_theme_app(id,app) {
    sql_update(`update theme set app="${JSON.stringify(app)}" where id=${id}`);
}

function sql_update_theme_top(id,top) {
    sql_update(`update theme set top="${JSON.stringify(top)}" where id=${id}`);
}

function sql_update_theme_nav(id,nav) {
    sql_update(`update theme set nav="${JSON.stringify(nav)}" where id=${id}`);
}

function sql_update_theme_page(id,page) {
    sql_update(`update theme set page="${JSON.stringify(page)}" where id=${id}`);
}

function sql_update_theme_footer(id,footer) {
    sql_update(`update theme set footer="${JSON.stringify(footer)}" where id=${id}`);
}

function sql_update_theme_buttons(id,buttons) {
    sql_update(`update theme set buttons="${JSON.stringify(buttons)}" where id=${id}`);
}

function sql_update_theme_links(id,links) {
    sql_update(`update theme set links="${JSON.stringify(links)}" where id=${id}`);
}

function sql_update_theme_headers(id,headers) {
    sql_update(`update theme set headers="${JSON.stringify(headers)}" where id=${id}`);
}

function sql_update_theme_input(id,input) {
    sql_update(`update theme set input="${JSON.stringify(input)}" where id=${id}`);
}

function sql_update_theme_blocks(id,blocks) {
    sql_update(`update theme set blocks="${JSON.stringify(blocks)}" where id=${id}`);
}

function sql_update_theme_quote(id,quote) {
    sql_update(`update theme set quote="${JSON.stringify(quote)}" where id=${id}`);
}

function sql_update_theme_code(id,code) {
    sql_update(`update theme set code="${JSON.stringify(code)}" where id=${id}`);
}

