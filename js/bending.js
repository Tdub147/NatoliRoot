var steelInformation;
const request = async () => {
    const response = await fetch('../json/steelInformation.json');
    steelInformation = await response.json();
    console.log(steelInformation);
    // Whatever code that relies on this information on load
    fillSteelSelector();
    styleDropDowns();
}
request();



function getTipForceBendingDiameter(largeDiameter, tipStraight = 1, smallDiameter = 0, modE = 30000000, syc = 275000) {
    // Based on end conditions (taken from bending stress calculator)
    const leff = 2.0;
    if (isNaN(largeDiameter) || Number(largeDiameter) == 0  || isNaN(smallDiameter) || isNaN(tipStraight)) {
        console.log("Parameters for calculateBendingDiameter() includes at least 1 non-number.");
        return "N/A";
    }
    else {
        largeDiameter = Number(largeDiameter);
        smallDiameter = Number(smallDiameter);
        tipStraight = Number(tipStraight == "" ? 1 : tipStraight);
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
            return eulerkN > 10 ? Round(eulerkN, 1) : Round(eulerkN, 2);
        }
        else {
            johnsonTons = a * (syc - (Math.pow(syc * sr / (2 * Math.PI), 2) / modE)) / 2000;
            johnsonkN = johnsonTons * 8.896;
            console.log(johnsonkN);
            return johnsonkN > 10 ? Round(johnsonkN, 1) : Round(johnsonkN, 2);
        }
    }
}

function toggleCoreRodInput() {
    var inputText = document.getElementById("innerDiameter");
    $(inputText).fadeToggle("100ms");
}

function inputChanged() {
    var modE = document.getElementById('modE');
    var syc = document.getElementById('syc');
    var pc = document.getElementById('pc');
    var outerDiameter = document.getElementById('outerDiameter');
    var tipStraight = document.getElementById('tipStraight');
    var coreRod = document.getElementById('coreRod');
    var innerDiameter = document.getElementById('innerDiameter');
    var steelSelector = document.getElementById("steelSelector");
    var selectedSteel = steelSelector.options[steelSelector.selectedIndex].value;
    modE.innerText = steelInformation[selectedSteel]["Modulus of Elasticity"]["value"];
    syc.innerText = steelInformation[selectedSteel]["Yield Strength"]["value"];
    pc.innerText = getTipForceBendingDiameter(outerDiameter.value, tipStraight.value, (coreRod.checked ? innerDiameter.value : 0), modE.innerText, syc.innerText);
}

function SelectorClick(element, e){
    e.preventDefault();
    e.stopPropagation();
    closeAllSelect(element);
}

function fillSteelSelector() {
    var steelSelector = document.getElementById("steelSelector");
    var steelSelectionDropDivs = document.getElementById("steelSelectionDropDivs");
    var steelKeys = Object.keys(steelInformation);
    for (let i = 0; i < steelKeys.length; i++){
        var option = document.createElement('option');
        option.innerHTML = steelKeys[i];
        steelSelector.appendChild(option);
        if (option.innerText == "ESR S7 STEEL") {
            steelSelector.options[i].selected = 'selected';
        }
        var div = document.createElement('div');
        steelSelectionDropDivs.appendChild(div);
    }
}