
function create_image(id, title, url, shadow, size) {

    let div = document.createElement('div');
    div.classList.add('image');
    div.style.height = `${size}px`;
    div.style.width = `${size}px`;
    div.id = id;

    let canvas = document.createElement('canvas');
    canvas.classList.add(div.classList[0]);
    div.appendChild(canvas);

    canvas.addEventListener('dblclick', () => {
        show_fullsize(url);
    });

    load_image(div, canvas, title, url, shadow );
    return div;
}

function load_image(div, canvas, title, url, shadow) {
    let img = document.createElement('img');
    img.addEventListener('load', () => {

        let extra = shadow ? 35 : 0;
        let dim = scaling(div.clientWidth, div.clientHeight - extra, img.width, img.height);

        canvas.setAttribute('width', dim.w + 'px');
        canvas.setAttribute('height', dim.h + 'px');

        if (shadow === 'true') {
            canvas.classList.add('shadow');
        }
        else {
            canvas.classList.remove('shadow');
        }
        
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = '16px Ariel';

        ctx.fillStyle = '#000000';
        ctx.fillText(title,8, canvas.height-2);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(title,5, canvas.height-4);
    });
    img.src = url;   
}

