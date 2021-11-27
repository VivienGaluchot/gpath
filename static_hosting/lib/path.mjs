"use strict";

import * as GCode from './gcode.mjs'

class PathPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.lines = [];
    }

    addLine(line) {
        this.lines.push(line);
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

    registerGraphEl(el) {
        for (let line of this.lines) {
            line.registerGraphEl(el);
        }
    }
}

function* getPoints(doc) {
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
                currentPoint.addLine(line);
                yield currentPoint;
            } else if (code == moveCode0 || code == moveCode1) {
                let x = line.getArg("X");
                let y = line.getArg("Y");
                let z = line.getArg("Z");
                x = x ? Number.parseFloat(x.value) : null;
                y = y ? Number.parseFloat(y.value) : null;
                z = z ? Number.parseFloat(z.value) : null;
                if (x != null || y != null || z != null) {
                    currentPoint = currentPoint.getNext(x, y, z, isRelative);
                    currentPoint.addLine(line);
                    yield currentPoint;
                }
            } else if (code == absCode) {
                isRelative = false;
            } else if (code == relCode) {
                isRelative = true;
            }
        }
    }
}

function* getDistinctPoints(doc) {
    let current = null;
    for (let point of getPoints(doc)) {
        if (current == null) {
            // first point
            current = point;
        } else if (current.x != point.x || current.y != point.y || current.z != point.z) {
            // distinct point
            yield current;
            current = point;
        } else {
            // same point
            for (let line of point.lines) {
                current.addLine(line);
            }
        }
    }
    if (current != null) {
        yield current;
    }
}

/* sgv tools */
const svgNS = "http://www.w3.org/2000/svg";

function setStyle(el, style) {
    if (style.className) {
        el.setAttribute("class", style.className);
    }
    if (style.fill) {
        el.setAttribute("fill", style.fill);
    }
    if (style.stroke) {
        el.setAttribute("stroke", style.stroke);
    }
    if (style.strokeW) {
        el.setAttribute("stroke-width", style.strokeW);
    }
}

function svgGroup(id) {
    let el = document.createElementNS(svgNS, "g");
    if (id) {
        el.setAttribute("id", id);
    }
    return el;
}

function svgRect(x, y, w, h, style) {
    let el = document.createElementNS(svgNS, "rect");
    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", w);
    el.setAttribute("height", h);
    el.setAttribute("stroke-linejoin", "round");
    setStyle(el, style);
    return el;
}

function svgLine(x1, y1, x2, y2, style) {
    let el = document.createElementNS(svgNS, "line");
    el.setAttribute("x1", x1);
    el.setAttribute("y1", y1);
    el.setAttribute("x2", x2);
    el.setAttribute("y2", y2);
    el.setAttribute("stroke-linecap", "round");
    setStyle(el, style);
    return el;
}

function svgCircle(x, y, r, style) {
    let el = document.createElementNS(svgNS, "circle");
    el.setAttribute("cx", x);
    el.setAttribute("cy", y);
    el.setAttribute("r", r);
    setStyle(el, style);
    return el;
}


// drag point
// TODO drag a point object and update the circle and lines associated

let startMouseX;
let startMouseY;
let startElX;
let startElY;
let draggedEl;

function mouseDrag(event) {
    event.preventDefault();
    console.log(event);
    // calculate the new cursor position:
    let dX = startMouseX - event.clientX;
    let dY = startMouseY - event.clientY;
    // TODO set the element's new position
    let newX = startElX + dX;
    let newY = startElY + dY;
    draggedEl.style.left = (startElX - dX) + "px";
    draggedEl.style.top = (startElY - dY) + "px";
}

function stopDrag(event) {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}

function startDrag(event) {
    event.preventDefault();
    draggedEl = event.target;
    // get the mouse cursor position at startup:
    startMouseX = event.clientX;
    startMouseY = event.clientY;
    // TODO get el pos
    startElX = 0;
    startElY = 0;
    document.onmouseup = stopDrag;
    // call a function whenever the cursor moves:
    document.onmousemove = mouseDrag;
}

function setupPointDraw(el) {
    el.onmousedown = startDrag;
}


// draw

// conf : { spanX, spanY, maxDrawZ, drawSize };
function show(doc, conf) {
    let svgEl = document.querySelector("#draw-area");

    let spanX = conf.spanX;
    let spanY = conf.spanY;
    let maxDrawZ = conf.maxDrawZ;
    let drawSize = conf.drawSize;
    let spanMargin = 5;

    // cleanup
    while (svgEl.firstChild) {
        svgEl.firstChild.remove();
    }
    svgEl.setAttribute("viewBox", `${-1 * spanMargin} ${-1 * spanMargin} ${spanX + 2 * spanMargin} ${spanY + 2 * spanMargin}`);

    // grid
    let grid = svgGroup("grid");
    for (let x = 0; x < (spanX / 10); x++) {
        for (let y = 0; y < (spanY / 10); y++) {
            if ((x + y) % 2 == 0) {}
            let fill = ((x + y) % 2 == 0) ? "#FFFFFF02" : "#FFFFFF08";
            grid.appendChild(svgRect(10 * x, 10 * y, 10, 10, { fill: fill }));
        }
    }
    let borderWidth = .5;
    grid.appendChild(svgRect(0 - borderWidth / 2, 0 - borderWidth / 2,
        spanX + borderWidth, spanY + borderWidth, {
            fill: "#0000",
            stoke: "#000",
            strokeW: borderWidth
        }));
    svgEl.appendChild(grid);

    // lines & points
    let traceLines = svgGroup("lines-trace");
    let noTraceLines = svgGroup("lines-no-traces");
    let points = svgGroup("points");
    let prevPoint = null;
    for (let point of getDistinctPoints(doc)) {
        // lines
        if (prevPoint) {
            let isTrace = (prevPoint.z <= maxDrawZ) || (point.z <= maxDrawZ);
            let el = svgLine(prevPoint.x, prevPoint.y, point.x, point.y, {
                className: "line",
                strokeW: drawSize
            });
            if (isTrace) {
                traceLines.appendChild(el);
            } else {
                noTraceLines.appendChild(el);
            }
        }
        prevPoint = point;
        // points
        if (point.z <= maxDrawZ) {
            let el = svgCircle(point.x, point.y, 2, { className: "point" });
            point.registerGraphEl(el);
            setupPointDraw(el);
            points.appendChild(el);
        }
    }
    svgEl.appendChild(traceLines);
    svgEl.appendChild(noTraceLines);
    svgEl.appendChild(points);
}

export { show }