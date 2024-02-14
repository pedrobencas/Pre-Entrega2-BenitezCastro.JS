
function formatNumber(number) {
    return number.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("credit-simulator-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Previene el envío tradicional del formulario
        showLoadingIndicator();
        
        // Retraso artificial para ver el indicador de carga, quitar en producción
        setTimeout(() => {
            calculateLoan();
            hideLoadingIndicator();
        }, 500); // Ajusta este tiempo según sea necesario
    });
});

function showLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = 'none';
}

function applyDiscount(amount) {
    return amount >= 10000000 ? 2 : 0; // Aplica un descuento del 2% si el monto es mayor o igual a 10.000.000
}

function calculateMonthlyPayment(amount, interestRate, months, discount) {
    const adjustedInterestRate = interestRate - discount;
    const monthlyInterest = (adjustedInterestRate / 100) / 12;
    return (amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
}

function generateAmortizationTable(amount, monthlyPayment, monthlyInterest, months) {
    let remainingBalance = amount;
    let tableHTML = `<h2>Tabla de amortización:</h2><table class='amortization-table'><tr><th>Mes</th><th>Saldo</th><th>Pago principal</th><th>Pago de interés</th><th>Pago total</th></tr>`;

    for (let i = 1; i <= months; i++) {
        let interestPayment = remainingBalance * monthlyInterest;
        let principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        if (i === months) {
            principalPayment += remainingBalance;
            remainingBalance = 0;
        }

        tableHTML += `<tr><td>${i}</td><td>$${formatNumber(remainingBalance)}</td><td>$${formatNumber(principalPayment)}</td><td>$${formatNumber(interestPayment)}</td><td>$${formatNumber(monthlyPayment)}</td></tr>`;
    }

    return tableHTML + "</table>";
}

function calculateLoan() {
    const amount = parseInt(document.getElementById("amount").value);
    const interestRate = parseFloat(document.getElementById("interest-rate").value);
    const months = parseInt(document.getElementById("months").value);
    const discount = applyDiscount(amount);
    const monthlyInterest = (interestRate - discount) / 100 / 12;
    const monthlyPayment = calculateMonthlyPayment(amount, interestRate, months, discount);
    const totalPayment = monthlyPayment * months;

    // Construir y mostrar los resultados
    let resultsHTML = `<h2>Plazo: ${months} meses</h2>
        <p>Monto del crédito: $${formatNumber(amount)}</p>
        <p>Tasa de interés: ${interestRate.toFixed(2)}% anual</p>
        <p>Tasa de interés ajustada: ${(interestRate - discount).toFixed(2)}% anual</p>
        <p>Pago mensual estimado: $${formatNumber(monthlyPayment)}</p>
        <p>Valor Total Crédito: $${formatNumber(totalPayment)}</p>`;

    if (discount > 0) {
        resultsHTML += `<div class='discount-message'>Se aplicó un descuento del 2% en la tasa de interés por ser un crédito superior a 10 millones de $CLP</div>`;
    }

    resultsHTML += generateAmortizationTable(amount, monthlyPayment, monthlyInterest, months);

    // Actualizar el DOM con los resultados
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = resultsHTML;
}

