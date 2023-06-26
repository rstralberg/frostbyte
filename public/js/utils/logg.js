
async function logg(msg, cons = false, stack = false) {

    return new Promise(function (resolve, reject) {
        try {
            var err = new Error();
            var reqbody = JSON.stringify({ func: 'logg', req: (stack ? `${err.stack}:${msg}` : msg) });
            if (cons) {
                console.log(msg);
            }
            fetch('php/req.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: reqbody
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resolve(data.data);
                    } else {
                        reject(`Error: logg ${reqbody} returned  ${data.data} `);
                    }
                })
                .catch(error => {
                    reject(`Error: logg ${error} -> ${reqbody}`);
                });
        }
        catch (error) {
            reject(`Exception in logg: ${error}`)
        }
    });
}

function verify_object(obj, type) {
    if (obj === null) {
        logg(`${verify_object.caller}: NULL object`);
    }
    if (typeof obj == 'undefined') {
        logg(`${verify_object.caller}: Undefined object`, true);
    }
    if (typeof obj != type) {
        logg(`${verify_object.caller}: Excepted a ${type} object but got a ${typeof obj}`);
    }
    return obj;
}