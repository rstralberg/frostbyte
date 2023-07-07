
function color_select(id,title, height) {

    let div = document.createElement('div');
    div.style.display = 'grid';

    let label = document.createElement('label');
    label.for = id;
    label.innerText = title;
    label.style.height = height + 'px'
    label.style.lineHeight = height+ 'px';
    div.appendChild(label);
    
    let color = document.createElement('input');
    color.type = 'color';
    color.name = id;
    color.style.height = height + 'px;'
    div.appendChild(color);
    
    return { container:div, input:color };
}