"use strict";

import * as GCode from './gcode.mjs'

class PathPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getNext(x, y, z, isRelative) {
        let nx = this.x;
        let ny = this.y;
        let nz = this.z;
        if (isRelative) {
            nx = Number.isFinite(x) ? nx + x : nx;
            ny = Number.isFinite(y) ? ny + y : ny;
            nz = Number.isFinite(z) ? nz + z : nz;
        } else {
            nx = Number.isFinite(x) ? x : nx;
            ny = Number.isFinite(y) ? y : ny;
            nz = Number.isFinite(z) ? z : nz;
        }
        return new PathPoint(nx, ny, nz);
    }
}

function* getPathFromGcode(doc) {
    const moveCode0 = "G0";
    const moveCode1 = "G0";
    const homeCode = "G28";
    const absCode = "G90";
    const relCode = "G91"

    let isRelative = false;
    let currentPoint = new PathPoint(0, 0, 0);

    for (let line of doc.lines) {
        if (line.hasCode) {
            let code = line.getCode().str;
            if (code == homeCode) {
                currentPoint = new PathPoint(0, 0, 0);
                yield currentPoint;
            } else if (code == moveCode0 || code == moveCode1) {
                let x = line.getArg("X");
                let y = line.getArg("Y");
                let z = line.getArg("Z");
                x = x ? Number.parseFloat(x.value) : null;
                y = y ? Number.parseFloat(y.value) : null;
                z = z ? Number.parseFloat(z.value) : null;
                currentPoint = currentPoint.getNext(x, y, z, isRelative);
                yield currentPoint;
            } else if (code == absCode) {
                isRelative = false;
            } else if (code == relCode) {
                isRelative = true;
            }
        }
    }
}

/* sgv tools */
const svgNS = "http://www.w3.org/2000/svg";

function svgRect(x, y, w, h, fill) {
    let el = document.createElementNS(svgNS, "rect");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", w);
    el.setAttribute("height", h);
    el.setAttribute("fill", fill);
    return el;
}

function svgLine(x1, y1, x2, y2, stroke, width) {
    let el = document.createElementNS(svgNS, "line");
    el.setAttribute("x1", x1);
    el.setAttribute("y1", y1);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute("stroke", stroke);
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-width", width);
    return el;
}

// conf : { spanX, spanY, maxDrawZ, drawSize };
function drawPath(svgEl, gcodeStr, conf) {
    let spanX = conf.spanX;
    let spanY = conf.spanY;
    let maxDrawZ = conf.maxDrawZ;
    let drawSize = conf.drawSize;

    while (svgEl.firstChild) {
        svgEl.firstChild.remove();
    }
    svgEl.setAttribute("viewBox", `0 0 ${spanX} ${spanY}`);
    for (let x = 0; x < (spanX / 10); x++) {
        for (let y = 0; y < (spanY / 10); y++) {
            let fill = ((x + y) % 2 == 0) ? "#0004" : "#0006";
            svgEl.appendChild(svgRect(10 * x, 10 * y, 10, 10, fill));
        }
    }

    let prevPoint = null;
    for (let point of getPathFromGcode(gcodeStr)) {
        if (prevPoint) {
            if (prevPoint.z && point.z <= maxDrawZ) {
                svgEl.appendChild(svgLine(prevPoint.x, prevPoint.y, point.x, point.y, "#888", drawSize));
            }
        }
        prevPoint = point;
    }
}

export { drawPath }