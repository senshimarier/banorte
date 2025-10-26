// Validaciones de formularios
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input, select');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        } else {
            input.style.borderColor = '#ccc';
        }
    });
    return valid;
}

// Mostrar resultados en la UI
function showResult(result, resultDivId) {
    const resultDiv = document.getElementById(resultDivId);
    if (result) {
        resultDiv.style.display = 'block';
        // Asumiendo que result tiene keys como 'projection', 'consulta', etc.
        for (const key in result) {
            const p = document.getElementById(key);
            if (p) p.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${result[key]}`;
        }
    } else {
        resultDiv.style.display = 'none';
    }
}

// Helper para loading
function setLoading(button, loading) {
    button.disabled = loading;
    button.textContent = loading ? 'Cargando...' : 'Enviar';
}