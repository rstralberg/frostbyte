
function create_left(div, block, onselected) {

    let left = document.createElement('div');
    left.classList.add('left');
    left.style.width = block.divide + '%';
    left.style.height = 'inherit';
    window[`create_${block.left.type}_block`](left, block.left);
    div.appendChild(left);

    left.addEventListener('mousedown', (ev) => {
        onselected(ev.target);
    }, true);
}

