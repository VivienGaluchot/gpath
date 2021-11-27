"use strict";

/* update editor content */

function show(doc) {
    let ul = document.querySelector("#edit-area");
    while (ul.firstChild) {
        ul.firstChild.remove();
    }

    let index = 0;
    for (let line of doc.lines) {
        index += 1;
        let li = document.createElement("li");
        let lineIndex = document.createElement("span");
        lineIndex.classList.add("index");
        lineIndex.textContent = index;
        li.appendChild(lineIndex);
        for (let token of line.getEditorTokens()) {
            let el = document.createElement("span");
            if (token.class) {
                el.classList.add(token.class);
            }
            if (token.man) {
                el.setAttribute("data-bs-toggle", "tooltip");
                el.setAttribute("data-bs-placement", "top");
                el.setAttribute("title", token.man.name);
                new bootstrap.Tooltip(el);
            }
            el.innerText = token.str;
            li.appendChild(el);
        }
        line.registerEditorEl(li);
        ul.appendChild(li);
    }
}


export { show }