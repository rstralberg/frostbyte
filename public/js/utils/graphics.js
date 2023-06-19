
const DRAW_IMAGE_SHADOW_SPACE = 46;

function draw_image(container, img, shadow = true, title = null, title_align = 'center') {

    title = !is_valid(title) ? null : title;
    title = title && title.length===0? null : title;

    let fig = document.createElement('figure');
    
    let caption = document.createElement('figcaption');
    caption.innerText = title === null ? '' : title;
    
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight-DRAW_IMAGE_SHADOW_SPACE;

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
    if( shadow ) {
        img.classList.add('shadow');
    }

    fig.appendChild(img);
    fig.appendChild(caption);
    container.appendChild(fig);
}

