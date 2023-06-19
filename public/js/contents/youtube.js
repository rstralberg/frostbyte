
// function load_youtube(field_element, content) {

//     let url = content.url;
//     let shadow = content.shadow === 'true';
//     let title = content.title;

//     let iframe = document.createElement('iframe');
//     iframe.setAttribute('src', `https://www.youtube.com/embed/${url}`);
//     iframe.setAttribute('title', html_decode(title));
//     iframe.setAttribute('frameborder', '0');
//     iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
//     iframe.setAttribute('allowfullscreen', 'true');
    

//     if (shadow) {
//         iframe.classList.add('shadow');
//     }
//     else {
//         iframe.classList.remove('shadow');
//     }
//     field_element.appendChild( iframe);
// }

// function create_youtube(field_element) {

//     var section_element = Global.selected;
//     var section_id = parse_section_id(section_element.id);
//     if (is_valid(field_element)) {

//         create_form('Youtube', 'Skapa', [
//             {
//                 type: FormType.Text,
//                 name: 'link',
//                 label: 'Youtube länk',
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
//                         url: extract_youtube_track(resolve['link']),
//                         title: resolve['title'],
//                         shadows: resolve['shadow']
//                     };

//                     sql_insert('field', ['section_id', 'index', 'type', 'content'
//                     ], [
//                         section_id, section_element.children.length,
//                         sql(FieldType.Youtube), sql(JSON.stringify(content))
//                     ]
//                     ).then(
//                         (resolve) => {
//                             load_field(section_element, parseInt(resolve));
//                         });

//                 });
//     }
// }

// async function save_youtube() {
    
// }


// function select_youtube(field_element) {

// }

// function parse_youtube(content) {
//     return content;
// }

// function collect_youtube(field_element) {
//     return {

//     };
// }

// function on_youtube_resize(div, height) {
//     console.log(`on_youtube_resize(${height})`);
// }
// // SPECIFIKA FUNKTIONER
// // -------------------------------------------------
// // Funktioner som inte tillhör det Generella gränssnittet
// // och är specifika för just detta  

// function extract_youtube_track(url) {
//     let words = url.split('/');
//     if (words && words.length > 0)
//         return words[words.length - 1];
//     else
//         return url;
// }

class Youtube {
 
    constructor(id=false) {
    }

}