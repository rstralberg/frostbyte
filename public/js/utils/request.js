
function request(func, reqargs) {
    
    let reqbody = JSON.stringify({ func: func, args: reqargs });
    console.log( `request(${reqbody})`);
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/request.php', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    try {
        xhr.send(reqbody);
        if( xhr.status != 200 ) {
            alert(`Error ${xhr.status}: ${xhr.statusText}`);
        }
        else {
            return JSON.parse(JSON.parse(xhr.response));
        }
    }
    catch(err) {
        alert(`Error ${err.message}`)
    }
}


