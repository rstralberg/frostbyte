/*  
field = {
    type: string = 'text'
    name: string, ett namna som fungerar som id
    value: string, (optional) en starttext
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

var selectedOption = null;
var dragIndex = 0;
var oldIndex = 0;
var dragStart = 0;

function create_tree(field, map) {

    function fill(field) {
        remove_childs(base.inp);
        for (let i = 0; i < field.items.length; i++) {
            let item = field.items[i];

            let li = document.createElement('li');
            li.draggable = true;
            li.value = item.value;
            li.innerText = item.text;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                map.set(field.name, e.target);
                if (is_valid(field.listener)) {
                    field.listener(e.target);
                }
            });

            base.inp.appendChild(li);

            if (is_valid(item.items)) {

                let ul = document.createElement('ul');
                ul.draggable = true;
                ul.id = `ul-${item.value}`;
                ul.classList.add('inested');

                let sp = document.createElement('span');
                sp.classList.add('icaret');
                sp.innerText = li.innerText;
                sp.value = item.value;
                sp.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.target.parentElement.querySelector(".inested").classList.toggle('iactive');
                    e.target.classList.toggle('icaret-down');
                    map.set(field.name, e.target);
                    if (is_valid(field.listener)) {
                        field.listener(e.target);
                    }
                });

                li.innerText = '';
                li.appendChild(sp)
                for (let j = 0; j < item.items.length; j++) {

                    let sub = item.items[j];

                    let li = document.createElement('li');
                    li.draggable = true;
                    li.innerText = sub.text;
                    li.value = sub.value;
                    li.addEventListener('click', (e) => {
                        e.preventDefault();
                        map.set(field.name, e.target);
                        if (is_valid(field.listener)) {
                            field.listener(e.target);
                        }
                    });

                    ul.appendChild(li);
                }
                li.appendChild(ul);
            }
        }
        if (is_valid(field.drag)) {
            add_drag_and_drop(base.inp);
        }

    }


    function add_drag_and_drop(list) {

        var draggables = list.querySelectorAll('[draggable="true"]');
        draggables.forEach(element => {
            element.addEventListener('dragstart', dragStart);
            element.addEventListener('dragover', dragOver);
            element.addEventListener('drop', drop);

        });

        function dragStart(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
        }

        function dragOver(event) {
            event.preventDefault();
        }

        function drop(event) {
            event.preventDefault();

            var target = event.target;
            var source = document.getElementById(event.dataTransfer.getData('text/plain'));

            try {
                let target_index = 0;
                for (target_index = 0; target_index < list.childElementCount; target_index++) {
                    if (list.children[target_index].id === target.id) {
                        break;
                    }
                }
                let source_index = 0;
                for (source_index = 0; source_index < list.childElementCount; source_index++) {
                    if (list.children[source_index].id === source.id) {
                        break;
                    }
                }
                if (is_valid(source.parentElement) && source.parentElement.tagName === 'UL') {
                }

                let s = field.items[source_index];
                field.items.splice(source_index, 1);
                field.items.splice(target_index, 0, s);

                fill(field);
            } catch (err) {
                logg(err, true);
            }
        }

    }

    let base = create_base('ul', field, map);
    base.div.classList.remove('icol-40-60');
    fill(field);
    return base.div;

}
