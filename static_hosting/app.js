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

        let command;
        let comment;
        let comSplit = line.search(";");
        if (comSplit >= 0) {
            command = line.slice(0, comSplit);
            comment = line.slice(comSplit);
        } else {
            command = line;
            comment = "";
        }

        let lineData = document.createElement("span");
        lineData.classList.add("line-data");
        lineData.textContent = command;
        li.appendChild(lineData);

        let lineComment = document.createElement("span");
        lineComment.classList.add("line-cmt");
        lineComment.textContent = comment;
        li.appendChild(lineComment);
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
});