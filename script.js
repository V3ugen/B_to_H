const tableData = [
    ["DL145-200", "237.8", "822", "1406.2", "1990.4", "2574.6", "3158.8"],
    ["DL135-T125 outside", "441", "892.2", "1355.4", "1812.6", "2269.8", "2727"],
    ["DL132-145", "453.7", "999.8", "1545.9", "2092.2", "2638.1", ""],
    ["DL120-200TP", "377.5", "1291.9", "2206.3", "", "", ""],
    ["DL120-145TP", "377.5", "1291.9", "2206.3", "", "", ""],
    ["DL120-145TPNBE", "250.5", "822", "1393.5", "1965", "2536.5", ""],
    ["DL121-115TPNBE", "237.8", "822", "1406.2", "1990.4", "2574.6", ""],
    ["DL108-200TPBE", "342.8", "927", "1511.2", "2095.4", "", ""],
    ["DL108-200TPNBE", "237.8", "822", "1406.2", "1990.4", "", ""],
    ["DL101-145TPBE", "390.2", "847.4", "1457", "1914.2", "", ""],
    ["DL96-TPNE", "288.6", "822", "1355.4", "1888.8", "", ""],
    ["DL75-115TNBE", "237.8", "882", "1406.2", "", "", ""],
    ["DL74.80-200TPBE", "502.7", "1135.9", "", "", "", ""],
    ["DL72", "237.8", "783.9", "1330", "", "", ""],
    ["DL72-T125TPNE outside", "643", "1100", "", "", "", ""],
    ["DL56-145TPNBE", "301.3", "860.1", "", "", "", ""],
    ["DL55", "301.3", "847.4", "", "", "", ""],
    ["DL52", "237.8", "822", "", "", "", ""],
    ["DL48-200", "237.8", "720.4", "", "", "", ""],
    ["DL40-T125TPN outside", "482.5", "", "", "", "", ""],
    ["DL39.13-200TPBE", "366.6", "", "", "", "", ""],
    ["DL34-115", "301.3", "", "", "", "", ""]
];

// Automatically generate table on load
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("tableBody");
    if(!tbody) return;
    tableData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach((cell, index) => {
            const td = document.createElement("td");
            if (index === 0) {
                td.innerHTML = `<strong>${cell}</strong>`;
            } else {
                td.textContent = cell === "" ? "—" : cell;
                if(cell === "") td.style.textAlign = "center";
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
});

// Tab switching (SPA)
function switchPage(pageId, buttonElement) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active');
    if(buttonElement) buttonElement.classList.add('active');
}

// Input sanitization and dot fix
function sanitizeAndCalculate(inputElement, calculationFunction) {
    let value = inputElement.value.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    if (inputElement.value !== value) inputElement.value = value;
    calculationFunction();
}

// Tab 1: Direct Calculation
function calculateDirect() {
    const val = document.getElementById('directInput').value;
    const display = document.getElementById('directDisplay');
    if (val !== "" && val !== "-" && val !== ".") {
        display.textContent = "Bar is: " + ((parseFloat(val) * 25.4) - 261).toFixed(2);
    } else { display.textContent = "Waiting for input..."; }
}

// Tab 1: Reverse Calculation
function calculateReverse() {
    const val = document.getElementById('reverseInput').value;
    const display = document.getElementById('reverseDisplay');
    if (val !== "" && val !== "-" && val !== ".") {
        display.textContent = "Housing is: " + ((parseFloat(val) + 261) / 25.4).toFixed(4);
    } else { display.textContent = "Waiting for input..."; }
}

// Tab 2: IMPB Calculation
function calculateComplex() {
    const val1 = document.getElementById('complexInput1').value;
    const val2 = document.getElementById('complexInput2').value;
    const isV1 = val1 !== "" && val1 !== "-" && val1 !== ".";
    const isV2 = val2 !== "" && val2 !== "-" && val2 !== ".";

    if (isV1 || isV2) {
        const r1 = ((isV1 ? parseFloat(val1) : 0) * 12 + (isV2 ? parseFloat(val2) : 0)) * 25.4;
        document.getElementById('resComplex1').textContent = "In millimeters: " + r1.toFixed(2);
        document.getElementById('resComplex3').textContent = "Housings: " + (r1 - 236).toFixed(2);
        document.getElementById('resComplex2').textContent = "Insulators: " + (r1 - 193).toFixed(2);
        document.getElementById('resComplex4').textContent = "Conductors: " + (r1 - 42).toFixed(2);
    } else {
        document.getElementById('resComplex1').textContent = "In millimeters: —";
        document.getElementById('resComplex3').textContent = "Housings: —";
        document.getElementById('resComplex2').textContent = "Insulators: —";
        document.getElementById('resComplex4').textContent = "Conductors: —";
    }
}

// Tab 3: Support Bolt Hole Calculation (Tape measure tape ticks)
function calculateSupportHoles() {
    const inputEl = document.getElementById('boltLengthInput');
    const display = document.getElementById('resBoltHoles');
    
    if (!inputEl || !display) return;
    
    const val = inputEl.value;
    
    if (val !== "" && val !== "-" && val !== ".") {
        const length = parseFloat(val);
        
        if (length >= 1 && length < 1200) {
            display.innerHTML = "Result: No holes";
        } 
        else if (length >= 1200 && length < 2100) {
            const step = length / 2;
            display.innerHTML = `
                <div class="result-item">Pitch: ${step.toFixed(2)} mm</div>
                <div class="result-item" style="color: #6f42c1; margin-top: 5px;">
                    Tape measure marks:<br>
                    📍 1st hole: <strong>${step.toFixed(2)} mm</strong>
                </div>
            `;
        } 
        else if (length >= 2100 && length <= 3396) {
            const step = length / 3;
            const mark2 = step * 2;
            display.innerHTML = `
                <div class="result-item">Pitch: ${step.toFixed(2)} mm</div>
                <div class="result-item" style="color: #6f42c1; margin-top: 5px;">
                    Tape measure marks:<br>
                    📍 1st hole: <strong>${step.toFixed(2)} mm</strong><br>
                    📍 2nd hole: <strong>${mark2.toFixed(2)} mm</strong>
                </div>
            `;
        } 
        else if (length > 3396) {
            display.innerHTML = "Result: Exceeds 3396 mm";
        } 
        else {
            display.innerHTML = "Result: Waiting for input...";
        }
    } else { 
        display.innerHTML = "Result: Waiting for input..."; 
    }
}

// Table search filtering
function sanitizeSearchAndFilter(inputElement) {
    let value = inputElement.value.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
    if (inputElement.value !== value) {
        inputElement.value = value;
    }
    
    const filter = value.toUpperCase();
    const rows = document.getElementById("dataTable").getElementsByTagName("tr");
    
    for (let i = 1; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td");
        if (td) {
            const textValue = td[0].textContent || td[0].innerText;
            rows[i].style.display = textValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

// Clear table search input
function clearTableSearch() {
    const searchBox = document.getElementById("tableSearch");
    if (searchBox) {
        searchBox.value = "";
        sanitizeSearchAndFilter(searchBox);
    }
}

// Service worker execution
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
