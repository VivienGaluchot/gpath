import * as GCode from './lib/gcode.mjs'

/* sgv tools */
const svgNS = "http://www.w3.org/2000/svg";

function svgRect(x, y, w, h) {
    let rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    return rect;
}


/* redraw the path in the svg element */
function drawPath(path, spanX, spanY) {
    console.log(spanX, spanY)
    let el = document.querySelector(".path>svg");
    while (el.firstChild) {
        el.firstChild.remove();
    }
    el.setAttribute("viewBox", `0 0 ${spanX} ${spanY}`);
    for (let x = 0; x < (spanX / 10); x++) {
        for (let y = 0; y < (spanY / 10); y++) {
            let rect = svgRect(10 * x, 10 * y, 10, 10);
            rect.setAttribute("fill", ((x + y) % 2 == 0) ? "#0004" : "#0006");
            el.appendChild(rect);
        }
    }
}


/* create UI element to display GCODE */
function uiLoadGcode(gcodeStr) {
    let ul = document.querySelector(".gcode");
    while (ul.firstChild) {
        ul.firstChild.remove();
    }

    function lineToLi(index, line) {
        let li = document.createElement("li");

        let lineIndex = document.createElement("span");
        lineIndex.classList.add("line-index");
        lineIndex.textContent = index;
        li.appendChild(lineIndex);

        let data = GCode.parseLine(line);
        if (data) {
            let elCode = document.createElement("span");
            elCode.classList.add("line-code");
            elCode.textContent = data.code;
            elCode.setAttribute("data-bs-toggle", "tooltip");
            elCode.setAttribute("data-bs-placement", "top");
            elCode.setAttribute("title", GCode.getMan(data.code).name);
            new bootstrap.Tooltip(elCode);
            li.appendChild(elCode);

            let elArgs = document.createElement("span");
            elArgs.classList.add("line-args");
            elArgs.textContent = data.args;
            li.appendChild(elArgs);

            let elComment = document.createElement("span");
            elComment.classList.add("line-cmt");
            elComment.textContent = data.comment;
            li.appendChild(elComment);
        } else {
            let span = document.createElement("span");
            span.textContent = line;
            li.appendChild(span);
        }
        return li;
    }

    let index = 0;
    for (let line of gcodeStr.split("\n")) {
        index += 1;
        ul.appendChild(lineToLi(index, line));
    }

}



document.addEventListener("DOMContentLoaded", () => {
    let dummyGcode = "";
    for (let i = 0; i < 100; i++) {
        dummyGcode += `G${i} 01 02 03 ; dummy !\n`;
        dummyGcode += `G${i} 05 ; 02 03 ; dummy !\n`;
    }
    uiLoadGcode(dummyGcode);


    let spanX = 200;
    let spanY = 200;

    function updateSpan() {
        let userSpanX = Number(document.getElementById("x-span").value);
        let userSpanY = Number(document.getElementById("y-span").value);
        if (Number.isFinite(userSpanX) && Number.isFinite(userSpanY) && userSpanX > 0 && userSpanY > 0) {
            spanX = userSpanX;
            spanY = userSpanY;
        }
        drawPath(null, spanX, spanY);
    }
    document.getElementById("span-apply").onclick = () => {
        updateSpan();
    };
    updateSpan();
});