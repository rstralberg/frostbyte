// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Upload a file to server 
// - se public/php/upload.php



function upload_file(title, file, page, on_success) {

    if (file) {

        let formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('page', page);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'php/upload.php', false);
        try {
            xhr.send(formData);
            if (xhr.status != 200) {
                console.error(`Error ${xhr.status}: ${xhr.statusText}`);
            }
            else {
                let resp = JSON.parse(xhr.response);
                if( resp.success ) {
                    on_success(resp.data);
                }
                else {
                    console.error(`Error ${resp.data}`);
                }
            }
        }
        catch (err) {
            console.error(`Error ${err.message}`);
        }

    }
}


