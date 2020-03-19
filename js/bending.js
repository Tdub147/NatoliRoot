
function getTipForceBendingDiameter(largeDiameter, tipStraight = 1, smallDiameter = 0, modE = 30000000, syc = 275000) {
    // Based on end conditions (taken from bending stress calculator)
    const leff = 2.0;
    if (isNaN(largeDiameter) || isNaN(smallDiameter) || isNaN(tipStraight)) {
        console.log("Parameters for calculateBendingDiameter() includes at least 1 non-number.")
    }
    else {
        largeDiameter = Number(largeDiameter);
        smallDiameter = Number(smallDiameter);
        tipStraight = Number(tipStraight);
        // Second Moment of Inertia
        i2 = (Math.pow(largeDiameter, 4) - Math.pow(smallDiameter, 4)) * Math.PI / 64.0;
        // Effective area
        a = (Math.pow(largeDiameter, 2) - Math.pow(smallDiameter, 2)) * Math.PI / 4.0;
        // Radius of gyration (for when smallDiameter != 0)
        k = Math.sqrt(i2 / a);
        effTipStraight = leff * tipStraight;
        sr = effTipStraight / k;
        srd = Math.sqrt(2 * modE / syc) * Math.PI;
        if (sr >= srd) {
            eulerTons = Math.pow(Math.PI, 2) * modE * a / (Math.pow(sr, 2) * 2000.0);
            eulerkN = eulerTons * 8.896;
            return eulerkN;
        }
        else {
            johnsonTons = a * (syc - (Math.pow(syc * sr / (2 * Math.PI), 2) / modE)) / 2000;
            johnsonkN = johnsonTons * 8.896;
            return johnsonkN;
        }
    }
}

function toggleCoreRodInput() {
    var inputText = document.getElementById("innerDiameter");
    $(inputText).fadeToggle("100ms");
}

function inputChanged() {

}