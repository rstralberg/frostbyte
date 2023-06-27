/*
field = {
    type: string = 'checklist'
    name: string, ett namn som fungerar som id
    label: listans beskriving
    items: en lista med värden { value: ett id för värder, text: som visas i listan, checked: boolean }
    selected: det värdet som ska visas först eller null
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/

function create_checklist(field, map) {

    let base = create_base('div',field, map);
    base.div.removeChild(base.inp);

    base.div.id = `${field.name}-check-container`;

    let ul = document.createElement('ul');
    ul.classList.add('ichecklist');
    ul.id = `${field.name}-check-list`;
    base.div.appendChild(ul);

    for (let i = 0; i < field.items.length; i++) {

        let item = field.items[i];

        let li = document.createElement('li');
        ul.appendChild(li);


        let cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = item.value;
        cb.addEventListener('change', (e) => {
            if (is_valid(field.listener)) {
                field.listener({
                    list: ul,
                    item: li,
                    value: item.value,
                    checked: e.target.checked
                });
            }
        });

        li.appendChild(cb);

        let label = document.createElement('label');
        label.innerText = item.text;

        li.appendChild(label);
    }
    return base.div;
}

