const fs = require('fs');
const path = require('path');

// 1. Corregir css/style.css
const cssPath = path.join(__dirname, '../css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Reemplazar la definición de .age-gate y .age-gate.active
const oldAgeGateRegex = /\.age-gate\s*\{[\s\S]*?pointer-events:\s*none;[\s\S]*?\}\s*\.age-gate\.active\s*\{[\s\S]*?pointer-events:\s*all;[\s\S]*?\}/;

const newAgeGateCSS = `.age-gate {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
    padding: 1.2rem;
    box-sizing: border-box;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.age-gate.active {
    opacity: 1;
    pointer-events: auto !important;
}

.age-gate-content {
    position: relative;
    z-index: 1000000;
    pointer-events: auto !important;
    padding: 2.2rem 1.8rem;
    text-align: center;
    max-width: 480px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 8px;
    box-sizing: border-box;
}

#btn-adult {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    min-height: 48px;
    padding: 0.85rem 1.8rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    z-index: 1000002;
    pointer-events: auto !important;
}`;

if (oldAgeGateRegex.test(css)) {
    css = css.replace(oldAgeGateRegex, newAgeGateCSS);
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✔ css/style.css actualizado con éxito');
} else {
    // Si no hizo match con el regex, agregamos al final para asegurar override
    css += '\n\n/* OVERRIDE MOBILE AGE GATE */\n' + newAgeGateCSS + '\n';
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✔ css/style.css sobrescrito al final con éxito');
}

// 2. Corregir index.html para añadir onclick inline y touch action en #btn-adult
const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace(
    '<button id="btn-adult" class="btn btn-primary">Soy mayor de 18 años</button>',
    '<button id="btn-adult" type="button" class="btn btn-primary" onclick="window.dismissAgeGate(event)" style="touch-action: manipulation; cursor: pointer;">Soy mayor de 18 años</button>'
);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✔ index.html actualizado con handler inline y touch-action');

// 3. Corregir js/app.js para definir window.dismissAgeGate y eventos táctiles
const appJsPath = path.join(__dirname, '../js/app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Agregar función global window.dismissAgeGate al principio del archivo
if (!appJs.includes('window.dismissAgeGate =')) {
    const globalDismissCode = `
// Función global de descarte de Age Gate a prueba de fallos táctiles en móvil
window.dismissAgeGate = function(e) {
    if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    try {
        localStorage.setItem('redVelvetAgeVerified', 'true');
    } catch(err) {}

    const gate = document.getElementById('age-gate');
    if (gate) {
        gate.classList.remove('active');
        gate.style.setProperty('display', 'none', 'important');
        gate.style.setProperty('pointer-events', 'none', 'important');
        gate.style.setProperty('opacity', '0', 'important');
    }
    document.body.style.overflow = 'auto';
    if (typeof playMusic === 'function') {
        try { playMusic(); } catch(m) {}
    }
};
`;
    appJs = globalDismissCode + '\n' + appJs;
}

// Mejorar el listener en DOMContentLoaded
const oldListenerRegex = /if\s*\(btnAdult\)\s*\{[\s\S]*?btnAdult\.addEventListener\('click'[\s\S]*?\}\);?\s*\}/;
const newListenerCode = `if (btnAdult) {
        ['click', 'touchend', 'pointerup'].forEach(evt => {
            btnAdult.addEventListener(evt, (e) => {
                if (evt === 'touchend') e.preventDefault();
                window.dismissAgeGate(e);
            }, { passive: false });
        });
    }`;

if (oldListenerRegex.test(appJs)) {
    appJs = appJs.replace(oldListenerRegex, newListenerCode);
}
fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✔ js/app.js actualizado con eventos click, touchend y pointerup');

