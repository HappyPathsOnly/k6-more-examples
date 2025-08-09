// This module exports a function to calculate the monthly installment for a loan
// using the standard amortization formula based on the loan amount, tenure, and annual interest rate.

/**
 * Calculates the monthly installment for a loan.
 * @param {number} loanAmount - The total loan amount.
 * @param {number} tenureInMonths - The loan tenure in months.
 * @param {number} annualInterestRate - The annual interest rate (as a percentage, e.g., 5 for 5%).
 * @returns {number} The monthly installment amount, rounded to two decimal places.
 */
export function calculateMonthlyInstallment(loanAmount, tenureInMonths, annualInterestRate) {
    // Convert annual interest rate to a monthly rate (as a decimal)
    let monthlyInterestRate = annualInterestRate / 12 / 100;
    // Calculate the monthly payment using the amortization formula
    let monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -tenureInMonths));

    // Round the result to two decimal places and return
    return Math.round(monthlyPayment * 100) / 100;
}
