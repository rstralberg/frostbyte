
function format(type) {
    switch (type) {
        case 'b':
            toggleBold();
            break;
        case 'i':
            toggleItalic();
            break;
        default:
            break;
    }
}

function toggleBold() {

    let cursorInBold = false;
    let cursorInItalic = false;
    let selection = window.getSelection();

    if (selection.rangeCount) {
        let parent = selection.getRangeAt(0).commonAncestorContainer;
        if (parent.nodeType === 3) {
            parent = parent.parentNode; // get the parent element if the cursor is inside text node
        }
        cursorInBold = (parent.tagName && parent.tagName.toLowerCase() === 'b');
        cursorInItalic = (parent.tagName && parent.tagName.toLowerCase() === 'i');
    }

}

function toggleItalic() {
    let selection = window.getSelection();
    if (selection.rangeCount) {
        let range = selection.getRangeAt(0);
        let span = document.createElement("i");
        span.appendChild(range.extractContents());
        range.insertNode(span);
        get_selection().focus(); // keep focus on the editor
    }
}

function create_list() {

    const divElement = get_selection(); // select the div element

    const selection = window.getSelection(); // get the selection object
    const selectedLines = []; // initialize an empty array to store selected lines

    if (selection && selection.rangeCount) { // check if any text is selected
        const range = selection.getRangeAt(0); // get the first range in the selection
        const startNode = range.startContainer; // get the node where the selection starts
        const endNode = range.endContainer; // get the node where the selection ends

        // iterate over all the nodes between the start and end nodes
        // @ts-ignore
        for (let node = startNode; node && node !== endNode.nextSibling; node = node.nextSibling) {
            // check if the node is a text node and if it contains selected text
            if (node.nodeType === Node.TEXT_NODE && selection.containsNode(node, true) && node.nodeValue) {
                // split the text node into lines and add them to the selectedLines array
                const lines = node.nodeValue.split(/\r?\n/);
                for (const line of lines) {
                    if (selection.toString().includes(line)) {
                        selectedLines.push(line);
                    }
                }
            }
        }
    }

}

function clear_selection() {

    // let sel = window.getSelection();
    // let range = sel?.getRangeAt(0);
    // if (sel?.focusNode?.hasChildNodes()) {
    //     let pos = range?.startOffset;
    //     // @ts-ignore
    //     if (pos > 0) {
    //         // @ts-ignore
    //         for (let i = pos - 1; i > -1; i--) {
    //             let node = sel?.focusNode.childNodes[i];
    //             if (node.nodeName === '#text') {
    //                 let text = range?.extractContents();
    //                 // @ts-ignore
    //                 node.textContent += text?.textContent;
    //                 break;
    //             }
    //         }
    //     }
    //     else {
    //         let node = sel?.focusNode.childNodes[0];
    //         if (node.nodeName === '#text') {
    //             let text = range?.extractContents();
    //             // @ts-ignore
    //             node.textContent += text?.textContent;
    //         }
    //     }
    // }
}

/**
 * @param {string} align
 */
function align(align) {
    let element = get_selection();
    if (element) {
        element.setAttribute('style', `text-align:${align}`);
    }
}

