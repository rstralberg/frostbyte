

function upload_file(caption, types, page_id, onSuccess) {

    iform(caption, Lexer.UPLOAD, [
        { name: 'method', value: 'POST' },
        { name: 'enctype', value: 'multipart/form-data' }], [
        new iParam('upload-title', 'text', '', '', [], null),
        new iParam('upload-file', 'file', Lexer.UPLOAD, '', [], null)
    ], (values) => {
        let file = iform_get(values,'upload-file');
        let title = iform_get(values, 'upload-title');
        if (file ) {

            let formData = new FormData();
            formData.append('file', file);
            formData.append('page_id', page_id);

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    let response = JSON.parse(xhr.response);
                    if (response.success) {
                        onSuccess(  {'title':title,'url':response.url}  );
                    }
                }
            }
            xhr.open('POST', 'php/upload.php', false);
            xhr.send(formData);
        }
    });
}

