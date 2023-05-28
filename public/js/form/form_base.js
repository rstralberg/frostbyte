// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// Some basic support for most of the form-members
// Its essential a container to hold the member along
// with a label
//

function create_base( text ) {
    
    let div = document.createElement('div');
    div.classList.add('icol-40-60');

    let label = document.createElement('label');
    label.classList.add('ilabel');
    label.innerHTML = text;
    label.for = `L-${Math.floor(Math.random() * 1000)}`;
    div.appendChild(label);
    return { div:div, id:label.for};
}