
function sql_insert(sql_query) {
    let id = 0;
    request('sql-insert', [
        { key: 'query', value: sql_query }],
        (response) => {
            let obj = JSON.parse(response);
            if (!obj.success) {
                alert(Lexer.SQL_INSERT_ERROR + ': ' + sql_query);
            }
            else {
                id = obj.id;
            }
        });
    return id;
}

function sql_update(sql_query) {
    request('sql-update', [
        { key: 'query', value: sql_query }],
        (response) => {
            let obj = JSON.parse(response);
            if (!obj.success) {
                alert(Lexer.SQL_UPDATE_ERROR + ': ' + sql_query);
            }
        });
}

function sql_select(sql_query) {
    let obj = 0;
    request('sql-select', [
        { key: 'query', value: sql_query }],
        (response) => {
            obj = JSON.parse(response);
            if (!obj.success) {
                alert(Lexer.SQL_SELECT_ERROR + ': ' + sql_query);
            }
        });
    return obj.rows;
}

function sql_delete(sql_query) {
    request('sql-delete', [
        { key: 'query', value: sql_query }],
        (response) => {
            let obj = JSON.parse(response);
            if (!obj.success) {
                alert(Lexer.SQL_DELETE_ERROR + ': ' + sql_query);
            }
        });
}

function sql_content(content) {
    return sql_string(JSON.stringify(content).replace(/(['"])/g, "\\$1"));
}

function sql_string(s) {
    return '"' + encodeURIComponent(s) + '"';
}


class iSqlCol {
    name;
    value;

    constructor(name = null, value = null) {
        if (name === null) {
            this.name = '*';
            this.value = '';
            this.type = typeof value;
        } else if (value === null ) {
            this.name = name;
            this.type = typeof value;
        } else {
            this.name = name;
            this.value = value;
            this.type = typeof value;
        }
    }
}

class iSqlWhere {
    name;
    value;
    type;
    next;

    constructor(name, value, next = '') {
        this.name = name;
        this.value =  value;
        this.type = typeof value;
        this.next = next;
    }
}

class iSqlOrder {
    name;
    sort;

    constructor(name, sort) {
        this.name = name;
        this.sort = sort;
    }
}


class iSql {

    table;
    cols;
    where;
    order;
    action;

    constructor(action, table, cols, where = null, order = null) {
        this.action = action;
        this.table = table;
        this.cols = cols;
        this.where = where;
        this.order = order;
    }
}

function sql(sql, reply) {
    request('sql', [
        { key: 'action', value: sql.action },
        { key: 'table', value: sql.table },
        { key: 'cols', value: JSON.stringify(sql.cols) },
        { key: 'where', value: JSON.stringify(sql.where) },
        { key: 'order', value: JSON.stringify(sql.order) }
    ],
        (response) => {
            let obj = JSON.parse(response);
            if (!obj.success && obj.message && obj.message.length   ) {
                alert(obj.message);
            } else {
                if (obj.message ) {
                    reply(JSON.parse(obj.message));
                }
            }
        });
}
