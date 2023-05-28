const sql_mode = {
	single: 0,
	mutli: 1,
	none: 2
}

function sql_write(table, cols, values, where) {
	let data = request('sql_write',
		[
			{ key: 'table', value: table },
			{ key: 'cols', value: cols },
			{ key: 'values', value: values },
			{ key: 'where', value: where },
		]);
	if (data.success) {
		return data.data;
	}
	else {
		alert(`${lexer_data.t('sql_error')}: ${data.data}`);
	}
}

function sql_read(table, cols, where = '', order = '', mode = sql_mode.single) {
	let data = request('sql_read',
		[
			{ key: 'mode', value: mode },
			{ key: 'table', value: table },
			{ key: 'cols', value: cols },
			{ key: 'where', value: where },
			{ key: 'order', value: order },
		]);
	
	if (data.success) {
		return data.data;
	}
	else {
		alert(`${lexer_data.t('sql_error')}: ${data.data}`);
		return null;
	}
}

function sql_delete(table, where) {
	let data = request('sql_delete',
		[
			{ key: 'table', value: table },
			{ key: 'where', value: where },
		]);
	if (data.success) {
		return data.data;
	}
	else {
		alert(`${lexer_data.t('sql_error')}: ${data.data}`);
	}
}

function sql_content(cont) {
	return sql_string(JSON.stringify(cont).replace(/(['"])/g, '\\$1'));
}

function sql_string(s) {
	return '"' + encodeURIComponent(s) + '"';
}

function sql_bool(v) {
	return v ? 1 : 0;
}

function sql_is_true(v) {
	return v != 0;
}

function sql_null() {
	return '"NULL"';
}
