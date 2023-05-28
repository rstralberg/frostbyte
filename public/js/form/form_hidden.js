
function create_hidden(id, value) {
    
    let inp = document.createElement('input');
    inp.classList.add('hidden');
    inp.id = id;
    inp.value = value;
    inp.readOnly = true;
    inp.type = 'hidden';
    return inp;
}
