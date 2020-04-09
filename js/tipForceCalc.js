var ConcaveShapeFactors;
var FFBEShapeFactors;
// Fetches JSON's
fetch("../json/ConcaveShapeFactors.json")
  .then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    ConcaveShapeFactors = data;
  });
  fetch("../json/FFBEShapeFactors.json")
  .then(response => {
    return response.json();
  }).then(data => {
    console.log(data);
    ConcaveShapeFactors = data;
  });

/**
 * Returns tip force based on TSM 7th Edition
 * @param {number} width
 * @param {number} cupDepth
 * @param {number} land
 * @param {number} shapeFactor
 * @param {number} area
 * @param {boolean} engraved
 * @returns {number} tipForce(kN)
 */
function getTSM7thTipForce(width, cupDepth, land, shapeFactor, area, engraved) {
    if (isNaN(width) || isNaN(cupDepth) || isNaN(land) || isNaN(shapeFactor) || isNaN(area) || typeof(Boolean(engraved))!=="boolean") {

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
/**
 * Returns FFBE tip force based on TSM 7th Edition
 * @param {number} width
 * @param {number} cupDepth
 * @param {number} area
 * @param {number} bevelDepth
 * @param {number} bevelAngle
 * @param {boolean} engraved
 * @returns {number} tipForce(kN)
 */
function getFFBETSM7thTipForce( bevelDepth, bevelAngle, area, engraved){
    if (isNaN(bevelDepth) || isNaN(bevelAngle) || isNaN(area) || typeof(Boolean(engraved))!=="boolean") {
        return 0;
    }
    else {
        let tons = 0;
        let kN = 0;
        let engravedFactor = engraved ? 0.8 : 1;
        if (bevelDepth != 0 && bevelAngle != 0) {
            var scalar = Round(((30 - bevelAngle) * 2 + 100) / 100, 3);
            var pressuresArray = Object.keys(
                FFBEShapeFactors["cup_depth"]
              ).sort(function(a, b) {
                return Number(a) - Number(b);
              });
            for (let i = 0; i < pressuresArray.length; i++){
                if (cupDepth < pressuresArray[i]) {
                    if (i == 0) {
                        var key = pressuresArray[i].toString();
                        tons = scalar * FFBEShapeFactors["cup_depth"][key]["allowable_pressure"];
                        break;
                    } else {
                        if (Math.abs(cupDepth - pressuresArray[i]) < Math.abs(cupDepth - pressuresArray[i + 1])){
                            var key = pressuresArray[i].toString();
                            tons = scalar * FFBEShapeFactors["cup_depth"][key]["allowable_pressure"]* area * engraved;
                            break;
                        }
                        else {
                            var key = pressuresArray[i + 1].toString();
                            tons = scalar * FFBEShapeFactors["cup_depth"][key]["allowable_pressure"]* area * engraved;
                            break;
                        }
                    }
                }
                else if (pressuresArray[i].toString()==".025") {
                    tons = scalar * FFBEShapeFactors["cup_depth"][pressuresArray[i].toString()]["allowable_pressure"] * area * engraved;
                    break;
                }
                else {
                    i++;
                }
            }
            kN = tons * 8.896 ;
            return kN < 10 ? Round(kN, 2) : Round(kN, 1);
        }
    }
}
//! NEEDS FIXES
/**
 * Returns shape factor based on information provided. Only use for concave cup types.
 * @param {number} width
 * @param {number} length
 * @param {number} cupDepth
 * @param {number} land
 * @param {number} minorMajorRad - Minor Axis, Major Radius
 * @param {number} minorMinorRad - Minor Axis, Minor Radius
 * @param {number} majorMajorRad - Major Axis, Major Radius
 * @param {number} majorMinorRad - Major Axis, Minor Radius
 * @param {number} bevelDepth
 * @param {number} bevelAngle
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
        bevelDepth = Number(bevelDepth);
        bevelAngle = Number(bevelAngle);
        if (width == 0 || (minorMajorRad == 0 && minorMinorRad == 0 && majorMajorRad == 0 && majorMinorRad == 0)) {
            return 0;
        }
        else {
            // Diameter //! NEEDS FIXES
            if (length == 0) {
                if (minorMinorRad == 0 && minorMajorRad == 0) {
                    return 0;
                }
                //* CC
                else if (minorMinorRad != 0 && minorMajorRad != 0) {
                    //! Stuff
                }
                //* Single Radius
                else {
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
//! NEEDS FIXES
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
                let sideRadius = (Math.pow(endRadius, 2) - Math.pow((width / 2), 2) - Math.pow(length / 2 - endRadius, 2)) / (endRadius * 2 - width);
                let tab_b2 = (length / 2 - endRadius) * sideRadius / (sideRadius - endRadius);
                let tab_b = length / 2 - tab_b2;
                area = Math.asin((tab_b - endRadius) / endRadius) * Math.pow(endRadius, 2) / 2 + (tab_b - endRadius) * Math.sqrt(tab_b * (2 * endRadius - tab_b)) / 2 + Math.PI * Math.pow(endRadius, 2) / 4 + Math.asin(tab_b2 / sideRadius) * Math.pow(sideRadius, 2) / 2 + tab_b2 * Math.sqrt(Math.pow(sideRadius, 2) - Math.pow(tab_b2, 2)) / 2 + tab_b2 * (width / 2 - sideRadius);
                area *= 4;
                break;
            }
            case "4": { // 3 Rad Oval
                break;
            }
            case "5": { // Elliptical
                area = Math.PI * width * length / 4;
                break;
            }
            case "12": { // 12-Sided
                break;
            }
            case "30": { // Triangle
                break;
            }
            case "31": { // Arc Triangle
                break;
            }
            case "40": { // Square
                break;
            }
            case "41": { // Arc Square
                break;
            }
            case "42": { // Rectangle
                break;
            }
            case "43": { // Arc Rectangle
                break;
            }
            case "50": { // Pentagon
                break;
            }
            case "51": { // Arc Pentagon
                break;
            }
            case "60": { // Hexagon
                break;
            }
            case "61": { // Arc Hexagon
                break;
            }
            case "70": { // Heptagon
                break;
            }
            case "71": { // Arc Heptagon
                break;
            }
            case "80": { // Octagon
                break;
            }
            case "81": { // Arc Octagon
                break;
            }
            default: {
                return 0;
            }
        }
        return area;
    }
}