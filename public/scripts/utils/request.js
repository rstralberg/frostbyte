
function request(reqtype, reqargs, reqhandler, wait = true) {

    let sendargs = '?req=' + reqtype;
    if (reqargs) {
        for( let i=0; i < reqargs.length; i++ ) {
            sendargs += '&' + reqargs[i].key + '=' + reqargs[i].value;
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'php/request_handler.php' + sendargs, !wait);
    xhr.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if( reqhandler ) reqhandler(xhr.response);
            return;
        }
    }
    xhr.send();
}


