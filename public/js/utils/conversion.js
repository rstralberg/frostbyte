
function deg2rad(deg) {
    return (deg / 360) * (2 * Math.PI);
}

function rad2deg(rad) {
    return (rad / (Math.PI * 2)) * 360;
}

function pos2polar(inPos) {
    let vecLen = Math.sqrt(inPos.x * inPos.x + inPos.y * inPos.y);
    let something = Math.atan2(inPos.y, inPos.x);
    while (something < 0)
        something += 2 * Math.PI;

    return { ang: rad2deg(something), len: vecLen };
}

function toHex(d) {
    return (+d).toString(16);
}

function to_hexbyte(d) {
    return ('0000' + d.toString(16).toUpperCase()).slice(-2);
}

