var NatoliRoundTolerances;
var NatoliShapedTolerances;
var ISOFundamentalDeviations;
var ISOToleranceGrades;
// Fetches JSON's
fetch('./json/NatoliRoundTolerances.json').then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    NatoliRoundTolerances = data;
})
fetch('./json/NatoliShapedTolerances.json').then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    NatoliShapedTolerances = data;
})
fetch('./json/ISOFundamentalDeviations.json').then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    ISOFundamentalDeviations = data;
})
ISOToleranceGrades = fetch('./json/ISOToleranceGrades.json').then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    ISOToleranceGrades = data;
})

// Hides or shows divs based on the tolerance style
function ToleranceStyle_OnInput() {
    if ($("#toleranceStyle").val() == "natoliTolerance") {
        $('#natoliStyleDiv').slideDown(600);
        $('#euStyleDiv').slideUp(300);
        $('#pmStyleDiv').slideUp(300);
        $('#width').attr('placeholder', 'Width (in)');
        $('#length').attr('placeholder', 'Length (in)');

        $('#width').prop('disabled', false);
        $('#length').prop('disabled', false);
    }
    else if ($("#toleranceStyle").val() == "euTolerance") {
        $('#natoliStyleDiv').slideUp(600);
        $('#euStyleDiv').slideDown(300);
        $('#pmStyleDiv').slideUp(300);
        $('#width').attr('placeholder', 'Width (mm)');
        $('#length').attr('placeholder', 'Length (mm)');
        $('#width').prop('disabled', false);
        $('#length').prop('disabled', false);
    }
    else if ($("#toleranceStyle").val() == "pmTolerance") {
        $('#pmStyleDiv').slideDown(600);
        $('#natoliStyleDiv').slideUp(300);
        $('#euStyleDiv').slideUp(300);

        $('#width').attr('placeholder', 'Width (mm)');
        $('#length').attr('placeholder', 'Length (mm)');
        $('#width').prop('disabled', false);
        $('#length').prop('disabled', false);
    }
    else {
        $('#natoliStyleDiv').slideUp(0);
        $('#euStyleDiv').slideUp(0);
        $('#pmStyleDiv').slideUp(0);

        $('#width').val("");
        $('#length').val("")
        $('#length').prop('disabled', true);
        $('#width').attr('placeholder', 'Width');
        $('#length').attr('placeholder', 'Length');
        $('#width').prop('disabled', true);
        $('#length').prop('disabled', true);
        $('#upperTolerance').html("");
        $('#lowerTolerance').html("");
        $('#dieTolerance').html("");
    }
    Calculate();
}

// On Document Ready
$(document).ready(function () {
    // Trigger toleranceStyle oninput event
    $("#toleranceStyle").trigger("oninput");
});

// Calls the calculators based on tolerance style
function Calculate() {
    switch ($("#toleranceStyle").val()) {
        case "natoliTolerance":
            NatoliCalculate();
            break;
        case "euTolerance":
            //$('#upperTolerance').html(EUCalculate(document.getElementById("#eUStyleUpperTipDeviation").val(), $("#eUStyleUpperTipGrade").val(), true));
            $('#upperTolerance').html(EUCalculate(eUStyleUpperTipDeviation.value, eUStyleUpperTipGrade.value, true));
            $('#lowerTolerance').html(EUCalculate(eUStyleLowerTipDeviation.value, eUStyleLowerTipGrade.value, true));
            $('#dieTolerance').html(EUCalculate(eUStyleDieDeviation.value, eUStyleDieGrade.value, false));
            break;
        case "pmTolerance":
            $("#upperTolerance").html(PMCalculate(pmHighUpperTipToleranceSign.value, pmLowUpperTipToleranceSign.value, pmHighUpperTipTolerance.value, pmLowUpperTipTolerance.value, true));
            $("#lowerTolerance").html(PMCalculate(pmHighLowerTipToleranceSign.value, pmLowLowerTipToleranceSign.value, pmHighLowerTipTolerance.value, pmLowLowerTipTolerance.value, true));
            $("#dieTolerance").html(PMCalculate(pmHighDieToleranceSign.value, pmLowDieToleranceSign.value, pmHighDieTolerance.value, pmLowDieTolerance.value, false));
            break;
        default:
            $('#upperTolerance').html("");
            $('#lowerTolerance').html("");
            $('#dieTolerance').html("");
            break;
    }
}
// Drives Size and Tolerance into upper/lower/die tolerances
function NatoliCalculate() {
    if ($("#toleranceStyle").val() == "natoliTolerance" && !isNaN($("#width").val()) && $("#width").val() != "") {
        // Width and Length
        if (!isNaN($("#length").val()) && $("#length").val() != "") {
            width = parseFloat($("#width").val());
            length = parseFloat($("#length").val());
            var upperClearance;
            var upperUpToSizeArray = Object.keys(NatoliShapedTolerances['upper']['up_to_size']).sort(function (a, b) { return a - b });
            for (let i = 0; i < upperUpToSizeArray.length; i++) {
                if (upperUpToSizeArray[i] >= length) {
                    key = upperUpToSizeArray[i].toString();
                    upperClearance = NatoliShapedTolerances['upper']['up_to_size'][key]['clearance'];
                    break;
                }
            }
            var lowerUpToSizeArray = Object.keys(NatoliShapedTolerances['lower']['up_to_size']).sort(function (a, b) { return a - b });
            for (let i = 0; i < lowerUpToSizeArray.length; i++) {
                if (lowerUpToSizeArray[i] >= length) {
                    key = lowerUpToSizeArray[i].toString();
                    lowerClearance = NatoliShapedTolerances['lower']['up_to_size'][key]['clearance'];
                    break;
                }
            }
            upperWidth = (width + upperClearance);
            upperWidthMetric = ((width + upperClearance) * 25.4);
            upperLength = (length + upperClearance);
            upperLengthMetric = ((length + upperClearance) * 25.4);
            lowerWidth = (width + lowerClearance);
            lowerWidthMetric = ((width + lowerClearance) * 25.4);
            lowerLength = (length + lowerClearance);
            lowerLengthMetric = ((length + lowerClearance) * 25.4);
            upperTolerance = GetToleranceAsHTML(true, (-0.0127), upperWidth, upperWidthMetric, upperLength, upperLengthMetric);
            lowerTolerance = GetToleranceAsHTML(true, (-0.0127), lowerWidth, lowerWidthMetric, lowerLength, lowerLengthMetric);
            dieTolerance = GetToleranceAsHTML(false, (0.0127), width, width * 25.4, length, length * 25.4);
            $('#upperTolerance').html(upperTolerance);
            $('#lowerTolerance').html(lowerTolerance);
            $('#dieTolerance').html(dieTolerance);
        }
        // Width only
        else {
            width = parseFloat($("#width").val());
            var upperClearance;
            var upperUpToSizeArray = Object.keys(NatoliRoundTolerances['upper']['up_to_size']).sort(function (a, b) { return a - b });
            for (let i = 0; i < upperUpToSizeArray.length; i++) {
                if (upperUpToSizeArray[i] >= length) {
                    key = upperUpToSizeArray[i].toString();
                    upperClearance = NatoliRoundTolerances['upper']['up_to_size'][key]['clearance'];
                    break;
                }
            }
            var lowerUpToSizeArray = Object.keys(NatoliRoundTolerances['lower']['up_to_size']).sort(function (a, b) { return a - b });
            for (let i = 0; i < lowerUpToSizeArray.length; i++) {
                if (lowerUpToSizeArray[i] >= length) {
                    key = lowerUpToSizeArray[i].toString();
                    lowerClearance = NatoliRoundTolerances['lower']['up_to_size'][key]['clearance'];
                    break;
                }
            }
            upperWidth = (width + upperClearance);
            upperWidthMetric = ((width + upperClearance) * 25.4);
            lowerWidth = (width + lowerClearance);
            lowerWidthMetric = ((width + lowerClearance) * 25.4);
            upperTolerance = GetToleranceAsHTML(true, (-0.0127), upperWidth, upperWidthMetric);
            lowerTolerance = GetToleranceAsHTML(true, (-0.0127), lowerWidth, lowerWidthMetric);
            dieTolerance = GetToleranceAsHTML(false, (0.0127), width, width * 25.4);
            $('#upperTolerance').html(upperTolerance);
            $('#lowerTolerance').html(lowerTolerance);
            $('#dieTolerance').html(dieTolerance);
        }
    }
}
// Rounds a number to a certain number of places
function Round(number, places) {
    console.log({ "Round": { "number": number, "places": places } });
    final = Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
    console.log({ "return": final });
    return final;
}
// Returns formatted Size and Tolerance
function GetToleranceAsHTML(isShaft, toleranceMetric, width, widthMetric, length = 0, lengthMetric = 0) {
    console.log({ "GetToleranceAsHTML": { "isShaft": isShaft, "toleranceMetric": toleranceMetric, "width": width, "widthMetric": widthMetric, "length": length, "lengthMetric": lengthMetric } });
    let toleranceSpan = ' <span class="frac"><sup>undefined</sup><span>&frasl;</span><sub>[undefined]</sub></span>';
    let diameterSymbol = "";
    let lengthString = ' X ' + length.toLocaleString(undefined, { minimumFractionDigits: 4 });
    let lengthStringMetric = ' X ' + lengthMetric.toLocaleString(undefined, { minimumFractionDigits: 4 });
    if (length === 0 && lengthMetric === 0) {
        diameterSymbol = '&#8960;';
        lengthString = "";
        lengthStringMetric = "";
    }
    if ((isShaft && toleranceMetric > 0) || (!isShaft && toleranceMetric < 0)) {
        widthMetric += toleranceMetric;
        lengthMetric += toleranceMetric;
        width = Round(widthMetric, 4);
        length = Round(lengthMetric, 4);
        toleranceMetric = toleranceMetric * -1;
    }
    if (toleranceMetric < 0) {
        toleranceSpan = ' <span class="frac"><sup>+0.0000/' + toleranceMetric.toLocaleString(undefined, { minimumFractionDigits: 4 }) + '</sup><span>&frasl;</span><sub>[+0.0000/' + Round(toleranceMetric / 25.4, 4).toLocaleString(undefined, { minimumFractionDigits: 4 }) + ']</sub></span>';
    }
    else {
        toleranceSpan = ' <span class="frac"><sup>+' + toleranceMetric.toLocaleString(undefined, { minimumFractionDigits: 4 }) + '/-0.0000</sup><span>&frasl;</span><sub>[+' + Round(toleranceMetric / 25.4, 4).toLocaleString(undefined, { minimumFractionDigits: 4 }) + '/-0.0000]</sub></span>';
    }
    return '<span class="frac"><sup>' + diameterSymbol + widthMetric.toLocaleString(undefined, { minimumFractionDigits: 4 }) + lengthStringMetric + '</sup><span>&frasl;</span><sub>[' + diameterSymbol + width.toLocaleString(undefined, { minimumFractionDigits: 4 }) + lengthString + ']</sub></span>' + toleranceSpan;
}
// Returns formatted Size and Tolerance
function EUCalculate(inputDeviation, inputGrade, isTip) {
    console.log({ "EUCalculate": { "inputDeviation": inputDeviation, "inputGrade": inputGrade, "isTip": isTip } });
    // Has width and has either both deviation and grade for tip or deviation and grade for die
    if (!isNaN($("#width").val()) && $("#width").val() != "" && (!(inputDeviation === "0" || inputDeviation === undefined || inputGrade === undefined || inputGrade === "0"))) {
        // Has deviation and grade for tip
        if (!(inputDeviation === "0" || inputGrade === "0")) {
            var type;
            if (isTip) {
                type = 'shaft';
            }
            else {
                type = 'bore';
            }
            // Has length (and width from above)
            if (!isNaN($("#length").val()) && $("#length").val() != "") {
                width = parseFloat($("#width").val());
                length = parseFloat($("#length").val());
                let devSize = "0";
                for (let i = 0; i < Object.keys(ISOFundamentalDeviations['up_to_size_mm']).length; i++) {
                    if (Object.keys(ISOFundamentalDeviations['up_to_size_mm'])[i] >= length) {
                        devSize = Object.keys(ISOFundamentalDeviations['up_to_size_mm'])[i];
                        break;
                    }
                }
                deviation = ISOFundamentalDeviations['up_to_size_mm'][devSize][inputDeviation] * ISOFundamentalDeviations[type] * 1;
                let gradeSize = "0";
                for (let i = 0; i < Object.keys(ISOToleranceGrades['up_to_size_mm']).length; i++) {
                    if (Object.keys(ISOToleranceGrades['up_to_size_mm'])[i] >= length) {
                        gradeSize = Object.keys(ISOToleranceGrades['up_to_size_mm'])[i];
                        break;
                    }
                }
                tolerance = ISOToleranceGrades['up_to_size_mm'][gradeSize]["IT" + inputGrade];
                if (deviation < 0) {
                    tolerance = tolerance * -1;
                }
                newWidthMetric = width + deviation;
                newLengthMetric = length + deviation;
                newWidth = Round((width + deviation) / 25.4, 4);
                newLength = Round((length + deviation) / 25.4, 4);
                finalTolerance = GetToleranceAsHTML(isTip, tolerance, newWidth, newWidthMetric, newLength, newLengthMetric);
                console.log({ "return": finalTolerance });
                return finalTolerance;
            }
            // Doesn't have length
            else {
                width = parseFloat($("#width").val());
                let devSize = "0";
                for (let i = 0; i < Object.keys(ISOFundamentalDeviations['up_to_size_mm']).length; i++) {
                    if (Object.keys(ISOFundamentalDeviations['up_to_size_mm'])[i] >= width) {
                        devSize = Object.keys(ISOFundamentalDeviations['up_to_size_mm'])[i];
                        break;
                    }
                }
                deviation = ISOFundamentalDeviations['up_to_size_mm'][devSize][inputDeviation] * ISOFundamentalDeviations[type] * 1;
                let gradeSize = "0";
                for (let i = 0; i < Object.keys(ISOToleranceGrades['up_to_size_mm']).length; i++) {
                    if (Object.keys(ISOToleranceGrades['up_to_size_mm'])[i] >= width) {
                        gradeSize = Object.keys(ISOToleranceGrades['up_to_size_mm'])[i];
                        break;
                    }
                }
                tolerance = ISOToleranceGrades['up_to_size_mm'][gradeSize]["IT" + inputGrade];
                if (deviation < 0) {
                    tolerance = tolerance * -1;
                }
                newWidthMetric = width + deviation;
                newWidth = Round((width + deviation) / 25.4, 4);
                finalTolerance = GetToleranceAsHTML(isTip, tolerance, newWidth, newWidthMetric);
                console.log({ "return": finalTolerance });
                return finalTolerance;
            }
        }
        else {
            console.log({ "return": "" });
            return "";
        }
    }
    else {
        console.log({ "return": "" });
        return "";
    }
}
// Returns formatted Size and Tolerance
function PMCalculate(highSign, lowSign, highAbs, lowAbs, isTip) {
    console.log({ "PMCalculate": { "highSign": highSign, "lowSign": lowSign, "highAbs": highAbs, "lowAbs": lowAbs, "isTip": isTip } });
    if (!isNaN($("#width").val()) && $("#width").val() != "" && !isNaN(highAbs) && highAbs != "" && !isNaN(lowAbs) && lowAbs != "") {
        let highMultiplier = 1
        if (highSign === "minus") {
            highMultiplier = -1;
        }
        let lowMultiplier = 1
        if (lowSign === "minus") {
            lowMultiplier = -1;
        }
        high = highMultiplier * highAbs;
        low = lowMultiplier * lowAbs;
        if (high < low) {
            _ = low;
            low = high;
            high = _;
        }
        widthMetric = parseFloat($("#width").val());
        var newWidthMetric
        var newWidth;
        if (isTip) {
            newWidthMetric = widthMetric + high;
            tolerance = low - high;
        }
        else {
            newWidthMetric = widthMetric + low;
            tolerance = high - low;
        }
        newWidth = Round(newWidthMetric / 25.4, 4);
        // Width and Length
        if (!isNaN($("#length").val()) && $("#length").val()) {
            lengthMetric = parseFloat($("#width").val());
            var newLengthMetric;
            var newLength;
            if (isTip) {
                newLengthMetric = lengthMetric + high;
                tolerance = low - high;
            }
            else {
                newLengthMetric = lengthMetric + low;
                tolerance = high - low;
            }
            newLength = Round(newLengthMetric / 25.4, 4);
            finalTolerance = GetToleranceAsHTML(isTip, tolerance, newWidth, newWidthMetric, newLength, newLengthMetric);
            console.log({ "return": finalTolerance });
            return finalTolerance;
        }
        // Width only
        else {
            finalTolerance = GetToleranceAsHTML(isTip, tolerance, newWidth, newWidthMetric);
            console.log({ "return": finalTolerance });
            return finalTolerance;
        }
    }
    else {
        console.log({ "return": "" });
        return "";
    }
}

