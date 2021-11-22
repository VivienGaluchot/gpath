"use strict";


// from https://marlinfw.org/meta/gcode/
const docExtract = {
    "G0": { name: "Linear Move (fast, non-extrusion)", url: "G000-G001.html" },
    "G1": { name: "Linear Move (more precise)", url: "G000-G001.html" },
    "G2": { name: "Arc or Circle Move" },
    "G3": { name: "Arc or Circle Move" },
    "G4": { name: "Dwell" },
    "G5": { name: "Bézier cubic spline" },
    "G6": { name: "Direct Stepper Move" },
    "G10": { name: "Retract" },
    "G11": { name: "Recover" },
    "G12": { name: "Clean the Nozzle" },
    "G17": { name: "CNC Workspace Planes" },
    "G18": { name: "CNC Workspace Planes" },
    "G19": { name: "CNC Workspace Planes" },
    "G20": { name: "Inch Units" },
    "G21": { name: "Millimeter Units" },
    "G26": { name: "Mesh Validation Pattern" },
    "G27": { name: "Park toolhead" },
    "G28": { name: "Auto Home" },
    "G29": { name: "Bed Leveling" },
    "G29": { name: "Bed Leveling (3-Point)" },
    "G29": { name: "Bed Leveling (Linear)" },
    "G29": { name: "Bed Leveling (Manual)" },
    "G29": { name: "Bed Leveling (Bilinear)" },
    "G29": { name: "Bed Leveling (Unified)" },
    "G30": { name: "Single Z-Probe" },
    "G31": { name: "Dock Sled" },
    "G32": { name: "Undock Sled" },
    "G33": { name: "Delta Auto Calibration" },
    "G34": { name: "Z Steppers Auto-Alignment" },
    "G35": { name: "Tramming Assistant" },
    "G38.2": { name: "Probe target" },
    "G38.3": { name: "Probe target" },
    "G38.4": { name: "Probe target" },
    "G38.5": { name: "Probe target" },
    "G42": { name: "Move to mesh coordinate" },
    "G53": { name: "Move in Machine Coordinates" },
    "G54": { name: "Workspace Coordinate System 1" },
    "G55": { name: "Workspace Coordinate System 2" },
    "G56": { name: "Workspace Coordinate System 3" },
    "G57": { name: "Workspace Coordinate System 4" },
    "G58": { name: "Workspace Coordinate System 5" },
    "G59": { name: "Workspace Coordinate System 6" },
    "G59.1": { name: "Workspace Coordinate System 7" },
    "G59.2": { name: "Workspace Coordinate System 8" },
    "G59.3": { name: "Workspace Coordinate System 9" },
    "G60": { name: "Save Current Position" },
    "G61": { name: "Return to Saved Position" },
    "G76": { name: "Probe temperature calibration" },
    "G80": { name: "Cancel Current Motion Mode" },
    "G90": { name: "Absolute Positioning" },
    "G91": { name: "Relative Positioning" },
    "G92": { name: "Set Position" },
    "G425": { name: "Backlash Calibration" },
    "M0": { name: "Unconditional stop" },
    "M1": { name: "Unconditional stop" },
    "M3": { name: "Spindle CW / Laser On" },
    "M4": { name: "Spindle CCW / Laser On" },
    "M5": { name: "Spindle / Laser Off" },
    "M7": { name: "Coolant Controls" },
    "M8": { name: "Coolant Controls" },
    "M9": { name: "Coolant Controls" },
    "M10": { name: "Vacuum / Blower Control" },
    "M11": { name: "Vacuum / Blower Control" },
    "M16": { name: "Expected Printer Check" },
    "M17": { name: "Enable Steppers" },
    "M18": { name: "Disable steppers" },
    "M84": { name: "Disable steppers" },
    "M20": { name: "List SD Card" },
    "M21": { name: "Init SD card" },
    "M22": { name: "Release SD card" },
    "M23": { name: "Select SD file" },
    "M24": { name: "Start or Resume SD print" },
    "M25": { name: "Pause SD print" },
    "M26": { name: "Set SD position" },
    "M27": { name: "Report SD print status" },
    "M28": { name: "Start SD write" },
    "M29": { name: "Stop SD write" },
    "M30": { name: "Delete SD file" },
    "M31": { name: "Print time" },
    "M32": { name: "Select and Start" },
    "M33": { name: "Get Long Path" },
    "M34": { name: "SDCard Sorting" },
    "M42": { name: "Set Pin State" },
    "M43": { name: "Debug Pins" },
    "M43": { name: "Toggle Pins" },
    "T": { name: "Toggle Pins" },
    "M48": { name: "Probe Accuracy Test" },
    "M73": { name: "Set Print Progress" },
    "M75": { name: "Start Print Job Timer" },
    "M76": { name: "Pause Print Job" },
    "M77": { name: "Stop Print Job Timer" },
    "M78": { name: "Print Job Stats" },
    "M80": { name: "Power On" },
    "M81": { name: "Power Off" },
    "M82": { name: "E Absolute" },
    "M83": { name: "E Relative" },
    "M85": { name: "Inactivity Shutdown" },
    "M92": { name: "Set Axis Steps-per-unit" },
    "M100": { name: "Free Memory" },
    "M104": { name: "Set Hotend Temperature" },
    "M105": { name: "Report Temperatures" },
    "M106": { name: "Set Fan Speed" },
    "M107": { name: "Fan Off" },
    "M108": { name: "Break and Continue" },
    "M109": { name: "Wait for Hotend Temperature" },
    "M110": { name: "Set Line Number" },
    "M111": { name: "Debug Level" },
    "M112": { name: "Emergency Stop" },
    "M113": { name: "Host Keepalive" },
    "M114": { name: "Get Current Position" },
    "M115": { name: "Firmware Info" },
    "M117": { name: "Set LCD Message" },
    "M118": { name: "Serial print" },
    "M119": { name: "Endstop States" },
    "M120": { name: "Enable Endstops" },
    "M121": { name: "Disable Endstops" },
    "M122": { name: "TMC Debugging" },
    "M123": { name: "Fan Tachometers" },
    "M125": { name: "Park Head" },
    "M126": { name: "Baricuda 1 Open" },
    "M127": { name: "Baricuda 1 Close" },
    "M128": { name: "Baricuda 2 Open" },
    "M129": { name: "Baricuda 2 Close" },
    "M140": { name: "Set Bed Temperature" },
    "M141": { name: "Set Chamber Temperature" },
    "M143": { name: "Set Laser Cooler Temperature" },
    "M145": { name: "Set Material Preset" },
    "M149": { name: "Set Temperature Units" },
    "M150": { name: "Set RGB(W) Color" },
    "M154": { name: "Position Auto-Report" },
    "M155": { name: "Temperature Auto-Report" },
    "M163": { name: "Set Mix Factor" },
    "M164": { name: "Save Mix" },
    "M165": { name: "Set Mix" },
    "M166": { name: "Gradient Mix" },
    "M190": { name: "Wait for Bed Temperature" },
    "M191": { name: "Wait for Chamber Temperature" },
    "M192": { name: "Wait for Probe temperature" },
    "M193": { name: "Set Laser Cooler Temperature" },
    "M200": { name: "Set Filament Diameter" },
    "M201": { name: "Set Print Max Acceleration" },
    "M203": { name: "Set Max Feedrate" },
    "M204": { name: "Set Starting Acceleration" },
    "M205": { name: "Set Advanced Settings" },
    "M206": { name: "Set Home Offsets" },
    "M207": { name: "Set Firmware Retraction" },
    "M208": { name: "Firmware Recover" },
    "M209": { name: "Set Auto Retract" },
    "M211": { name: "Software Endstops" },
    "M217": { name: "Filament swap parameters" },
    "M218": { name: "Set Hotend Offset" },
    "M220": { name: "Set Feedrate Percentage" },
    "M221": { name: "Set Flow Percentage" },
    "M226": { name: "Wait for Pin State" },
    "M240": { name: "Trigger Camera" },
    "M250": { name: "LCD Contrast" },
    "M256": { name: "LCD Brightness" },
    "M260": { name: "I2C Send" },
    "M261": { name: "I2C Request" },
    "M280": { name: "Servo Position" },
    "M281": { name: "Edit Servo Angles" },
    "M282": { name: "Detach Servo" },
    "M290": { name: "Babystep" },
    "M300": { name: "Play Tone" },
    "M301": { name: "Set Hotend PID" },
    "M302": { name: "Cold Extrude" },
    "M303": { name: "PID autotune" },
    "M304": { name: "Set Bed PID" },
    "M305": { name: "User Thermistor Parameters" },
    "M350": { name: "Set micro-stepping" },
    "M351": { name: "Set Microstep Pins" },
    "M355": { name: "Case Light Control" },
    "M360": { name: "SCARA Theta A" },
    "M361": { name: "SCARA Theta-B" },
    "M362": { name: "SCARA Psi-A" },
    "M363": { name: "SCARA Psi-B" },
    "M364": { name: "SCARA Psi-C" },
    "M380": { name: "Activate Solenoid" },
    "M381": { name: "Deactivate Solenoids" },
    "M400": { name: "Finish Moves" },
    "M401": { name: "Deploy Probe" },
    "M402": { name: "Stow Probe" },
    "M403": { name: "MMU2 Filament Type" },
    "M404": { name: "Set Filament Diameter" },
    "M405": { name: "Filament Width Sensor On" },
    "M406": { name: "Filament Width Sensor Off" },
    "M407": { name: "Filament Width" },
    "M410": { name: "Quickstop" },
    "M412": { name: "Filament Runout" },
    "M413": { name: "Power-loss Recovery" },
    "M420": { name: "Bed Leveling State" },
    "M421": { name: "Set Mesh Value" },
    "M422": { name: "Set Z Motor XY" },
    "M425": { name: "Backlash compensation" },
    "M428": { name: "Home Offsets Here" },
    "M430": { name: "Power Monitor" },
    "M486": { name: "Cancel Objects" },
    "M500": { name: "Save Settings" },
    "M501": { name: "Restore Settings" },
    "M502": { name: "Factory Reset" },
    "M503": { name: "Report Settings" },
    "M504": { name: "Validate EEPROM contents" },
    "M510": { name: "Lock Machine" },
    "M511": { name: "Unlock Machine" },
    "M512": { name: "Set Passcode" },
    "M524": { name: "Abort SD print" },
    "M540": { name: "Endstops Abort SD" },
    "M569": { name: "Set TMC stepping mode" },
    "M575": { name: "Serial baud rate" },
    "M600": { name: "Filament Change" },
    "M603": { name: "Configure Filament Change" },
    "M605": { name: "Dual Nozzle Mode" },
    "M665": { name: "Delta Configuration" },
    "M665": { name: "SCARA Configuration" },
    "M666": { name: "Set Delta endstop adjustments" },
    "M666": { name: "Set dual endstop offsets" },
    "M672": { name: "Test Speed Warning" },
    "M701": { name: "Load filament" },
    "M702": { name: "Unload filament" },
    "M710": { name: "Controller Fan settings" },
    "M808": { name: "Repeat Marker" },
    "M810": { name: "G-code macros" },
    "M811": { name: "G-code macros" },
    "M812": { name: "G-code macros" },
    "M813": { name: "G-code macros" },
    "M815": { name: "G-code macros" },
    "M816": { name: "G-code macros" },
    "M817": { name: "G-code macros" },
    "M818": { name: "G-code macros" },
    "M819": { name: "G-code macros" },
    "M851": { name: "XYZ Probe Offset" },
    "M852": { name: "Bed Skew Compensation" },
    "M860": { name: "I2C Position Encoders" },
    "M861": { name: "I2C Position Encoders" },
    "M862": { name: "I2C Position Encoders" },
    "M863": { name: "I2C Position Encoders" },
    "M864": { name: "I2C Position Encoders" },
    "M865": { name: "I2C Position Encoders" },
    "M866": { name: "I2C Position Encoders" },
    "M867": { name: "I2C Position Encoders" },
    "M868": { name: "I2C Position Encoders" },
    "M869": { name: "I2C Position Encoders" },
    "M871": { name: "Probe temperature config" },
    "M876": { name: "Handle Prompt Response" },
    "M900": { name: "Linear Advance Factor" },
    "M906": { name: "TMC Motor Current" },
    "M907": { name: "Set Motor Current" },
    "M908": { name: "Set Trimpot Pins" },
    "M909": { name: "DAC Print Values" },
    "M910": { name: "Commit DAC to EEPROM" },
    "M911": { name: "TMC OT Pre-Warn Condition" },
    "M912": { name: "Clear TMC OT Pre-Warn" },
    "M913": { name: "Set Hybrid Threshold Speed" },
    "M914": { name: "TMC Bump Sensitivity" },
    "M915": { name: "TMC Z axis calibration" },
    "M916": { name: "L6474 Thermal Warning Test" },
    "M917": { name: "L6474 Overcurrent Warning Test" },
    "M918": { name: "L6474 Speed Warning Test" },
    "M928": { name: "Start SD Logging" },
    "M951": { name: "Magnetic Parking Extruder" },
    "M993": { name: "SD / SPI Flash" },
    "M994": { name: "SD / SPI Flash" },
    "M995": { name: "Touch Screen Calibration" },
    "M997": { name: "Firmware update" },
    "M999": { name: "STOP Restart" },
    "M7219": { name: "MAX7219 Control" },
    "T0": { name: "Select Tool" },
    "T1": { name: "Select Tool" },
    "T2": { name: "Select Tool" },
    "T3": { name: "Select Tool" },
    "T4": { name: "Select Tool" },
    "T5": { name: "Select Tool" },
    "T6": { name: "Select Tool" }
}

function getMan(code) {
    if (code in docExtract) {
        return docExtract[code];
    } else {
        return null;
    }
}

class Line {
    constructor(str) {
        this.str = str;
        this.isParsed = false;

        // array of { str:String, code:?String, value:?String }
        this.tokens = [];
        // String
        this.comment = null;

        const lineRe = /^([^;]*)(;.*)?$/;
        const tokenRe = /^([A-Z])(-?[0-9\.]*)(\s|$)+/;

        let lineMatch = str.match(lineRe);
        if (lineMatch) {
            this.comment = lineMatch[2];
            let payload = lineMatch[1];
            while (payload.length > 0) {
                let token = null;
                let tokenMatch = payload.match(tokenRe);
                if (tokenMatch) {
                    token = tokenMatch[0];
                    let code = tokenMatch[1];
                    let value = tokenMatch[2];
                    let space = tokenMatch[3];
                    this.tokens.push({ str: `${code}${value}`, code: code, value: value, space: space });
                } else {
                    token = payload;
                    this.tokens.push({ str: token });
                }
                payload = payload.slice(token.length);
            }
            this.hasCode = this.tokens.length > 0 && this.tokens[0].code;
            this.isParsed = true;
        }
    }

    // return the first part of the line
    // [M0] A1 B2 str arg
    getCode() {
        if (this.hasCode) {
            return this.tokens[0];
        } else {
            console.warn("line could not be parsed");
        }
        return null;
    }

    // return the matching arg in the line
    // M0 [A1 B2] str arg
    getArg(argCode) {
        if (this.hasCode) {
            for (let token of this.tokens.slice(1)) {
                if (token.code == argCode) {
                    return token;
                }
            }
        } else {
            console.warn("line could not be parsed");
        }
        return null;
    }

    // return the last arg string
    // M0 A1 B2 [str arg]
    getLastArgStr() {
        if (this.hasCode) {
            if (!this.tokens[this.tokens.length - 1].code) {
                return this.tokens[this.tokens.length - 1].str;
            } else {
                console.warn("last token is not a string");
            }
        } else {
            console.warn("line could not be parsed");
        }
        return null;
    }

    // yield editor tokens according to str loaded
    *
    getEditorTokens() {
        if (!this.isParsed) {
            yield { class: "unparsed", str: this.str };
        } else {
            if (this.hasCode) {
                let first = this.getCode();
                let man = getMan(`${first.code}${first.value}`);
                yield { class: "code", str: `${first.code}${first.value}`, man: man };
                yield { str: first.space };

                for (let tok of this.tokens.slice(1)) {
                    if (tok.code != null) {
                        yield { class: "arg", str: `${tok.code}${tok.value}` };
                        yield { str: tok.space };
                    } else {
                        yield { class: "arg-str", str: tok.str };
                    }
                }
            }
            if (this.comment) {
                yield { class: "comment", str: this.comment };
            }
        }
    }
}


class Document {
    constructor(str) {
        this.lines = [];
        for (let line of str.split("\n")) {
            this.lines.push(new Line(line));
        }
    }
}


export { Document }