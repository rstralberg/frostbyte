// ========================================================================
// FrostByte
// by Roland Strålberg
// All Rights Reserved 
// Contact: rstralberg@pm.me
// ========================================================================
//
// A form checkbox
// 'listener' will be called with checkbox state (boolean) when changed

function create_checkbox(label, checked, listener) {

    let base = create_base(label);

    let cbox = document.createElement('input');
    cbox.classList.add('icheckbox');
    cbox.type = 'checkbox';
    cbox.checked = checked;
    cbox.id = base.id;
    cbox.addEventListener('input', (e) => {
        listener(e.target.checked);
    });

    base.div.appendChild(cbox);
    return base.div;
}
