function format_selection(tag) {
    let selection = window.getSelection();
    if (selection.rangeCount) {
        let range = selection.getRangeAt(0);
        let span = document.createElement(tag);
        span.appendChild(range.extractContents());
        range.insertNode(span);
        Global.selected.focus(); // keep focus on the editor
    }
}


function on_bold() {
    format_selection('b');
}

function on_italic() {
    format_selection('i')
}

function on_underline() {
    format_selection('u');
}

function on_h1() {
    format_selection('h1');
}

function on_h3() {
    format_selection('h3');
}

function on_mark() {
    format_selection('mark');
}

function on_link() {
    let selection = window.getSelection();
    if (selection.rangeCount) {
        var range = selection.getRangeAt(0);
        var text = range.extractContents();
        if (text.textContent.length > 0) {

            create_form('link-edit', { title: 'Länk', action: 'Spara' }, [
                {
                    type: FormType.Label,
                    name: 'text',
                    label: text,
                },
                {
                    type: FormType.Text,
                    name: 'link',
                    label: 'Länk',
                    value: 'https://'
                }
            ])
                .then(
                    (resolve) => {
                        let a = document.createElement('a');
                        a.classList.add('link');
                        a.href = resolve['link'];
                        a.appendChild(text);
                        range.insertNode(a);
                        Global.selected.focus(); // keep focus on the editor
                    }
                )
        }
    }

}

function on_clear_formatting() {
    Global.selected.innerHTML = Global.selected.innerText;
}

function on_align_left() {
    Global.selected.style.textAlign = 'left';
}

function on_align_center() {
    Global.selected.style.textAlign = 'center';
}

function on_align_right() {
    Global.selected.style.textAlign = 'right';
}

