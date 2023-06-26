
// async function sql_insert(table, cols, values) {

//     return new Promise(function (resolve, reject) {
//         try {
//             var query = `insert into \`${table}\` (`;
//             cols.forEach(col => {
//                 query += `\`${col}\`,`;
//             });
//             query = `${query.slice(0, -1)}) values (`;
//             values.forEach(value => {
//                 query += `${value},`;
//             });
//             query = `${query.slice(0, -1)})`;

//             fetch('php/sql.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json;charset=utf-8'
//                 },
//                 body: JSON.stringify({ type: 'insert', query: query })
//             })
//                 // .then(response => {
//                 //     try { 
//                 //         response.json(); 
//                 //     }
//                 //     catch(err) {
//                 //         logg(err);
//                 //         reject(`Error: sql_insert json problem  ${err} `);
//                 //     }})
//                 .then(data => {
//                     data.json().then(data => {
//                         let jdata = JSON.parse(data);
//                         if (jdata.success) {
//                             resolve(jdata.data);
//                         } else {
//                             reject(`Error: sql_insert returned  ${jdata.data} `);
//                         }
//                     });
//                 })
//                 .catch(error => {
//                     reject(`Error: sql_insert ${error}`);
//                 });
//         }
//         catch (error) {
//             let msg = `Exception in sql_insert: ${error} / ${query}`;
//             logg(msg);
//             reject(msg);
//         }
//     });
// }

// async function sql_update(table, cols, values, where) {

//     return new Promise(function (resolve, reject) {
//         try {
//             let query = `update \`${table}\` set `;
//             for (let i = 0; i < cols.length; i++) {
//                 query += `\`${cols[i]}\`=${values[i]},`;
//             }
//             query = `${query.slice(0, -1)} where ${where}`;

//             fetch('php/sql.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json;charset=utf-8'
//                 },
//                 body: JSON.stringify({ type: 'update', query: query })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     let jdata = JSON.parse(data);
//                     if (jdata.success) {
//                         resolve(jdata.data);
//                     } else {
//                         reject(`Error: sql_update returned  ${jdata.data} `);
//                     }
//                 })
//                 .catch(error => {
//                     reject(`Error: sql_update ${error}`);
//                 });
//         }
//         catch (error) {
//             reject(`Exception in sql_update: ${error}`)
//         }
//     });
// }

// async function sql_select(table, cols, where = null) {

//     return new Promise(function (resolve, reject) {
//         try {
//             let query = `select `;
//             for (let i = 0; i < cols.length; i++) {
//                 if (cols[i] === '*') query += '*,';
//                 else query += `\`${cols[i]}\`,`;
//             }
//             query = `${query.slice(0, -1)} from \`${table}\``;
//             if (where) {
//                 query += ` where ${where}`;
//             }

//             fetch('php/sql.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json;charset=utf-8'
//                 },
//                 body: JSON.stringify({ type: 'select', query: query })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     let jdata = JSON.parse(data);
//                     if (jdata.success) {
//                         if (jdata.data.length === 0) {
//                             let msg = `sql_select returned with null result on query "${query}"`;
//                             logg(msg);
//                             reject(msg);
//                         }
//                         else {
//                             resolve(jdata.data);
//                         }
//                     } else {
//                         let msg = `Error: sql_select returned  ${jdata.data} on query "${query}"`;
//                         logg(msg);
//                         reject(msg);
//                     }
//                 })
//                 .catch(error => {
//                     let msg = `Exception: sql_select "${error}"`
//                     logg(msg);
//                     reject(msg);
//                 });
//         }
//         catch (error) {
//             let msg = `Exception: sql_select "${error}"`
//             logg(msg);
//             reject(msg);
//         }
//     });
// }

// async function sql_delete(table, where) {

//     return new Promise(function (resolve, reject) {
//         try {
//             let query = `delete from \`${table}\` where ${where}`;
//             fetch('php/sql.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json;charset=utf-8'
//                 },
//                 body: JSON.stringify({ type: 'delete', query: query })
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     let jdata = JSON.parse(data);
//                     if (jdata.success) {
//                         if (jdata.length === 1)
//                             resolve(jdata.data[0]);
//                         else
//                             resolve(jdata.data);
//                     } else {
//                         reject(`Error: sql_delete returned  ${jdata.data} `);
//                     }
//                 })
//                 .catch(error => {
//                     reject(`Error: sql_delete ${error}`);
//                 });
//         }
//         catch (error) {
//             reject(`Exception in sql_delete: ${error}`)
//         }
//     });
// }

// function sql(s) {
//     return `'${s}'`;
// }

// function sql_html(s) {
//     return `"${encodeURIComponent(s)}"`;
// }

// function sql(v) {
//     return sql(v ? 1 : 0);
// }

// function sql(v) {
//     return v != 0;
// }

// function sql(null) {
//     return sql('NULL');
// }


async function sql_insert(table, cols, values) {

    let query = `insert into \`${table}\` (`;
    cols.forEach(col => {
        query += `\`${col}\`,`;
    });
    query = `${query.slice(0, -1)}) values (`;
    values.forEach(value => {
        query += `${value},`;
    });
    query = `${query.slice(0, -1)})`;
    return sql_query( query);
}

async function sql_update(table, cols, values, where) {

    let query = `update \`${table}\` set `;
    for (let i = 0; i < cols.length; i++) {
        query += `\`${cols[i]}\`=${values[i]},`;
    }
    query = `${query.slice(0, -1)} where ${where}`;
    return sql_query( query);
}

async function sql_select(table, cols, where = null, order = null) {

    let query = `select `;
    for (let i = 0; i < cols.length; i++) {
        if (cols[i] === '*') query += '*,';
        else query += `\`${cols[i]}\`,`;
    }
    query = `${query.slice(0, -1)} from \`${table}\``;
    if (is_valid(where)) {
        query += ` where ${where}`;
    }
    if (is_valid(order)) {
        query += ` order by ${order}`;
    }
    return sql_query( query);
}

async function sql_join(table1, table2, cols, on) {
    let query = `select `;
    for (let i = 0; i < cols.length; i++) {
        if (cols[i] === '*') query += '*,';
        else query += `\`${cols[i]}\`,`;
    }
    query = `${query.slice(0, -1)} from \`${table1}\` join \`${table2}\``;
    query = `on ${on}`;
    return sql_query( query);

}

async function sql_delete(table, where) {

    return sql_query( `delete from \`${table}\` where ${where}` );
}

async function sql_query( query ) {
    return req('sql', query);
}

function sql(v) {
    if (typeof v === 'string') return `'${v}'`;
    if (typeof v === 'boolean') return v ? '1' : '0';
    if (typeof v === 'number') return `${v}`;
    if (typeof v === 'undefined' || v === null) return `NULL`;
    return v;
}



