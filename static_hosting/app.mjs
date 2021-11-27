"use strict";

import * as GCode from './lib/gcode.mjs'
import * as Path from './lib/path.mjs'
import * as Editor from './lib/editor.mjs'


/** update editor and graphic view content */
function loadGcode(doc, conf) {
    Editor.show(doc);
    Path.show(doc, conf);
}


document.addEventListener("DOMContentLoaded", () => {
    let dummyGcode = "; Dummy test\n";
    dummyGcode += "; Init\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 F5000 ; high feedrate\n";
    dummyGcode += "G28 ; reset to home\n";
    dummyGcode += "G0 Z12 ; high\n";
    dummyGcode += "G0 X100 Y60 ; setup point\n";
    dummyGcode += "G0 Z10 ; low\n";
    dummyGcode += "M0 Add pen an click ; pause\n";

    dummyGcode += "; Square left\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 F5000 ; high feedrate\n";
    dummyGcode += "G0 Z12 ; high\n";
    dummyGcode += "G0 X75 Y95 ; move\n";
    dummyGcode += "G0 Z10 ; low\n";
    dummyGcode += "G0 F1500 ; low feedrate\n";
    dummyGcode += "G91 ; relative\n";
    dummyGcode += "G0 X10\n";
    dummyGcode += "G0 Y10\n";
    dummyGcode += "G0 X-10\n";
    dummyGcode += "G0 Y-10\n";

    dummyGcode += "; Square mid\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 F5000 ; high feedrate\n";
    dummyGcode += "G0 Z12 ; high\n";
    dummyGcode += "G0 X95 Y95 ; move\n";
    dummyGcode += "G0 Z10 ; low\n";
    dummyGcode += "G0 F1500 ; low feedrate\n";
    dummyGcode += "G91 ; relative\n";
    dummyGcode += "G0 X10\n";
    dummyGcode += "G0 Y20\n";
    dummyGcode += "G0 X-10\n";
    dummyGcode += "G0 Y-20\n";

    dummyGcode += "; Square right\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 F5000 ; high feedrate\n";
    dummyGcode += "G0 Z12 ; high\n";
    dummyGcode += "G0 X115 Y95 ; move\n";
    dummyGcode += "G0 Z10 ; low\n";
    dummyGcode += "G0 F1500 ; low feedrate\n";
    dummyGcode += "G91 ; relative\n";
    dummyGcode += "G0 X10\n";
    dummyGcode += "G0 Y10\n";
    dummyGcode += "G0 X-10\n";
    dummyGcode += "G0 Y-10\n";

    dummyGcode += "; END\n";
    dummyGcode += "G90 ; absolute\n";
    dummyGcode += "G0 F5000 ; high feedrate\n";
    dummyGcode += "G0 Z12 ; high\n";
    dummyGcode += "G0 X0 Y200 ; move\n";


    let conf = {
        spanX: 200,
        spanY: 200,
        maxDrawZ: 10,
        drawSize: 1
    };

    let doc = null;

    function reload(gcodeStr) {
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

        doc = new GCode.Document(gcodeStr);
        loadGcode(doc, conf);
    }

    document.getElementById("apply-settings").onclick = () => {
        reload(dummyGcode);
    };

    document.getElementById("download-btn").onclick = () => {
        let filename = document.getElementById("download-filename").value;
        if (filename.length == 0) {
            filename = "noname";
        }
        doc.download(`${filename}.gcode`);
    };

    reload(dummyGcode);
});