// Convert input from metric to inches
function convert (input, output) {
    var res = parseFloat(document.getElementById(input).value) / 25.4;
    var cd = parseFloat(document.getElementById('OLInput').value) - parseFloat(document.getElementById('WLInput').value);
    document.getElementById(output).innerHTML = parseFloat(res.toFixed(4));
    document.getElementById('CDMetricLabel').innerHTML = parseFloat(cd.toFixed(4));
    document.getElementById('CDLabel').innerHTML = parseFloat((cd / 25.4).toFixed(4));
}
// Do the working length math
function do_math () {
    // Metric OL numbers
    var mm_OL = parseFloat(document.getElementById('OLInput').value);
    var mm_OL_tol_top = parseFloat(document.getElementById('OLtoltop_input').value);
    var mm_OL_tol_bot = parseFloat(document.getElementById('OLtolbot_input').value);
    var mm_OL_top = parseFloat((mm_OL + mm_OL_tol_top).toFixed(2));
    var mm_OL_bot = parseFloat((mm_OL - mm_OL_tol_bot).toFixed(2));

    // Metric WL numbers
    var mm_WL = parseFloat(document.getElementById('WLInput').value);
    var mm_WL_tol_top = parseFloat(document.getElementById('WLtoltop_input').value);
    var mm_WL_tol_bot = parseFloat(document.getElementById('WLtolbot_input').value);
    var mm_WL_top = parseFloat((mm_WL + mm_WL_tol_top).toFixed(4));
    var mm_WL_bot = parseFloat((mm_WL - mm_WL_tol_bot).toFixed(4));
    
    // Metric CD numbers
    var mm_CD = parseFloat((mm_OL - mm_WL).toFixed(4));
    var mm_CD_tol_top = parseFloat(document.getElementById('CDtoltop_input').value);
    var mm_CD_tol_bot = parseFloat(document.getElementById('CDtolbot_input').value);
    var mm_CD_top = parseFloat((mm_CD + mm_CD_tol_top).toFixed(2));
    var mm_CD_bot = parseFloat((mm_CD - mm_CD_tol_bot).toFixed(2));

    var inch_OL = parseFloat((document.getElementById('OLInput').value / 25.4).toFixed(5));
    var inch_WL = parseFloat((document.getElementById('WLInput').value / 25.4).toFixed(4));
    var inch_CD = parseFloat((inch_OL - inch_WL).toFixed(5));
    var inch_WL_tol_bot = round_up(inch_WL - (mm_WL_bot / 25.4), 4);
    var inch_WL_tol_top = parseFloat((mm_WL_tol_top + mm_WL_tol_bot) / 25.4).toFixed(4) - inch_WL_tol_bot;
    var inch_OL_tol_bot = round_up(inch_OL - (mm_OL_bot / 25.4), 4);
    var inch_OL_tol_top = parseFloat((mm_OL_tol_top + mm_OL_tol_bot) / 25.4).toFixed(4) - inch_OL_tol_bot;
    var inch_CD_tol_bot = parseFloat(inch_CD - (mm_CD_bot / 25.4)).toFixed(4);
    var inch_CD_tol_top = parseFloat((mm_CD_tol_top + mm_CD_tol_bot) / 25.4).toFixed(4) - inch_CD_tol_bot;

    document.getElementById('OLResultLabel').innerHTML = '+' + parseFloat(inch_OL_tol_top).toFixed(4) + '/-' + parseFloat(inch_OL_tol_bot).toFixed(4);
    document.getElementById('WLResultLabel').innerHTML = '+' + parseFloat(inch_WL_tol_top).toFixed(4) + '/-' + parseFloat(inch_WL_tol_bot).toFixed(4);
    document.getElementById('CDResultLabel').innerHTML = '+' + parseFloat(inch_CD_tol_top).toFixed(4) + '/-' + parseFloat(inch_CD_tol_bot).toFixed(4);
}
// Force a round up in the number of digits specified
function round_up (input, digits) {
    var out = input;
    return out.toString().slice(0, digits + 2);
}
// Clear the values entered and results
function clear_values () {
    location.reload();
}
// Change drop down styling
function selected () {
    document.getElementById("custom-selector").style.borderRadius = "0px";
}
