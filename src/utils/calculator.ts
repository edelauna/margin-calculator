export function calculateCompoundInterest(principal: number, rate: number, time: number, compoundingFrequency: string): number {
  let n = 1; // Default for annual compounding
  if (compoundingFrequency === 'monthly') n = 12;
  if (compoundingFrequency === 'bi-weekly') n = 26; // 26 bi-weekly periods in a year
  const r = rate / 100; // Convert percentage to decimal
  return principal * Math.pow(1 + r / n, n * time);
}

export function calculateAmortization(principal: number, annualRate: number, periods: number, paymentFrequency: string = 'monthly'): { payment: number, interest: number, principalPaid: number, balance: number }[] {
  let ratePerPeriod: number;
  if (paymentFrequency === 'monthly') {
    ratePerPeriod = (annualRate / 100) / 12;
  } else if (paymentFrequency === 'bi-weekly') {
    ratePerPeriod = (annualRate / 100) / 26; // Bi-weekly rate
  } else { // Default to annual
    ratePerPeriod = annualRate / 100;
  }
  // Calculate the payment using the formula. This is the PMT function.
  const payment = (principal * ratePerPeriod) / (1 - Math.pow(1 + ratePerPeriod, -periods));

  const schedule = [];
  let balance = principal;
  for (let i = 0; i < periods; i++) {
    const interestPayment = balance * ratePerPeriod;
    const principalPayment = payment - interestPayment;
    balance -= principalPayment;
    // Ensure balance doesn't go negative due to floating point inaccuracies on the last payment
    if (i === periods - 1) {
        balance = 0; // Final balance should be zero
    }
    schedule.push({ payment, interest: interestPayment, principalPaid: principalPayment, balance });
  }
  return schedule;
}

export function calculateBreakevenPoint(financingPrincipal: number, financingRate: number, marginPrincipal: number, marginRate: number): number {
  const r1 = financingRate / 100;
  const r2 = marginRate / 100;
  if (r1 === r2) return 0;
  if (financingPrincipal <= 0 || marginPrincipal <= 0) return NaN;
  if ((1 + r1) / (1 + r2) <= 0) return NaN; // Avoid log of non-positive number
  const t = Math.log(marginPrincipal / financingPrincipal) / Math.log((1 + r1) / (1 + r2));
  return t; // Return t in years, could be fractional
}

/**
 * Calculates the periodic payment for a loan/annuity.
 *
 * @param principal The initial loan amount (present value).
 * @param annualRate The annual interest rate (e.g., 5 for 5%).
 * @param periods The total number of payment periods.
 * @param compoundingFrequency The frequency of payments and compounding ('annual', 'monthly', 'bi-weekly').
 * @returns The periodic payment amount.
 */
export function calculatePeriodicPayment(principal: number, annualRate: number, timePeriod: number, compoundingFrequency: string): number {
  let periodsPerYear: number;
  if (compoundingFrequency === 'monthly') {
    periodsPerYear = 12;
  } else if (compoundingFrequency === 'bi-weekly') {
    periodsPerYear = 26;
  } else { // Default to annual
    periodsPerYear = 1;
  }

  const totalPeriods = timePeriod * periodsPerYear;
  const ratePerPeriod = (annualRate / 100) / periodsPerYear;

  if (ratePerPeriod === 0) {
    // Handle zero interest rate to avoid division by zero or NaN issues
    return principal / totalPeriods;
  }

  // PMT formula: P = (r * PV) / (1 - (1 + r)^-n)
  const payment = (principal * ratePerPeriod) / (1 - Math.pow(1 + ratePerPeriod, -totalPeriods));

  // Handle potential floating point inaccuracies for very small payments
  return parseFloat(payment.toFixed(2));
}