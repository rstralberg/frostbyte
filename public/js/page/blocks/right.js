
function create_right(div, block, onselected ) {

    let right = document.createElement('div');
    right.classList.add('right');
    right.style.width = 'inherit';
    right.style.height = 'inherit';
    right.addEventListener('mousedown', (ev) => {
        onselected(ev.target);
    })
    div.appendChild(right);
    window[`create_${block.right.type}_block`](right, block.right);
}

