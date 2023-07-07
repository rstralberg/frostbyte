
function remove_quotes(str) {
    return str.replace(/^"(.+(?="$))"$/, '$1');
}

function remove_linebreaks(str) {
    return str.replace( /[\r\n]+/gm, "" );
}


function str_first_uppercase(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}


