import * as GCode from './lib/gcode.mjs'
import * as Path from './lib/path.mjs'

/* update editor content */
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
            let man = GCode.getMan(data.code);
            if (man) {
                elCode.setAttribute("data-bs-toggle", "tooltip");
                elCode.setAttribute("data-bs-placement", "top");
                elCode.setAttribute("title", man.name);
            }
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
            span.classList.add("line-warn");
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
    let dummyGcode = "; Dummy code\n";
    dummyGcode += "G28 ; reset to home\n";
    dummyGcode += "G0 F1500 ; set the feedrate to 1500 mm/min\n";
    dummyGcode += "G0 Z10\n";
    dummyGcode += "G0 X10\n";
    dummyGcode += "G0 Y10\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 X15 Y5\n";
    dummyGcode += "G0 X16 Y6\n";
    dummyGcode += "G91 ; relative\n";
    dummyGcode += "G0 X1 Y1\n";
    dummyGcode += "G0 X1 Y1\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 Z20 ; high\n";
    dummyGcode += "G0 X100 Y100\n";
    dummyGcode += "G0 Z10 ; low\n";
    dummyGcode += "G91 ; relative\n";
    dummyGcode += "G0 X10\n";
    dummyGcode += "G0 Y10\n";
    dummyGcode += "G0 X-10\n";
    dummyGcode += "G0 Y-10\n";


    let conf = { spanX: 200, spanY: 200, maxDrawZ: 10 };

    /** update editor and graphic view content */
    function loadGcode(gcodeStr) {
        let el = document.querySelector(".path>svg");
        uiLoadGcode(gcodeStr);
        Path.drawPath(el, gcodeStr, conf);
    }

    function updateSpan() {
        let userSpanX = Number(document.getElementById("x-span").value);
        let userSpanY = Number(document.getElementById("y-span").value);
        let userMaxDrawZ = Number(document.getElementById("z-max-draw").value);
        if (Number.isFinite(userSpanX) && userSpanX > 0 &&
            Number.isFinite(userSpanY) && userSpanY > 0 &&
            Number.isFinite(userMaxDrawZ)) {
            conf.spanX = userSpanX;
            conf.spanY = userSpanY;
            conf.maxDrawZ = userMaxDrawZ;
            loadGcode(dummyGcode)
        }
    }
    document.getElementById("span-apply").onclick = () => {
        updateSpan();
    };
    updateSpan();
});