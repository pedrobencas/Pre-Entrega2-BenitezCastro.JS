function formatNumber(number){
    return number.toLocaleString(2);
}
function calculateLoan(){
    //Obtener los valores del formulario
    let amount = parseInt(document.getElementById("amount").value);
    let interestRate = parseFloat(document.getElementById("interest-rate").value);
    let months =parseInt(document.getElementById("months").value);

    //Validar si esque el monto del crédito es mayor a $10.000.000 CLP para aplicar un descuento del 2% en la tasa de interés.
    let discount = 0;
    if (amount >= 10000000){
        discount = 2;
    }  
    let adjustedInteresRate = interestRate - discount
    
    //Realizar cálculos
    let monthlyInterest = (adjustedInteresRate/100)/12;
    let monthlyPayment = (amount*monthlyInterest)/(1-Math.pow(1+monthlyInterest, -months));
    let anualPayment = (monthlyPayment*months);

    //Mostrar la simulación
    let resultElement = document.getElementById("result");
    resultElement.innerHTML = "<h2>Plazo: "+months+" meses</h2>"+ 
        "<p>Monto del crédito: $ " + formatNumber(parseInt(amount)) + "</p>" + 
        "<p>Tasa de interés: "+ interestRate.toFixed(2) +"% anual</p>" +
        "<p>Plazo: "+ months +" meses</p>"+
        "<p>Pago mensual estimado: $ "+ formatNumber(parseInt(monthlyPayment)) +"</p>" +
        "<p>Valor Total Credito: $ "+ formatNumber(parseInt(anualPayment)) +"</p>";

    //Informar al cliente el descuento que se le aplicó
    if (discount > 0){
        resultElement.innerHTML += "<div class='discount-message'>Se aplicó un descuento del 2% en la tasa de interés por ser un crédito superior a 10 millones de $CLP</div>"+
        "<p>Tasa de interés ajustada: "+ adjustedInteresRate.toFixed(2) +"% anual</p>";
    }
    //Crear tabla de amortización
    let amortizationTable = "<h2>Tabla de amortización:</h2>" + "<table class='amortization-table'>" + 
    "<tr><th>Mes</th><th>Saldo</th><th>Pago principal</th><th>Pago de interés</th><th>Pago total</th></tr>";
    let remainingBalance = amount;
    for (let i=1; i<= months; i++) {
        let interestPayment = remainingBalance * monthlyInterest;
        let principalPayment = monthlyPayment - interestPayment;
        //Ajustar el pago principal y el saldo final en la última cuota
        if (i===months){
            principalPayment = remainingBalance;
            remainingBalance = 0;
        }else {
            remainingBalance -= principalPayment;
        }
           
        amortizationTable += "<tr><td>"+i+"</td>"+
        "<td>$"+formatNumber(parseInt(remainingBalance))+"</td>"+
        "<td>$"+formatNumber(parseInt(principalPayment))+"</td>"+
        "<td>$"+formatNumber(parseInt(interestPayment))+"</td>"+
        "<td>$"+formatNumber(parseInt(monthlyPayment))+"</td></tr>";
    }
    amortizationTable += "</table>"
    resultElement.innerHTML += amortizationTable;
}