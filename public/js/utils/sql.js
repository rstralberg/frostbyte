

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
    if (typeof v === 'float') return `${v}`;
    if (typeof v === 'undefined' || v === null) return `NULL`;
    return v;
}



