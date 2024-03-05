let isDarkMode = false;

function toggleDarkMode() {
    const modeToggleButton = document.getElementById("mode-toggle-button");
    if (modeToggleButton.textContent === "Modo Nocturno") {
        isDarkMode = true;
        document.body.classList.add("dark-mode");
        modeToggleButton.textContent = "Modo Diurno";
        localStorage.setItem('mode', 'dark');
    } else {
        isDarkMode = false;
        document.body.classList.remove("dark-mode");
        modeToggleButton.textContent = "Modo Nocturno";
        localStorage.setItem('mode', 'light');
    }
    const formData = {
        amount: document.getElementById("amount").value,
        interestRate: document.getElementById("interest-rate").value,
        months: document.getElementById("months").value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

document.addEventListener("DOMContentLoaded", function() {
    const mode = localStorage.getItem('mode');
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById("mode-toggle-button").textContent = "Modo Diurno";
    }
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        document.getElementById("amount").value = formData.amount;
        document.getElementById("interest-rate").value = formData.interestRate;
        document.getElementById("months").value = formData.months;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const modeToggleButton = document.getElementById("mode-toggle-button");
    modeToggleButton.addEventListener("click", toggleDarkMode);
});

const discounts = {
    "5000000": 0.2,
    "10000000": 0.4
};

function formatNumber(number) {
    return number.toLocaleString('es-ES', { style: 'currency', currency: 'CLP' });
}

function toggleAmortization(id) {
    const amortizationElement = document.getElementById(id);
    const isDisplayed = amortizationElement.style.display === 'block';
    amortizationElement.style.display = isDisplayed ? 'none' : 'block';
}

function selectCard(selectedId) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    const selectedCard = document.getElementById(selectedId);
    selectedCard.classList.add('selected');
    const amortizationId = selectedCard.querySelector('.amortization-schedule').id;
    toggleAmortization(amortizationId);
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("credit-simulator-form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        showLoadingIndicator();
        setTimeout(() => {
            calculateLoan();
            hideLoadingIndicator();
            document.getElementById("result").style.display = 'block';
        }, 500);
    });
});

function showLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = 'block';
}

function hideLoadingIndicator() {
    document.getElementById("loadingIndicator").style.display = 'none';
}

function applyDiscount(amount) {
    const sortedDiscounts = Object.keys(discounts).sort((a, b) => parseInt(b) - parseInt(a));
    for (let i = 0; i < sortedDiscounts.length; i++) {
        const minAmount = parseInt(sortedDiscounts[i]);
        if (amount >= minAmount) {
            return discounts[minAmount];
        }
    }
    return 0;
}

function calculateMonthlyPayment(amount, interestRate, months, discount) {
    const adjustedInterestRate = interestRate - discount;
    const monthlyInterest = (adjustedInterestRate / 100) / 12;
    return (amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
}

function calculateCAE(amount, totalPayment, months, discount) {
    const adjustedTotalPayment = totalPayment - (discount * amount / 100);
    const effectiveAnnualRate = Math.pow((adjustedTotalPayment / amount), (12 / months)) - 1;
    return (effectiveAnnualRate * 100).toFixed(2);
}

function calculateTotalPayment(amount, monthlyPayment, months) {
    return monthlyPayment * months;
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
        tableHTML += `<tr><td>${i}</td><td>${formatNumber(remainingBalance)}</td><td>${formatNumber(principalPayment)}</td><td>${formatNumber(interestPayment)}</td><td>${formatNumber(monthlyPayment)}</td></tr>`;
    }
    tableHTML += "</table>";
    return tableHTML;
}

function calculateLoan() {
    const amount = parseInt(document.getElementById("amount").value);
    const interestRate = parseFloat(document.getElementById("interest-rate").value);
    const months = parseInt(document.getElementById("months").value);
    const discount = applyDiscount(amount);
    const monthlyInterest = (interestRate - discount) / 100 / 12;

    const twelveMonthsPayment = calculateMonthlyPayment(amount, interestRate, 12, discount);
    const userMonthsPayment = calculateMonthlyPayment(amount, interestRate, months, discount);
    const sixtyMonthsPayment = calculateMonthlyPayment(amount, interestRate, 60, discount);

    const twelveMonthsTotalPayment = calculateTotalPayment(amount, twelveMonthsPayment, 12);
    const userMonthsTotalPayment = calculateTotalPayment(amount, userMonthsPayment, months);
    const sixtyMonthsTotalPayment = calculateTotalPayment(amount, sixtyMonthsPayment, 60);

    document.getElementById("twelve-months-payment").textContent = formatNumber(twelveMonthsPayment);
    document.getElementById("user-months-payment").textContent = formatNumber(userMonthsPayment);
    document.getElementById("sixty-months-payment").textContent = formatNumber(sixtyMonthsPayment);

    const twelveMonthsAmortizationTable = generateAmortizationTable(amount, twelveMonthsPayment, monthlyInterest, 12);
    const userMonthsAmortizationTable = generateAmortizationTable(amount, userMonthsPayment, monthlyInterest, months);
    const sixtyMonthsAmortizationTable = generateAmortizationTable(amount, sixtyMonthsPayment, monthlyInterest, 60);

    document.getElementById("twelve-months-amortization").innerHTML = twelveMonthsAmortizationTable;
    document.getElementById("user-months-amortization").innerHTML = userMonthsAmortizationTable;
    document.getElementById("sixty-months-amortization").innerHTML = sixtyMonthsAmortizationTable;

    document.getElementById("twelve-months-credit-amount").textContent = formatNumber(amount);
    document.getElementById("user-months-credit-amount").textContent = formatNumber(amount);
    document.getElementById("sixty-months-credit-amount").textContent = formatNumber(amount);

    document.getElementById("twelve-months-interest-rate").textContent = interestRate.toFixed(2);
    document.getElementById("user-months-interest-rate").textContent = interestRate.toFixed(2);
    document.getElementById("sixty-months-interest-rate").textContent = interestRate.toFixed(2);

    document.getElementById("twelve-months-adjusted-interest-rate").textContent = (interestRate - discount).toFixed(2);
    document.getElementById("user-months-adjusted-interest-rate").textContent = (interestRate - discount).toFixed(2);
    document.getElementById("sixty-months-adjusted-interest-rate").textContent = (interestRate - discount).toFixed(2);

    document.getElementById("twelve-months-total-credit-value").textContent = formatNumber(twelveMonthsTotalPayment);
    document.getElementById("user-months-total-credit-value").textContent = formatNumber(userMonthsTotalPayment);
    document.getElementById("sixty-months-total-credit-value").textContent = formatNumber(sixtyMonthsTotalPayment);

    document.getElementById("twelve-months-cae").textContent = calculateCAE(amount, twelveMonthsTotalPayment, 12, discount);
    document.getElementById("user-months-cae").textContent = calculateCAE(amount, userMonthsTotalPayment, months, discount);
    document.getElementById("sixty-months-cae").textContent = calculateCAE(amount, sixtyMonthsTotalPayment, 60, discount);
}
