// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Upload a file to server 
// - se public/php/req.php
// - se /php/reply/upload.php

async function upload(title, file, page_id ) {

    verify_object(title, 'string');
    verify_object(file, 'object');
    verify_object(page_id, 'number');

    const form_data = new FormData();
    form_data.append('file', file);
    form_data.append('title', title);
    form_data.append('page', page_id)

    return new Promise(function (resolve, reject) {
        try {
            fetch('php/upload.php', {
                method: 'POST',
                body: form_data,
                headers: new Headers({'content-type': 'application/json'}),
                mode: 'no-cors'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resolve(data.data);
                } else {
                    reject(`Error: upload ${file} returned  ${data.data} `);
                }
                })
                .catch(error => {
                    reject(`Error: upload ${error}`);
                });
        }
        catch (error) {
            reject(`Exception in upload: ${error}`)
        }
    });
}


