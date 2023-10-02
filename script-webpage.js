function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (document.activeElement.id === 'numTestCases') {
            generateInputs();
        } else if (document.activeElement.id === 'calculateButton') {
            calculateResults();
        } else {
            // Move to the next input field
            var inputs = document.getElementsByTagName("input");
            for (var i = 0; i < inputs.length; i++) {
                if (document.activeElement === inputs[i]) {
                    if (i === inputs.length - 1) {
                        // Calculate results if it's the last input
                        calculateResults();
                    } else {
                        inputs[i + 1].focus();
                        break;
                    }
                }
            }
        }
    }
}


function generateInputs() {
    var numTestCases = parseInt(document.getElementById("numTestCases").value);
    var inputContainer = document.getElementById("inputContainer");

    // Check if the value is a valid number
    if (!isNaN(numTestCases) && numTestCases >= 1 && numTestCases <= 10) {
        // Generate input fields and show the container
        inputContainer.innerHTML = ""; // Clear previous content
        
        for (var i = 1; i <= numTestCases; i++) {
            var inputLabels = [
                "Density of water in (kg/m³) for case " + i,
                "Density of air in (kg/m³) for case " + i,
                "Static pressure manometer reading in m for case " + i,
                "Orifice meter manometer reading in m for case " + i,
                "Cross section of area of pipe in m² for case " + i,
                "Cross section of area of orifice in m² for case " + i,
                "Energy meter constant in rev/kwH for case " + i,
                "Number of revolutions (n) for case " + i,
                "Time for n revolutions of energy meter disc in sec for case " + i
            ];

            for (var j = 0; j < inputLabels.length; j++) {
                var inputLabel = document.createElement("label");
                inputLabel.textContent = inputLabels[j];

                var inputField = document.createElement("input");
                inputField.type = "text";
                inputField.name = "input" + ((i - 1) * 9 + j + 1);

                inputField.addEventListener("keydown", handleEnterKey);

                inputContainer.appendChild(inputLabel);
                inputContainer.appendChild(inputField);
                inputContainer.appendChild(document.createElement("br"));
            }
        }
        inputContainer.style.display = "block"; // Show the container
    } else {
        // Handle invalid input (e.g., show an error message)
        alert("Please enter a valid number of test cases (1-10).");
    }
}


function calculateResults() {
    // Your existing calculateResults() function code here...
    var numTestCases = parseInt(document.getElementById("numTestCases").value);

            // Check if all inputs are filled before displaying results
            var allInputsFilled = true;
            for (var i = 1; i <= numTestCases; i++) {
                for (var j = 1; j <= 9; j++) {
                    var inputField = document.getElementsByName("input" + ((i - 1) * 9 + j))[0];
                    if (!inputField || inputField.value === "") {
                        allInputsFilled = false;
                        break;
                    }
                }
                if (!allInputsFilled) {
                    break;
                }
            }

            if (allInputsFilled) {
                var resultsTable = document.createElement("table");
                resultsTable.id = "resultsTable";
                resultsTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Case</th>
                            <th>Static Head (Hs)</th>
                            <th>Head causing air flow (Ha)</th>
                            <th>Discharge (Q)</th>
                            <th>Velocity of air in pipe (V)</th>
                            <th>Dynamic Head (Hd)</th>
                            <th>Total Head (H)</th>
                            <th>Power output (Pout)</th>
                            <th>Power input (Pin)</th>
                            <th>Efficiency of blower (η)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Result rows will be added here using JavaScript -->
                    </tbody>
                `;

                var resultsContainer = document.getElementById("resultsContainer");
                resultsContainer.innerHTML = ""; // Clear previous results
                resultsContainer.appendChild(resultsTable);

                for (var i = 0; i < numTestCases; i++) {
                    // Access input values using document.getElementsByName and parse them
                    var d1 = parseFloat(document.getElementsByName("input" + (i * 9 + 1))[0].value);
                    var d2 = parseFloat(document.getElementsByName("input" + (i * 9 + 2))[0].value);
                    var h1 = parseFloat(document.getElementsByName("input" + (i * 9 + 3))[0].value);
                    var h2 = parseFloat(document.getElementsByName("input" + (i * 9 + 4))[0].value);
                    var a1 = parseFloat(document.getElementsByName("input" + (i * 9 + 5))[0].value);
                    var a2 = parseFloat(document.getElementsByName("input" + (i * 9 + 6))[0].value);
                    var k = parseFloat(document.getElementsByName("input" + (i * 9 + 7))[0].value);
                    var n = parseFloat(document.getElementsByName("input" + (i * 9 + 8))[0].value);
                    var t = parseFloat(document.getElementsByName("input" + (i * 9 + 9))[0].value);

                    // Perform calculations
                    var sh = ((d1 / d2) * h1).toFixed(2);
                    var hcaf = ((d1 / d2) * h2).toFixed(2);
                    var disc = ((0.62 * a1 * a2 * Math.sqrt(2 * 9.81 * hcaf)) / Math.sqrt(a1 * a1 - a2 * a2)).toFixed(2);
                    var voaip = (disc / a1).toFixed(2);
                    var dh = ((voaip * voaip) / (2 * 9.81)).toFixed(2);
                    var th = (parseFloat(dh) + parseFloat(sh)).toFixed(2);
                    var po = ((d2 * disc * 9.81 * th) / 1000).toFixed(2);
                    var pi = ((3600 * n) / (k * t)).toFixed(2);
                    var eff = ((po / pi) * 100).toFixed(2);

                    // Create a row for the results
                    var resultRow = document.createElement("tr");
                    resultRow.innerHTML = `
                        <td>${i + 1}</td>
                        <td>${sh}</td>
                        <td>${hcaf}</td>
                        <td>${disc}</td>
                        <td>${voaip}</td>
                        <td>${dh}</td>
                        <td>${th}</td>
                        <td>${po}</td>
                        <td>${pi}</td>
                        <td>${eff}%</td>
                    `;

                    var resultsBody = resultsTable.getElementsByTagName('tbody')[0];
                    resultsBody.appendChild(resultRow);
                }

                // Display the results container
                resultsContainer.style.display = "block";
            } else {
                alert("Please fill in all input fields before calculating.");
            }
}
