
// function load_spotify(container, section_id) {

//         verify_object(container, 'object');
//         verify_object(section_id, 'number');
//         sql_select(SectionType.spotify, ['*'], `section_id=${section_id}`).then(
//             (recs) => {
//                 let rec = recs[0];
//                 container.style.textAlign = rec.align;
//                 container.innerHTML = decodeURIComponent(rec.text);
//                 container.setAttribute('data-type-id',rec.id )
//             });

// }

// function create_spotify(field_element) {
//     let pagename = Global.page.name;
//     if (is_valid(pagename)) {
//         create_form('Spotify', 'Skapa', [
//             {
//                 type: FormType.Text,
//                 name: 'link',
//                 label: 'Spotify länk',
//                 value: '?'
//             },
//             {
//                 type: FormType.Text,
//                 name: 'title',
//                 label: 'Titel',
//                 value: '?'
//             }
//         ])
//             .then(
//                 (resolve) => {
//                     var sectiondiv = Global.selected;
//                     let section_id = parseInt(sectiondiv.id.slice('section-'.length));

//                     let link = resolve('link');
//                     link = extract_spotify_track(link);

//                     let title = resolve('title');
//                     let div = document.createElement('div');
//                     div.classList.add('field');

//                     let iframe = document.createElement('iframe');
//                     div.appendChild(iframe);

//                     iframe.setAttribute('src', htmlDecode('https://open.spotify.com/embed/track/' + link + '?utm_source=generator'));
//                     iframe.setAttribute('width', '100%');
//                     iframe.setAttribute('height', '352');
//                     iframe.setAttribute('frameborder', '0');
//                     iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
//                     iframe.setAttribute('loading', 'lazy');

//                     let content = {
//                         url: link,
//                         title: title
//                     };
//                     let index = 0;
//                     sql_insert('field', ['section_id', 'index', 'type', 'content'],
//                         [section_id, index, 'spotify', sql(JSON.stringify(content))])
//                         .then(
//                             (resolve) => {
//                                 sectiondiv.appendChild(div);
//                             });

//                 });
//     }
// }

// async function save_spotify() {
    
// }

// function on_spotify_resize(div, height) {
//     console.log(`on_spotify_resize(${height})`);
// }
// function select_spotify(field_element) {

// }

// function parse_spotify(content) {
//     return content;
// }

// function collect_spotify(dfield_elementiv) {
//     return {

//     };   
// }


// // SPECIFIKA FUNKTIONER
// // -------------------------------------------------
// // Funktioner som inte tillhör det Generella gränssnittet
// // och är specifika för just detta  

// function extract_spotify_track(url) {
//     let pos = url.search('track/') + 'track/'.length;
//     return url.slice(pos);
// }

class Spotify {
 
    constructor(id=false) {
    }

}
