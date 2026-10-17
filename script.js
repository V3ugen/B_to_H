const tableData = [
    ["DL144-200", "237.8", "822", "1406.2", "1990.4", "2574.6", "3158.8"],
    ["DL144 80-TPNBE", "237.8", "822", "1406.2", "1990.4", "2574.6", "3158.8"],
    ["DL135-T125-TPN outside", "441", "892.2", "1355.4", "1812.6", "2269.8", "2727"],
    ["DL132 115-TPN", "453.7", "999.8", "1545.9", "2092.2", "2638.1", ""],
    ["DL132 145-TPN", "453.7", "999.8", "1545.9", "2092.2", "2638.1", ""],
    ["DL120 115-TPBE", "631.5", "1393.5", "2155.5", "", "", ""],
    ["DL120 100-TP", "377.5", "1291.9", "2206.3", "", "", ""],
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
    ["DL48 125-TPN", "478.5", "", "", "", "", ""],
    ["DL40-T125-TPN outside", "377", "", "", "", "", ""],
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
    if(buttonElement) {
        buttonElement.classList.add('active');
        buttonElement.scrollIntoView({ inline: 'center', block: 'nearest' });
    }
    try { localStorage.setItem('lastPage', pageId); } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    let last = null;
    try { last = localStorage.getItem('lastPage'); } catch(e) {}
    const btn = last && document.querySelector(`.tab-button[onclick*="'${last}'"]`);
    if (btn) switchPage(last, btn);
});

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
        display.textContent = parseFloat(res) <= 0 ? "Housing too small" : "Housing millimeters: " + res;
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

// Сброс на вкладках HPB Housing и IMPB: поля, результаты и список последних размеров
function clearHistory(key, renderFunc) {
    try { localStorage.removeItem(key); } catch(e) {}
    renderFunc();
}
function resetHpb() {
    clearInputField('directInput', calculateDirect);
    clearInputField('reverseInput', calculateReverse);
    clearInputField('boltLengthInput', calculateSupportHoles);
    clearHistory(KEY_DIRECT, renderDirectHistory);
    clearHistory(KEY_REVERSE, renderReverseHistory);
}
function resetImpb() {
    clearInputField('complexInput1', calculateComplex);
    clearInputField('complexInput2', calculateComplex);
    clearHistory(KEY_COMPLEX, renderComplexHistory);
}

// Версия приложения = версия кэша service worker (impb-calc-vNN из sw.js)
function showAppVersion() {
    const el = document.getElementById('appVersion');
    if (!el) return;
    if (!('caches' in window)) { el.textContent = 'Version: unknown'; return; }
    caches.keys().then(keys => {
        const nums = keys.map(k => (k.match(/^impb-calc-v(\d+)$/) || [])[1]).filter(Boolean).map(Number);
        el.textContent = nums.length ? 'Version: v' + Math.max(...nums) : 'Version: not cached yet';
    }).catch(() => { el.textContent = 'Version: unknown'; });
}
document.addEventListener('DOMContentLoaded', showAppVersion);
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => setTimeout(showAppVersion, 500));
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
    "TPNE/TPNBE": { bars: "5 bars", lid: "49.55 MM (E)", base: "82.95 MM (N)", spacer: "36 MM", notes: "TPNBE - SAME THING AS TPNE" },
    "TPNHE/TPNBHE": { bars: "5 bars", lid: "52.55 MM (HE)", base: "82.95 MM (N)", spacer: "34 MM", notes: "HE - HALF EARTH, N - NEUTRAL" }
};


// ---------- Векторные чертежи LID и BASE (inline SVG, работают офлайн) ----------
// Размер подписывается внутри чертежа: "49.55 MM (E)" -> "49.55 MM" + "(E)"
function tpSizeText(value, cx, y1, y2, fs) {
    const m = String(value || '').match(/^\s*([\d.]+)\s*(?:MM)?\s*\((.+)\)\s*$/i);
    const l1 = m ? m[1] + ' MM' : String(value || '');
    const l2 = m ? '(' + m[2] + ')' : '';
    const st = 'font-family="Arial, sans-serif" font-weight="700" text-anchor="middle" fill="currentColor"';
    return `<text x="${cx}" y="${y1}" font-size="${fs}" ${st}>${l1}</text>` +
           (l2 ? `<text x="${cx}" y="${y2}" font-size="${fs}" ${st}>${l2}</text>` : '');
}
const TP_PATH = {
    lid: 'M 52,58 L 397,52 L 399,78 L 362,88 L 362,386 L 389,391 L 389,414 L 1111,414 L 1111,391 L 1138,386 L 1138,88 L 1101,78 L 1103,52 L 1448,58 L 1448,82 L 1426,82 L 1426,70 L 1242,70 Q 1221,70 1221,98 L 1221,190 Q 1221,202 1212,208 Q 1203,202 1203,190 L 1203,92 L 1156,92 L 1156,396 L 1184,396 L 1184,438 L 316,438 L 316,396 L 344,396 L 344,92 L 297,92 L 297,190 Q 297,202 288,208 Q 279,202 279,190 L 279,98 Q 279,70 258,70 L 74,70 L 74,82 L 52,82 Z',
    base: 'M300 100 L285 112 L300 125 V860 Q300 880 280 880 H90 V900 H390 V885 H345 Q325 885 325 865 V590 Q325 575 345 575 H1155 Q1175 575 1175 590 V865 Q1175 885 1155 885 H1110 V900 H1410 V880 H1220 Q1200 880 1200 860 V125 L1215 112 L1200 100 L1180 112 V555 H320 V112 Z'
};
function tpDrawing(kind, value) {
    if (kind === 'lid') {
        return '<div class="tp-drawing tp-drawing-lid"><svg viewBox="0 -185 1500 860" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="LID">' +
            '<path d="' + TP_PATH.lid + '" fill="#fff" fill-rule="evenodd" stroke="currentColor" stroke-width="1.3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' +
            tpSizeText(value, 750, 195, 325, 120) + '</svg></div>';
    }
    return '<div class="tp-drawing"><svg viewBox="0 70 1500 860" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BASE">' +
        '<path d="' + TP_PATH.base + '" fill="#fff" stroke="currentColor" stroke-width="1.3" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>' +
        tpSizeText(value, 750, 290, 430, 120) + '</svg></div>';
}

// Функция отображения выбранной конфигурации
function showTpConfiguration() {
    const selectEl = document.getElementById('tpConfigSelect');
    const display = document.getElementById('tpResultBox');
    if (!selectEl || !display) return;

    const selectedType = selectEl.value;
    const chip = document.getElementById('lblTpChip');
    if (chip && selectedType) chip.textContent = selectedType.split('/')[0];

    if (!selectedType) {
        display.innerHTML = "Result: Waiting for selection...";
        return;
    }

    const data = tpData[selectedType];
    display.innerHTML = `
        <div class="result-item"><span style="color: #495057;">Bars:</span> ${data.bars}</div>
        <div class="result-item"><span style="color: #495057;">LID:</span> <strong>${data.lid}</strong>${tpDrawing('lid', data.lid)}</div>
        <div class="result-item"><span style="color: #495057;">BASE:</span> <strong>${data.base}</strong>${tpDrawing('base', data.base)}</div>
        <div class="result-item"><span class="spacer-size"><span>SPACER SIZE:</span> <strong>${data.spacer}</strong></span></div>
        <div class="result-item" style="font-size: 0.85em; font-weight: normal; color: #6c757d; margin-top: 10px;">Note: ${data.notes}</div>
    `;
}


// HPB Label: показать пояснение к выбранной части этикетки.
// Если передан tpKey, спецификация подтягивается из tpData (вкладка TP Config).
function showLabelInfo(el, title, message, tpKey) {
    document.querySelectorAll('#labelPage .lbl-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    document.getElementById('lblInfoTitle').textContent = title;
    document.getElementById('lblInfoText').textContent = message;

    const extra = document.getElementById('lblInfoExtra');
    extra.innerHTML = '';
    const d = tpKey && typeof tpData !== 'undefined' ? tpData[tpKey] : null;
    if (d) {
        extra.innerHTML = `
            <div class="lbl-extra-title">TP Config: ${tpKey}</div>
            <div class="result-item"><span style="color: #495057;">Bars:</span> <strong>${d.bars}</strong></div>
            <div class="result-item"><span style="color: #495057;">LID:</span> <strong>${d.lid}</strong>${tpDrawing('lid', d.lid)}</div>
            <div class="result-item"><span style="color: #495057;">BASE:</span> <strong>${d.base}</strong>${tpDrawing('base', d.base)}</div>
            <div class="result-item"><span class="spacer-size"><span>SPACER SIZE:</span> <strong>${d.spacer}</strong></span></div>
            <div class="result-item" style="font-size: 0.85em; color: #6c757d;">Note: ${d.notes}</div>
        `;
    }
    document.getElementById('lblInfo').style.display = 'block';
}


// Label: перейти к блоку TP Config ниже на странице
function showTpPanel(el) {
    document.querySelectorAll('#labelPage .lbl-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const lblInfo = document.getElementById('lblInfo');
    if (lblInfo) lblInfo.style.display = 'none';
    const panel = document.getElementById('lblTpPanel');
    if (!panel) return;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panel.classList.remove('flash');
    void panel.offsetWidth;
    panel.classList.add('flash');
}

// Показать данные сразу при загрузке (по умолчанию TPN)
document.addEventListener('DOMContentLoaded', showTpConfiguration);


// ---------- Оттягивание страницы вниз: показывает надпись ----------
// Своя реализация (нативная "резинка" в iOS не даёт ничего нарисовать под страницей)
(function () {
    const hint = document.createElement('div');
    hint.className = 'pull-hint';
    hint.textContent = 'made of crap and sticks';
    document.documentElement.appendChild(hint);

    const body = document.body;
    let startX = 0, startY = 0, tracking = false, pulling = false;

    function release() {
        if (!tracking && !pulling) return;
        tracking = false;
        if (pulling) {
            body.style.transition = 'transform 0.3s ease';
            hint.style.transition = 'opacity 0.3s ease';
            body.style.transform = '';
            hint.style.opacity = '0';
            setTimeout(() => { body.style.transition = ''; hint.style.transition = ''; }, 320);
        }
        pulling = false;
    }

    window.addEventListener('touchstart', (e) => {
        pulling = false;
        tracking = e.touches.length === 1 && window.scrollY <= 0;
        if (tracking) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!tracking) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (!pulling && (dy < 8 || Math.abs(dy) < Math.abs(dx) || window.scrollY > 0)) return;
        if (dy <= 0) { release(); return; }
        pulling = true;
        if (e.cancelable) e.preventDefault();
        const max = hint.offsetHeight || 100;
        const d = Math.min(max, dy * 0.5);
        body.style.transition = 'none';
        body.style.transform = 'translateY(' + d + 'px)';
        hint.style.transition = 'none';
        hint.style.opacity = String(Math.min(1, d / (max * 0.8)));
    }, { passive: false });

    window.addEventListener('touchend', release, { passive: true });
    window.addEventListener('touchcancel', release, { passive: true });
})();
