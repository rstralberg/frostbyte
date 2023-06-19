
// function load_vimeo(field_element, content) {

//     let iframe = document.createElement('iframe');
//     iframe.classList.add('section-vimeo-video');
//     iframe.setAttribute('src', `https://player.vimeo.com/video/${content.url}?h=7a4daebb0c&byline=0`);
//     iframe.setAttribute('frameborder', '0');
//     iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
//     iframe.setAttribute('allowfullscreen', 'true');
//     iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
//     if (content.shadows === true) {
//         iframe.classList.add('shadow');
//     }
//     field_element.appendChild(iframe);

//     let title = document.createElement('div');
//     title.classList.add('media-title');
//     title.innerHTML = content.title;
//     field_element.appendChild(title);

//     let script = document.createElement('script');
//     script.setAttribute('src', 'https://player.vimeo.com/api/player.js');
//     field_element.appendChild(script);
// }


// function create_vimeo(field_element) {

//     var section_element = Global.selected;
//     var section_id = parse_section_id(section_element.id);
//     if (is_valid(field_element)) {

//         create_form( 'Vimeo', 'Skapa', [
//             {
//                 type: FormType.Text,
//                 name: 'link',
//                 label: 'Vimeo länk',
//                 value: ''
//             },
//             {
//                 type: FormType.Text,
//                 name: 'title',
//                 label: 'Titel',
//                 value: ''
//             },
//             {
//                 type: FormType.Checkbox,
//                 name: 'shadow',
//                 label: 'Skuggad',
//                 value: true
//             }]).then(
//                 (resolve) => {
//                     let content = {
//                         url: extract_vimeo_track(resolve['link']),
//                         title: resolve['title'],
//                         shadows: resolve['shadow']
//                     };

//                     sql_insert('field', ['section_id', 'index', 'type', 'content'
//                     ], [
//                         section_id, section_element.children.length,
//                         sql(FieldType.Vimeo), sql(JSON.stringify(content))
//                     ]
//                     ).then(
//                         (resolve) => {
//                             load_field(section_element, parseInt(resolve));
//                         });
//                 }
//             )

//         }
//     }

//     async function save_vimeo() {

//     }

//     function select_vimeo(field_element) {
//     }

//     function parse_vimeo(content) {
//         return content;
//     }

//     function collect_vimeo(field_element) {
//         return {

//         };    
//     }

//     function on_vimeo_resize(div, height) {
//         console.log(`on_vimeo_resize(${height})`);
//     }

//     // SPECIFIKA FUNKTIONER
//     // -------------------------------------------------
//     // Funktioner som inte tillhör det Generella gränssnittet
//     // och är specifika för just detta  

//     function extract_vimeo_track(url) {
//         let words = url.split('/');
//         if (words && words.length > 0) {
//             for (let i = 0; i < words.length; i++) {
//                 if (words[i] == 'vimeo.com' && i < words.length - 1) {
//                     return words[i + 1];

//                 }
//             }
//         }
//         return url;
//     }

class Vimeo {

    constructor(id=false) {

    }

}