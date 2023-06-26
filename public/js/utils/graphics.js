
const DRAW_IMAGE_SHADOW_SPACE = 46;

function draw_image(container, img, shadow = true, title = null, title_align = 'center') {

    title = !is_valid(title) ? null : title;
    title = title && title.length === 0 ? null : title;

    let fig = document.createElement('figure');

    let caption = document.createElement('figcaption');
    caption.innerText = title === null ? '' : title;

    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight - DRAW_IMAGE_SHADOW_SPACE;

    let imgWidth = img.width;
    let imgHeight = img.height;

    let widthRatio = containerWidth / imgWidth;
    let heightRatio = containerHeight / imgHeight;

    let scale = Math.min(widthRatio, heightRatio);

    let newWidth = imgWidth * scale;
    let newHeight = imgHeight * scale;
    // caption.style.width = newWidth + 'px';

    img.style.width = newWidth + 'px';
    img.style.height = newHeight + 'px';
    if (shadow) {
        img.classList.add('shadow');
    }

    fig.appendChild(img);
    fig.appendChild(caption);
    container.appendChild(fig);
}

function resize_image(file, maxsize) {

    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');

    function dataURItoBlob(dataURI) {
        var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            decodeURIComponent(dataURI.split(',')[1]);
        var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var max = bytes.length;
        var ia = new Uint8Array(max);
        for (var i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };

    function resize() {

        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > maxsize) {
                height *= maxsize / width;
                width = maxsize;
            }
        } else {
            if (height > maxsize) {
                width *= maxsize / height;
                height = maxsize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        var dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    }

    return new Promise(function (ok, no) {

        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }

        reader.onload = (readerEvent) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
};

