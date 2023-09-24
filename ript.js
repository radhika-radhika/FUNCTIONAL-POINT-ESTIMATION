const elements = ["Inputs", "Outputs", "Enquiry", "Logic files", "Interface files"];
const elementInputsDiv = document.getElementById("elementInputs");

// Dynamically generate input fields for each element
for (let i = 0; i < elements.length; i++) {
    const elementDiv = document.createElement("div");
    elementDiv.innerHTML = `
        <h3>${elements[i]}</h3>
        <label>Optimal: </label><input type="number" class="opt" required><br>
        <label>Likely: </label><input type="number" class="likely" required><br>
        <label>Pessimistic: </label><input type="number" class="pessimistic" required><br>
        <label>Weight: </label><input type="number" class="weight" required><br><br>
    `;
    elementInputsDiv.appendChild(elementDiv);
}

function calculate() {
    if (!validateInputs()) {
        alert('Please provide valid inputs for all fields.');
        return;
    }

    let totalFpCount = 0;

    const opts = document.querySelectorAll(".opt");
    const likelys = document.querySelectorAll(".likely");
    const pessimistics = document.querySelectorAll(".pessimistic");
    const weights = document.querySelectorAll(".weight");

    for (let i = 0; i < elements.length; i++) {
        const estimatedCount = Math.ceil((Number(opts[i].value) + (4 * Number(likelys[i].value)) + Number(pessimistics[i].value)) / 6.0);
        const fpCount = estimatedCount * Number(weights[i].value);
        totalFpCount += fpCount;
    }

    const pr = parseFloat(document.getElementById("productivityRate").value);
    const lr = parseInt(document.getElementById("labourRate").value);

    const fpEstimatedAnswer = fpEstimated(totalFpCount);
    const effort = productivityRate(pr, fpEstimatedAnswer);
    const cost = costCalculation(lr, effort);

    const resultsContent = `
        <p><b>FP Estimation: ${fpEstimatedAnswer}</p>
        <p><b>Effort: ${effort} person-month</p>
        <p><b>Cost: ${cost}</p>
    `;

    document.getElementById("resultsContent").innerHTML = resultsContent;
    document.getElementById("resultsDiv").style.display = "block";
}

function validateInputs() {
    // Check elements input fields
    const opts = document.querySelectorAll(".opt");
    const likelys = document.querySelectorAll(".likely");
    const pessimistics = document.querySelectorAll(".pessimistic");
    const weights = document.querySelectorAll(".weight");
    
    for (let input of [...opts, ...likelys, ...pessimistics, ...weights]) {
        if (input.value === "" || isNaN(input.value)) {
            return false;
        }
    }

    // Check productivity and labour rate
    const pr = document.getElementById("productivityRate").value;
    const lr = document.getElementById("labourRate").value;
    
    if (pr === "" || isNaN(pr) || lr === "" || isNaN(lr)) {
        return false;
    }
    
    return true;
}

function fpEstimated(totalFpCount) {
    const level = parseInt(prompt("Enter your level: \n 1. Not Important \n 2. More Important \n 3. Moderate \n 4. Essential \n 5. Absolute"));
    if (isNaN(level) || level < 1 || level > 5) {
        alert('Invalid level input. Please enter a value between 1 and 5.');
        return 0;
    }
    return Math.ceil(totalFpCount * (0.65 + 0.01 * (14 * level)));
}

function productivityRate(pr, fpEstimatedAnswer) {
    return Math.ceil(fpEstimatedAnswer / pr);
}

function costCalculation(c, effort) {
    return c * effort;
}