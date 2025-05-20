// Definiciones y constantes
const impactLevels = ["Muy bajo", "Bajo", "Medio", "Alto", "Crítico"];
const probabilityLevels = ["Improbable", "Probable", "Ocasional", "Posible", "Altamente probable"];

const impactDescriptions = {
    "Muy bajo": "Aunque llegaran a ocurrir, no causarían ningún perjuicio real al proyecto.",
    "Bajo": "Su impacto sería leve y fácilmente manejable, sin afectar el desarrollo general.",
    "Medio": "Podrían generar retrasos o complicaciones considerables si llegan a suceder.",
    "Alto": "Su ocurrencia podría poner en grave riesgo el cumplimiento de los objetivos.",
    "Crítico": "De ocurrir, podrían ocasionar la cancelación o el fracaso total del proyecto."
};

const probabilityDescriptions = {
    "Improbable": "Son posibles en la teoría, poco probables en la realidad.",
    "Probable": "Sería poco común que se presenten en la práctica.",
    "Ocasional": "Tienen igual probabilidad de ocurrir que de no ocurrir.",
    "Posible": "Es bastante factible que ocurran en algún punto del proyecto.",
    "Altamente probable": "Es casi seguro que pase si no se toman medidas preventivas."
};

// Matriz de severidad 5x5
const severityMatrix = [
    ["Muy bajo", "Muy bajo", "Bajo", "Bajo", "Medio"],
    ["Muy bajo", "Bajo", "Bajo", "Medio", "Alto"],
    ["Bajo", "Bajo", "Medio", "Alto", "Alto"],
    ["Bajo", "Medio", "Alto", "Alto", "Crítico"],
    ["Medio", "Alto", "Alto", "Crítico", "Crítico"]
];

// Estado de la aplicación
let projectInfo = {
    studentName: "",
    projectName: "",
    description: "",
    comments: ""
};

let risks = [];

// Funciones de utilidad
function getRiskSeverity(impact, probability) {
    const impactIndex = impactLevels.indexOf(impact);
    const probabilityIndex = probabilityLevels.indexOf(probability);
    return severityMatrix[probabilityIndex][impactIndex];
}

function getSeverityClass(severity) {
    switch (severity) {
        case "Muy bajo": return "very-low";
        case "Bajo": return "low";
        case "Medio": return "medium";
        case "Alto": return "high";
        case "Crítico": return "critical";
        default: return "";
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar selectores
    const impactSelect = document.getElementById('impact');
    const probabilitySelect = document.getElementById('probability');
    
    // Actualizar descripciones al cambiar selección
    impactSelect.addEventListener('change', function() {
        document.getElementById('impact-description').textContent = impactDescriptions[this.value];
    });
    
    probabilitySelect.addEventListener('change', function() {
        document.getElementById('probability-description').textContent = probabilityDescriptions[this.value];
    });
    
    // Formulario de riesgos
    document.getElementById('risk-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addRisk();
    });
    
    // Inicializar matrices
    initializeMatrix('risk-matrix');
    initializeMatrix('summary-matrix');
    initializeMatrix('print-matrix');
    
    // Inicializar tooltips para la matriz
    initializeMatrixTooltips();
});

// Navegación por pestañas
function switchTab(tabId) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    document.getElementById(tabId).classList.add('active');
    
    // Activar el botón correspondiente
    document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    
    // Actualizar contenido según la pestaña
    if (tabId === 'info') {
        loadProjectInfo();
    } else if (tabId === 'matrix' || tabId === 'summary') {
        updateMatrix('risk-matrix');
        updateMatrix('summary-matrix');
        
        if (tabId === 'summary') {
            updateSummary();
        }
    }
}

// Cargar información del proyecto
function loadProjectInfo() {
    document.getElementById('studentName').value = projectInfo.studentName;
    document.getElementById('projectName').value = projectInfo.projectName;
    document.getElementById('description').value = projectInfo.description;
    document.getElementById('comments').value = projectInfo.comments;
}

// Guardar información del proyecto
function saveProjectInfo() {
    projectInfo.studentName = document.getElementById('studentName').value;
    projectInfo.projectName = document.getElementById('projectName').value;
    projectInfo.description = document.getElementById('description').value;
    projectInfo.comments = document.getElementById('comments').value;
}

// Añadir un nuevo riesgo
function addRisk() {
    const name = document.getElementById('riskName').value.trim();
    if (!name) return;
    
    const risk = {
        id: Date.now().toString(),
        name: name,
        description: document.getElementById('riskDescription').value.trim(),
        impact: document.getElementById('impact').value,
        probability: document.getElementById('probability').value,
        mitigation: document.getElementById('mitigation').value.trim()
    };
    
    risks.push(risk);
    
    // Limpiar formulario
    document.getElementById('riskName').value = '';
    document.getElementById('riskDescription').value = '';
    document.getElementById('impact').value = 'Medio';
    document.getElementById('probability').value = 'Ocasional';
    document.getElementById('mitigation').value = '';
    
    // Actualizar lista de riesgos
    updateRisksList();
}

// Eliminar un riesgo
function removeRisk(id) {
    risks = risks.filter(risk => risk.id !== id);
    updateRisksList();
    updateMatrix('risk-matrix');
    updateMatrix('summary-matrix');
}

// Actualizar la lista de riesgos
function updateRisksList() {
    const risksListElement = document.getElementById('risks-list');
    const summaryRisksListElement = document.getElementById('summary-risks-list');
    
    // Función para generar el HTML de la lista de riesgos
    const generateRisksListHTML = (container, includeDeleteButton = true) => {
        if (risks.length === 0) {
            container.innerHTML = '<div class="empty-message">No hay riesgos identificados. Agrega tu primer riesgo usando el formulario.</div>';
            return;
        }
        
        container.innerHTML = '';
        
        risks.forEach(risk => {
            const severity = getRiskSeverity(risk.impact, risk.probability);
            const severityClass = getSeverityClass(severity);
            
            const riskElement = document.createElement('div');
            riskElement.className = 'risk-item';
            
            let html = `
                <div class="risk-header">
                    <div class="risk-title">${risk.name}</div>
                    ${includeDeleteButton ? `<button class="delete-button" onclick="removeRisk('${risk.id}')">✕</button>` : ''}
                </div>
            `;
            
            if (risk.description) {
                html += `<div class="risk-description">${risk.description}</div>`;
            }
            
            html += `
                <div class="risk-badges">
                    <span class="badge badge-impact">Impacto: ${risk.impact}</span>
                    <span class="badge badge-probability">Probabilidad: ${risk.probability}</span>
                    <span class="badge badge-severity-${severityClass}">Severidad: ${severity}</span>
                </div>
            `;
            
            if (risk.mitigation) {
                html += `
                    <div class="risk-mitigation">
                        <div class="risk-mitigation-title">Estrategia de mitigación:</div>
                        <div>${risk.mitigation}</div>
                    </div>
                `;
            }
            
            riskElement.innerHTML = html;
            container.appendChild(riskElement);
        });
    };
    
    generateRisksListHTML(risksListElement, true);
    generateRisksListHTML(summaryRisksListElement, false);
    
    // También actualizar la lista para imprimir
    const printRisksListElement = document.getElementById('print-risks-list');
    generateRisksListHTML(printRisksListElement, false);
}

// Inicializar la matriz de riesgos
function initializeMatrix(containerId) {
    const container = document.getElementById(containerId);
    
    // Crear fila de encabezados
    let html = '<div class="matrix-row">';
    html += '<div class="matrix-header">Probabilidad / Impacto</div>';
    
    impactLevels.forEach(impact => {
        html += `<div class="matrix-header">${impact}</div>`;
    });
    
    html += '</div>';
    
    // Crear filas de la matriz
    probabilityLevels.slice().reverse().forEach(probability => {
        html += '<div class="matrix-row">';
        html += `<div class="matrix-label">${probability}</div>`;
        
        impactLevels.forEach(impact => {
            const severity = getRiskSeverity(impact, probability);
            const severityClass = getSeverityClass(severity);
            const cellId = `${containerId}-${probability}-${impact}`;
            
            html += `<div id="${cellId}" class="matrix-cell ${severityClass}" data-probability="${probability}" data-impact="${impact}"></div>`;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// Actualizar la matriz con los riesgos
function updateMatrix(containerId) {
    // Primero, limpiar todas las celdas
    document.querySelectorAll(`#${containerId} .matrix-cell`).forEach(cell => {
        cell.textContent = '';
    });
    
    // Contar riesgos por celda
    const riskCounts = {};
    
    risks.forEach(risk => {
        const key = `${containerId}-${risk.probability}-${risk.impact}`;
        if (!riskCounts[key]) {
            riskCounts[key] = 0;
        }
        riskCounts[key]++;
    });
    
    // Actualizar celdas con conteo
    for (const [key, count] of Object.entries(riskCounts)) {
        const cell = document.getElementById(key);
        if (cell) {
            cell.textContent = count;
        }
    }
}

// Inicializar tooltips para la matriz
function initializeMatrixTooltips() {
    const tooltip = document.getElementById('matrix-tooltip');
    
    document.addEventListener('mousemove', function(e) {
        if (tooltip.style.display === 'block') {
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        }
    });
    
    // Añadir eventos a las celdas de la matriz
    document.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            const impact = this.getAttribute('data-impact');
            const probability = this.getAttribute('data-probability');
            const severity = getRiskSeverity(impact, probability);
            
            // Encontrar riesgos en esta celda
            const cellRisks = risks.filter(risk => 
                risk.impact === impact && risk.probability === probability
            );
            
            // Actualizar contenido del tooltip
            document.getElementById('tooltip-severity').textContent = `Severidad: ${severity}`;
            document.getElementById('tooltip-details').textContent = `Impacto: ${impact}, Probabilidad: ${probability}`;
            
            const tooltipRisks = document.getElementById('tooltip-risks');
            if (cellRisks.length > 0) {
                let risksHtml = '<p>Riesgos en esta categoría:</p><ul>';
                cellRisks.forEach(risk => {
                    risksHtml += `<li>${risk.name}</li>`;
                });
                risksHtml += '</ul>';
                tooltipRisks.innerHTML = risksHtml;
            } else {
                tooltipRisks.innerHTML = '<p>No hay riesgos en esta categoría</p>';
            }
            
            // Mostrar tooltip
            tooltip.style.display = 'block';
        });
        
        cell.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
}

// Actualizar resumen
function updateSummary() {
    saveProjectInfo();
    
    // Actualizar información del proyecto
    document.getElementById('summary-student-name').textContent = projectInfo.studentName || 'No especificado';
    document.getElementById('summary-project-name').textContent = projectInfo.projectName || 'No especificado';
    document.getElementById('summary-description').textContent = projectInfo.description || 'No especificada';
    document.getElementById('summary-comments').textContent = projectInfo.comments || 'No hay comentarios';
    
    // Actualizar matriz y lista de riesgos
    updateMatrix('summary-matrix');
    updateRisksList();
}

// Exportar a JSON
function exportJSON() {
    saveProjectInfo();
    
    const data = {
        projectInfo,
        risks,
        date: new Date().toLocaleDateString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa-riesgos-${projectInfo.projectName.replace(/\s+/g, '-') || 'proyecto'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Imprimir reporte
function printReport() {
    saveProjectInfo();
    
    // Actualizar plantilla de impresión
    document.getElementById('print-student-name').textContent = projectInfo.studentName || 'No especificado';
    document.getElementById('print-project-name').textContent = projectInfo.projectName || 'No especificado';
    document.getElementById('print-description').textContent = projectInfo.description || 'No especificada';
    document.getElementById('print-comments').textContent = projectInfo.comments || 'No hay comentarios';
    document.getElementById('print-date').textContent = new Date().toLocaleDateString();
    
    // Actualizar matriz y lista de riesgos
    updateMatrix('print-matrix');
    updateRisksList();
    
    // Imprimir
    window.print();
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la primera pestaña
    switchTab('info');
    
    // Guardar información del proyecto al cambiar de pestaña
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            saveProjectInfo();
            switchTab(this.getAttribute('data-tab'));
        });
    });
});