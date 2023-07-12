/*
field = {
    type: string = 'list'
    name: string, ett namn som fungerar som id
    label: listans beskriving
    items: en lista med värden { value: ett id för värdet, text: som visas i listan }
    selected: det värdet som ska visas först eller null
    rows: integer, (optional, default = 1)
    dclick: callback (optional) för dubbelklick på en rad 
    drag: callback (optional) när en rad dragits till ny plats
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)

    Notering:
    dklick returnerar { opt: field, id: värdet på det som klickats på, pos: index i listan }
    listener returnerar det fält som valts
    drag returnerar { id: värdet, from: gammal plats i listan, to: ny plats i listan }

*/


var selectedOption = null;
var dragIndex = 0;
var oldIndex = 0;

function create_list(field, map) {

    let base = create_base('select', field, map);

    
    map.set(field.name, is_valid(field.selected) ? field.selected : field.items[0].value);

    base.inp.addEventListener('mousedown', (e) => {
        console.log( 'mousedown');
        if (e.target.tagName === "OPTION") {
            selectedOption = e.target;
            dragIndex = Array.from(base.inp.options).indexOf(selectedOption);
            oldIndex = dragIndex;
        }
    });
    base.inp.addEventListener("mousemove", function (e) {
        if (selectedOption) {
            e.preventDefault();

            let hoverIndex = Array.from(base.inp.options).indexOf(e.target);
            if (hoverIndex > dragIndex) {
                base.inp.insertBefore(selectedOption, base.inp.options[hoverIndex + 1]);
            } else if (hoverIndex < dragIndex) {
                base.inp.insertBefore(selectedOption, base.inp.options[hoverIndex]);
            }
            dragIndex = Array.from(base.inp.options).indexOf(selectedOption);
        }
    });

    base.inp.addEventListener("mouseup", function (e) {
        console.log( 'mouseup');
        if (field.draglistener) field.draglistener({ id:selectedOption.value, from:oldIndex, to:dragIndex });
        selectedOption = null;
        dragIndex = 0;
    });

    if (is_valid(field.rows)) {
        base.inp.size = field.rows;
    }
    if (is_valid(field.width) )
    {
        base.inp.style.width = field.width;
    }
    for (let i = 0; i < field.items.length; i++) {
        let opt = field.items[i];
        
        let option = document.createElement('option');
        option.classList.add('ioption');
        if (field.selected && opt.value === field.selected) {
            option.selected = true;
        }
        option.value = opt.value;
        option.innerHTML = opt.text;
        if (is_valid(opt.opt)) {
            option.setAttribute('data-opt', `${opt.opt}`);
        }
        if( is_valid(opt.dclick )) {
            option.addEventListener( 'dblclick', (e) => {
                opt.dclick({ field:opt, id:e.target.value, pos:Array.from(base.inp.options).indexOf(e.target)} );
            });
         }

        base.inp.appendChild(option);
    }

    base.inp.addEventListener('change', (e) => {
        let target = e.target;
        if (typeof target.options === 'undefined') {
            target = e.target.parentElement;
        }
        if (target.selectedIndex != -1) {
            field.value = target.options[target.selectedIndex].value;
            field.text = target.options[target.selectedIndex].innerText;
            field.opt = target.options[target.selectedIndex].getAttribute('data-opt');
            map.set(field.name, target.options[target.selectedIndex].value);
            if (field.listener) field.listener(field);
        }
    });




    return base.div;
}


