
function load_image_to_div(div,url, title, shadow, size) {

    div.classList.add('image');

    let img = document.createElement('img');
    img.addEventListener('load', (e)=> {

        let canvas = document.createElement('canvas');
        div.appendChild(canvas);

        
        // let h =  ((img.height + ((shadow?1:0)*4))/100) * size;
        div.style.height = size + 'px';
        div.style.marginBottom = (shadow ? 32 : 0) + 'px';
    
        let extra = shadow ? 35 : 0;
        let dim = scaling(div.clientWidth, div.clientHeight - extra, img.width, img.height);

        canvas.setAttribute('width', dim.w + 'px');
        canvas.setAttribute('height', dim.h + 'px');

        if (shadow) {
            canvas.classList.add('shadow');
        }

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = '14px Georgia';

        ctx.fillStyle = '#000000';
        ctx.fillText(title,8, canvas.height-2);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(title,5, canvas.height-4);
    });
    img.src = url;
}

