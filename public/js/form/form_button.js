// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// A form button
// 'listener' will be called with no arguments when button clicked

function create_button(caption, listener) {

    let btn = document.createElement('button');
    btn.classList.add('ibutton');
    btn.innerText = caption;
    btn.addEventListener('click', (e) => {
        listener();
    });

    let div = document.createElement('div');
    div.appendChild(btn);
    return div;
}

