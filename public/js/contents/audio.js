
// function load_audio(container, section_id) {

//     verify_object(container, 'object');
//     verify_object(section_id, 'number');
//     sql_select(SectionType.audio, ['*'], `section_id=${section_id}`).then(
//         (recs) => {
//             let rec = recs[0];
//             if (is_valid(rec)) {
//                 verify_object(rec, 'object');
//                 verify_object(rec.url, 'string');
//                 verify_object(rec.shadow, 'string');
//                 verify_object(rec.title, 'string');
//                 // id
//                 // section_id
//                 // align
//                 // url
//                 // title
//                 // shadow
//                 let shadow = sql(rec.shadow);
//                 let title = rec.title;

//                 let audio = document.createElement('audio');
//                 audio.setAttribute('controls', '');
//                 audio.id = 'audio-player';
//                 audio.style.width = '100%';
//                 if (shadow) {
//                     audio.classList.add('shadow');
//                 }

//                 let source = document.createElement('source');
//                 source.type = 'audio/mpeg';
//                 source.src = decodeURIComponent(rec.url);
//                 audio.appendChild(source);
//                 container.appendChild(audio);

//                 let titlediv = document.createElement('div');
//                 titlediv.innerHTML = title;
//                 titlediv.style.textAlign = 'center';
//                 titlediv.style.fontSize = 'small';
//                 titlediv.style.fontStyle = 'italic';
//                 container.appendChild(titlediv);
//             }
//         });
// }

// function create_audio(section_element) {

//     create_form('Ljud', 'Spara', [
//         {
//             type: FormType.File,
//             name: 'url',
//             label: 'Ljudfil',
//             value: '',
//             title: ''
//         },
//         {
//             type: FormType.Text,
//             name: 'title',
//             label: 'Titel',
//             value: ''
//         }]).then(
//             (resovle) => {
//                 let section = Global.selected;
//                 var section_id = parse_section_id(section.id);
//                 sql_insert('audio', [
//                     'section_id', 'align', 'url', 'title', 'shadow'], [
//                     section_id, sql('center'), sql(encodeURIComponent(resovle['url'])),
//                     sql(resovle['title']), sql(true)]).then(
//                         (content_id) => {
//                             sql_update('section',
//                                 ['content_id'],
//                                 [content_id],
//                                 `id=${section_id}`)
//                                 .then(
//                                     (_resolve) => {
//                                         load_section(document.querySelector('main'), section_id);
//                                     });
//                         });
//             });
// }

// async function save_audio() {
//     verify_object(Global.selected, 'object');
//     verify_object(Global.selected.querySelector('div'), 'object');
//     verify_object(Global.selected.querySelector('source'), 'object');
//     verify_object(Global.selected.querySelector('audio'), 'object');
//     verify_object(Global.selected.getAttribute('data-content-id'), 'string');

//     let align = Global.selected.style.textAlign;
//     let title = encodeURIComponent(Global.selected.querySelector('div').innerHTML);
//     let url = Global.selected.querySelector('source').src;
//     let shadow = Global.selected.querySelector('source').classList.contains('shadow');
//     let id = parseInt(Global.selected.getAttribute('data-content-id'));

//     return sql_update(SectionType.audio, [
//         'align', 'url',
//         'title', 'shadow'], [
//         sql(align), sql(encodeURIComponent(url)),
//         sql(title), sql(shadow)],
//         `id=${id}`);
// }

// function select_audio(section_element) {
//     if (!is_valid_user(Global.user)) return;

//     let menu = show_tools();

//     let fieldset = document.createElement('fieldset');

//     let legend = document.createElement('legend');
//     legend.innerText = 'Text';
//     fieldset.appendChild(legend);
//     menu.appendChild(fieldset);

//     add_field_tool(fieldset, 'Titel', on_title);
//     add_field_tool(fieldset, 'Skugga', on_shadow);
//     add_field_tool(fieldset, 'Vänster', on_left);
//     add_field_tool(fieldset, 'Mitten', on_center);
//     add_field_tool(fieldset, 'Höger', on_right);

//     function on_title() {
//         let title = encodeURIComponent(Global.selected.querySelector('div').innerText);
//         let id = parseInt(Global.selected.getAttribute('data-content-id'));
//         create_form('Titel','Spara', [
//             {
//                 type: FormType.Text,
//                 name: 'title',
//                 label: 'Ny titel',
//                 value: title
//             }
//         ]).then(
//             (resolve) => {
//                 sql_update('audio', ['title'], [sql(resolve['title'])], `id=${id}`).then(
//                     (_resolve=>{
//                         Global.selected.querySelector('div').innerHTML = resolve['title'];
//                     })
//                 )
//             }
//         )
//     }
//     function on_shadow() {

//     }
//     function on_left() {

//     }
//     function on_center() {

//     }
//     function on_right() {

//     }
// }

// function on_audio_resize(div, height) {
// }

// // SPECIFIKA FUNKTIONER
// // -------------------------------------------------
// // Funktioner som inte tillhör det Generella gränssnittet
// // och är specifika för just detta  

class Audio {

    constructor(id=false) {
    }
    
}