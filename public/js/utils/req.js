
async function req(func, req) {

    return new Promise((resolve, reject) => {
        try {
            var reqbody = JSON.stringify({ func: func, req: req });
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
                        reject(`Error: req ${reqbody} returned  ${data.data} `);
                    }
                })
                .catch(error => {
                    reject(`Error: req ${error} -> ${reqbody}`);
                });
        }
        catch (error) {
            reject(`Exception in req: ${error}`);
        }
    });
}
