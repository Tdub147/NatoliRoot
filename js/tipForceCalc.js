/**
 * Returns tip force based on TSM 7th Edition
 * @param {number} width
 * @param {number} cupDepth
 * @param {number} land
 * @param {number} shapeFactor
 * @param {number} area
 * @param {boolean} engraved
 */
function getTSM7thTipForce(width, cupDepth, land, shapeFactor, area, engraved) {
    if (isNaN(width) || isNaN(cupDepth) || isNaN(land) || isNaN(shapeFactor) || isNaN(area) || typeof(Boolean(engraved))==="boolean") {

    }
    else {
        width = Number(width);
        cupDepth = Number(cupDepth);
        land = Number(land);
        shapeFactor = Number(shapeFactor);
        area = Number(area);
        engravedFactor = Boolean(engraved) ? 0.8 : 1.0;
        allowablePressure = 0;
        if (land < .0025) {
            allowablePressure = Math.pow(10, 5.539 - (4.6665 * shapeFactor));
        }
        else if(land <.0035){
            allowablePressure = Math.pow(10, 5.539 - (4.5184 * shapeFactor));
        }
        else if(land <.0045){
            allowablePressure = Math.pow(10, 5.539 - (4.3861 * shapeFactor));
        }
        else if(land <.0055){
            allowablePressure = Math.pow(10, 5.539 - (4.2665 * shapeFactor));
        }
        else if(land <.0065){
            allowablePressure = Math.pow(10, 5.539 - (4.1575 * shapeFactor));
        }
        else {
            allowablePressure = Math.pow(10, 5.539 - (4.0573 * shapeFactor));
        }
        // Round
        if (area == 0) {
            area = width * width * Math.PI / 4.0;
        }
        tons = allowablePressure * area * engravedFactor;
        kN = tons * 8.896;
        return kN < 10 ? Round(kN, 2) : Round(kN, 1);
    }
}
//! NEEDS FIXES
/**
 * Returns shape factor based on information provided.
 * @param {number} width
 * @param {number} length
 * @param {number} cupDepth
 * @param {number} land
 * @param {number} minorMajorRad - Minor Axis, Major Radius
 * @param {number} minorMinorRad - Minor Axis, Minor Radius
 * @param {number} majorMajorRad - Major Axis, Major Radius
 * @param {number} majorMinorRad - Major Axis, Minor Radius
 * @returns {number} shapeFactor
 */
function getShapeFactor(width, length, cupDepth, land, minorMajorRad, minorMinorRad, majorMajorRad, majorMinorRad) {
    if (isNaN(width) || isNaN(length) || isNaN(cupDepth) || isNaN(land) || isNaN(minorMajorRad) || isNaN(minorMinorRad) || isNaN(majorMajorRad) || isNaN(majorMinorRad)) {
        return 0;
    }
    else {
        var shapeFactor;
        width = Number(width);
        length = Number(length);
        cupDepth = Number(cupDepth);
        land = Number(land);
        minorMajorRad = Number(minorMajorRad);
        minorMinorRad = Number(minorMinorRad);
        majorMajorRad = Number(majorMajorRad);
        minorMajorRad = Number(minorMajorRad);
        if (width == 0 || (minorMajorRad == 0 && minorMinorRad == 0 && majorMajorRad == 0 && majorMinorRad == 0)) {
            return 0;
        }
        else {
            // Diameter //! NEEDS FIXES
            if (length == 0) {
                if (minorMinorRad == 0 && minorMajorRad == 0) {
                    return 0;
                }
                // CC
                else if (minorMinorRad != 0 && minorMajorRad != 0) {
                    //! Stuff
                }
                // Single Radius
                else{
                    shapeFactor = cupDepth / (1.0 * width);
                }
            }
            // Shaped //! NEEDS FIXES
            else {
                var minor = "Concave";
                var major = "Concave";
                var minorShapeFactor = 0;
                var majorShapeFactor = 0;
                if ((minorMajorRad == 0 && minorMinorRad == 0) || (minorMajorRad != 0 && minorMinorRad == 0)) {
                    minor = "Concave";
                }
                else if (minorMajorRad != 0 && minorMinorRad != 0) {
                    minor = "CC";
                }
                else if (minorMajorRad == 0 && minorMinorRad != 0) {
                    minor = "Capsule";
                }
                if ((majorMajorRad == 0 && majorMinorRad == 0) || (majorMajorRad != 0 && majorMinorRad == 0)) {
                    major = "Concave";
                }
                else if (majorMajorRad != 0 && majorMinorRad != 0) {
                    major = "CC";
                }
                else if (majorMajorRad == 0 && majorMinorRad != 0) {
                    major = "Capsule";
                }
                switch (minor) {
                    case "Concave": {
                        minorShapeFactor = cupDepth / (width * 1.0);
                        break;
                    }
                    case "CC": {
                        //! Stuff
                        break;
                    }
                    case "Capsule": {
                        //! Stuff
                        break;
                    }
                }
                switch (major) {
                    case "Concave": {
                        //! Stuff
                        break;
                    }
                    case "CC": {
                        //! Stuff
                        break;
                    }
                    case "Capsule": {
                        //! Stuff
                        break;
                    }
                }
                shapeFactor = Math.max(minorShapeFactor, majorShapeFactor);
            }
            return shapeFactor;
        }
    }
}
/**
 * Returns area in input units for diameter, capsule, or oval shapes.
 * @param {number} width
 * @param {number} length
 * @param {number} endRadius
 * @param {number} shapeCode - 1: "Diameter"; 2: "Capsule"; 3: "Oval";
 * @returns {number} area
 */
function getArea(width, length, endRadius, shapeCode) {
    if (isNaN(width) || isNaN(length) || isNaN(endRadius) || isNaN(shapeCode)) {

    }
    else {
        width = Number(width);
        length = Number(length);
        endRadius = Number(length);
        switch (shapeCode) {
            case "1": {
                area = Round(width * width * Math.PI / 4.0, 4);
                break;
            }
            case "2": {
                area = Round((width * width * Math.PI / 4.0) + (width * (length - 2 * endRadius)), 4);
                break;
            }
            case "3": {

                break;
            }
            default: {
                return 0;
            }
        }
        return area;
    }
}