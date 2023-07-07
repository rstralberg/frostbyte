/*
field = {
    type: string = 'image'
    name: string, ett namn som fungerar som id
    label: fältets beskriving
    url: address till bilden
    size: önskad storlek
    title: titel på bilden
    required: boolean (optional, default = false)
    readonly: boolean (optional, default = false)
    listener: callback (optional, default = null)
*/


function create_image(field, map) {

    let base = create_base('input', field, map);
    base.inp.type = 'file';

    load_image_to_div(base.div, field.url, field.size);

    base.inp.accept = 'image/png, image/jpeg';
    base.inp.addEventListener('change', (e) => {

        if (is_valid(e.target.files) && is_valid(e.target.files[0])) {
            var file = e.target.files[0];
            resize_image(file, Global.MAX_IMAGE_SIZE)
                .then(
                    (resized_image) => {
                        upload(file.name, resized_image, Page.id)
                            .then(
                                (resolve) => {
                                    load_image_to_div(base.div, resolve, field.size);
                                    map.set(field.name, resolve);
                                    if (field.listener) field.listener(e);
                                });

                    });
        }
    });

    function load_image_to_div(div, url, size) {

        div.classList.add('image');
        div.style.width = `${size}px`;
        div.style.height = `${size}px`;
        div.style.textAlign = 'center';
        div.style.margin = '6px';

        let img = document.createElement('img');
        img.addEventListener('load', (e) => {
            draw_image(div, img);
        });
        img.src = url;
    }
    return base.div;

}


