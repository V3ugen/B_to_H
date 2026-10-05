const tableData = [
    ["DL144-200", "237.8", "822", "1406.2", "1990.4", "2574.6", "3158.8"],
    ["DL144 80-TPNBE", "237.8", "822", "1406.2", "1990.4", "2574.6", "3158.8"],
    ["DL135-T125-TPN outside", "441", "892.2", "1355.4", "1812.6", "2269.8", "2727"],
    ["DL132 145-TPN", "453.7", "999.8", "1545.9", "2092.2", "2638.1", ""],
    ["DL120 115-TPBE", "631.5", "1393.5", "2155.5", "", "", ""],
    ["DL120-200-TP", "377.5", "1291.9", "2206.3", "", "", ""],
    ["DL120 145-TP", "377.5", "1291.9", "2206.3", "", "", ""], 
    ["DL120 145-TPNBE", "250.5", "822", "1393.5", "1965", "2536.5", ""],
    ["DL121 115-TPNBE", "237.8", "822", "1406.2", "1990.4", "2574.6", ""],
    ["DL118 145-TPN", "1190.3", "1647.5", "", "", "", ""],
    ["DL108-200-TPBE", "342.8", "927", "1511.2", "2095.4", "", ""],
    ["DL108-200-TPNBE", "237.8", "822", "1406.2", "1990.4", "", ""],
    ["DL101 145-TPBE", "390.2", "847.4", "1457", "1914.2", "", ""],
    ["DL96 115-TPBE", "631.5", "1545.9", "", "", "", ""],
    ["DL96 80-TPNBE", "269.6", "815.7", "1361.8", "1907.9", "", ""],
    ["DL96-TPNE", "288.6", "822", "1355.4", "1888.8", "", ""],
    ["DL83.40 115-TPNBE", "237.8", "928.7", "1619.6", "", "", ""],
    ["DL82 115-TPBE", "529.9", "1291.9", "", "", "", ""],
    ["DL75 115-TNBE", "237.8", "882", "1406.2", "", "", ""],
    ["DL74.80-200TPBE", "502.7", "1135.9", "", "", "", ""],
    ["DL72", "237.8", "783.9", "1330", "", "", ""],
    ["DL72-T125-TPNE outside", "643", "1100", "", "", "", ""],
    ["DL56 145-TPNBE", "301.3", "860.1", "", "", "", ""],
    ["DL55", "301.3", "847.4", "", "", "", ""],
    ["DL52 115-TPNBE", "237.8", "822", "", "", "", ""],
    ["DL50.64", "512.6", "", "", "", "", ""],
    ["DL48-200", "237.8", "720.4", "", "", "", ""],
    ["DL40-T125-TPN outside", "482.5", "", "", "", "", ""],
    ["DL39.13-200-TPBE", "366.6", "", "", "", "", ""],
    ["DL34 115-TPNBE", "301.3", "", "", "", "", ""]
];
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

function switchPage(pageId, buttonElement) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    if(targetPage) targetPage.classList.add('active');
    if(buttonElement) buttonElement.classList.add('active');
}

// ФИКС ОШИБКИ: Теперь строки обрабатываются корректно без падения движка JS
function sanitizeAndCalculate(inputElement, calculationFunction) {
    let value = inputElement.value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    
    let integerPart = parts[0] ? parts[0].substring(0, 4) : ''; 
    
    if (parts.length > 1) {
        let decimalPart = parts[1].substring(0, 2); 
        value = integerPart + '.' + decimalPart;
    } else {
        value = integerPart;
    }
    
    if (inputElement.value !== value) {
        inputElement.value = value;
    }
    calculationFunction();
}
let directTimer = null;
let reverseTimer = null;
let complexTimer = null;

const KEY_DIRECT = 'hpbHousingHistory';
const KEY_REVERSE = 'barsReverseHistory';
const KEY_COMPLEX = 'impbComplexHistory';

// 1. HPB HOUSING
function calculateDirect() {
    const val = document.getElementById('directInput').value;
    const display = document.getElementById('directDisplay');
    clearTimeout(directTimer);
    if (val !== "" && val !== "-" && val !== ".") {
        const res = ((parseFloat(val) * 25.4) - 261).toFixed(1);
        display.textContent = "Housing millimeters: " + res;
        directTimer = setTimeout(() => commitHistory(KEY_DIRECT, val, res, renderDirectHistory), 1500);
    } else { display.textContent = "Waiting for input..."; }
}

// 2. BARS MILLIMETERS TO HOUSING
function calculateReverse() {
    const val = document.getElementById('reverseInput').value;
    const display = document.getElementById('reverseDisplay');
    clearTimeout(reverseTimer);
    if (val !== "" && val !== "-" && val !== ".") {
        const result = (parseFloat(val) + 51) / 25.4;
        const resStr = result.toFixed(2);
        display.textContent = "Housing is: " + resStr + " inches";
        reverseTimer = setTimeout(() => commitHistory(KEY_REVERSE, val, resStr, renderReverseHistory), 1500);
    } else { display.textContent = "Waiting for input..."; }
}

// 3. IMPB CALCULATOR
function calculateComplex() {
    const val1 = document.getElementById('complexInput1').value;
    const val2 = document.getElementById('complexInput2').value;
    const isV1 = val1 !== "" && val1 !== "-" && val1 !== ".";
    const isV2 = val2 !== "" && val2 !== "-" && val2 !== ".";
    clearTimeout(complexTimer);

    if (isV1 || isV2) {
        const r1 = ((isV1 ? parseFloat(val1) : 0) * 12 + (isV2 ? parseFloat(val2) : 0)) * 25.4;
        document.getElementById('resComplex1').textContent = "In millimeters: " + r1.toFixed(1);
        document.getElementById('resComplex3').textContent = "Housings: " + (r1 - 236).toFixed(1);
        document.getElementById('resComplex2').textContent = "Insulators: " + (r1 - 193).toFixed(1);
        document.getElementById('resComplex4').textContent = "Conductors: " + (r1 - 42).toFixed(1);

        const summaryInput = (val1 || '0') + ' ft / ' + (val2 || '0') + ' in';
        complexTimer = setTimeout(() => commitHistory(KEY_COMPLEX, summaryInput, r1.toFixed(1) + ' mm', renderComplexHistory), 1500);
    } else {
        document.getElementById('resComplex1').textContent = "In millimeters: —";
        document.getElementById('resComplex3').textContent = "Housings: —";
        document.getElementById('resComplex2').textContent = "Insulators: —";
        document.getElementById('resComplex4').textContent = "Conductors: —";
    }
}

function getHistory(key) {
    try { const data = JSON.parse(localStorage.getItem(key)); return Array.isArray(data) ? data.slice(0, 4) : []; }
    catch(e) { return []; }
}

function commitHistory(key, inputVal, resultVal, renderFunc) {
    if (!inputVal || inputVal === ".") return;
    let list = getHistory(key).filter(item => item.input !== inputVal);
    list.unshift({ input: String(inputVal), result: String(resultVal) });
    list = list.slice(0, 4);
    try { localStorage.setItem(key, JSON.stringify(list)); } catch(e) {}
    renderFunc();
}

function renderDirectHistory() { buildHistoryUI('directHistory', KEY_DIRECT, 'hpb'); }
function renderReverseHistory() { buildHistoryUI('reverseHistory', KEY_REVERSE, 'bars'); }
function renderComplexHistory() { buildHistoryUI('complexHistory', KEY_COMPLEX, 'impb'); }

function buildHistoryUI(boxId, storageKey, type) {
    const box = document.getElementById(boxId);
    if (!box) return;
    const hist = getHistory(storageKey);
    box.innerHTML = '';
    if (!hist.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';

    const title = document.createElement('div');
    title.className = 'history-title';
    title.textContent = 'Last sizes (tap to reuse):';
    box.appendChild(title);

    hist.forEach(h => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'history-item';
        
        if (type === 'hpb') {
            b.textContent = h.input + ' in  →  ' + h.result + ' mm';
            b.onclick = () => { document.getElementById('directInput').value = h.input; calculateDirect(); };
        } else if (type === 'bars') {
            b.textContent = h.input + ' mm  →  ' + h.result + ' in';
            b.onclick = () => { document.getElementById('reverseInput').value = h.input; calculateReverse(); };
        } else if (type === 'impb') {
            b.textContent = h.input + '  →  ' + h.result;
            b.onclick = () => {
                const parts = h.input.replace(/\s+/g, '').split('/');
                const fPart = parts[0] ? parts[0].replace('ft', '') : '';
                const iPart = parts[1] ? parts[1].replace('in', '') : '';
                document.getElementById('complexInput1').value = fPart === '0' ? '' : fPart;
                document.getElementById('complexInput2').value = iPart === '0' ? '' : iPart;
                calculateComplex();
            };
        }
        box.appendChild(b);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDirectHistory();
    renderReverseHistory();
    renderComplexHistory();
});

// SUPPORT BOLT HOLE
function calculateSupportHoles() {
    const inputEl = document.getElementById('boltLengthInput');
    const display = document.getElementById('resBoltHoles');
    if (!inputEl || !display) return;
    const val = inputEl.value;

    if (val === "" || val === "-" || val === ".") {
        display.innerHTML = "Result: Waiting for input...";
        return;
    }

    const length = parseFloat(val);
    const mark = (text) => `<span style="color: #6f42c1; font-size: 0.9em;">📍 ${text}</span>`;

    if (length < 1200) {
        display.innerHTML = "Result: No holes";
    } else if (length < 2100) {
        const step = length / 2;
        display.innerHTML =
            `Pitch: ${step.toFixed(1)} mm<br>` +
            `Tape measure marks:<br>` +
            mark(`1st hole: ${step.toFixed(1)} mm`);
    } else if (length <= 3396) {
        const step = length / 3;
        display.innerHTML =
            `Pitch: ${step.toFixed(1)} mm<br>` +
            `Tape measure marks:<br>` +
            mark(`1st hole: ${step.toFixed(1)} mm`) + `<br>` +
            mark(`2nd hole: ${(step * 2).toFixed(1)} mm`);
    } else {
        display.innerHTML = "Result: Exceeds 3396 mm";
    }
}

function sanitizeSearchAndFilter(inputElement) {
    let value = inputElement.value.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
    if (inputElement.value !== value) inputElement.value = value;

    const filter = value.toUpperCase();
    const rows = document.querySelectorAll("#tableBody tr");
    rows.forEach(row => {
        const firstCell = row.cells[0];
        const text = firstCell ? firstCell.textContent.toUpperCase() : "";
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

function clearTableSearch() {
    const searchBox = document.getElementById("tableSearch");
    if (searchBox) { searchBox.value = ""; sanitizeSearchAndFilter(searchBox); }
}

function clearInputField(inputId, calculationFunction) {
    const inputEl = document.getElementById(inputId);
    if (inputEl) { inputEl.value = ""; calculationFunction(); }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.log(err));
}
// База данных конфигураций с фотографии 
const tpData = {
    "TP": { bars: "3 bars", lid: "56.55 MM (TP)", base: "75.95 (TP)", spacer: "23 MM", notes: "HE - HALF EARTH, BE - BARE HALF EARTH" },
    "TPE/TPBE": { bars: "4 bars", lid: "49.55 MM (E)", base: "75.55 MM (TP)", spacer: "30 MM", notes: "E - HALF EARTH" },
    "TPHE/TPBHE": { bars: "5 bars", lid: "52.55 (HE)", base: "75.95 MM (TP)", spacer: "27 MM", notes: "HE - HALF EARTH" },
    "TPN": { bars: "4 bars", lid: "56.55 (TP)", base: "82.95 MM (N)", spacer: "30 MM", notes: "N - NEUTRAL" },
    "TPNE": { bars: "5 bars", lid: "49.55 MM (E)", base: "82.95 MM (N)", spacer: "36 MM", notes: "SAME THING AS TPNE BE" },
    "TPNHE/TPNBHE": { bars: "5 bars", lid: "52.55 MM (HE)", base: "82.95 MM (N)", spacer: "34 MM", notes: "HE - HALF EARTH, N - NEUTRAL" }
};

// Функция отображения выбранной конфигурации
function showTpConfiguration() {
    const selectEl = document.getElementById('tpConfigSelect');
    const display = document.getElementById('tpResultBox');
    if (!selectEl || !display) return;

    const selectedType = selectEl.value;

    if (!selectedType) {
        display.innerHTML = "Result: Waiting for selection...";
        return;
    }

    const data = tpData[selectedType];
    display.innerHTML = `
        <div class="result-item"><span style="color: #495057;">Bars:</span> ${data.bars}</div>
        <div class="result-item"><span style="color: #495057;">LID:</span> <strong>${data.lid}</strong></div>
        <div class="result-item"><span style="color: #495057;">BASE:</span> <strong>${data.base}</strong></div>
        <div class="result-item"><span style="color: #495057;">SPACER SIZE:</span> <span style="color: #007bff;">${data.spacer}</span></div>
        <div class="result-item" style="font-size: 0.85em; font-weight: normal; color: #6c757d; margin-top: 10px;">Note: ${data.notes}</div>
    `;
}
