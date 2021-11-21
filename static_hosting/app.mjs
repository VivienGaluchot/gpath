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


/** update editor and graphic view content */
function loadGcode(gcodeStr, conf) {
    let el = document.querySelector(".path>svg");
    uiLoadGcode(gcodeStr);
    Path.drawPath(el, gcodeStr, conf);
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


    let conf = {
        spanX: 200,
        spanY: 200,
        maxDrawZ: 10,
        drawSize: 1
    };

    function applyUserConf() {
        function setValid(el, isValid) {
            if (isValid) {
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
            }
        }

        let elSpanX = document.getElementById("x-span");
        let spanX = Number(elSpanX.value);
        if (Number.isFinite(spanX) && spanX > 0) {
            conf.spanX = spanX;
            setValid(elSpanX, true);
        } else {
            setValid(elSpanX, false);
        }

        let elSpanY = document.getElementById("y-span");
        let spanY = Number(elSpanY.value);
        if (Number.isFinite(spanY) && spanY > 0) {
            conf.spanY = spanY;
            setValid(elSpanY, true);
        } else {
            setValid(elSpanY, false);
        }

        let elDrawSize = document.getElementById("draw-size");
        let drawSize = Number(elDrawSize.value);
        if (Number.isFinite(drawSize) && drawSize > 0) {
            conf.drawSize = drawSize;
            setValid(elDrawSize, true);
        } else {
            setValid(elDrawSize, false);
        }

        let elMaxDrawZ = document.getElementById("z-max-draw");
        let maxDrawZ = Number(elMaxDrawZ.value);
        if (Number.isFinite(maxDrawZ)) {
            conf.maxDrawZ = maxDrawZ;
            setValid(elMaxDrawZ, true);
        } else {
            setValid(elMaxDrawZ, false);
        }

        loadGcode(dummyGcode, conf);
    }

    document.getElementById("apply-settings").onclick = () => {
        applyUserConf();
    };

    applyUserConf();
});