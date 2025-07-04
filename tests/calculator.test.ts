import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, calculateAmortization, calculateBreakevenPoint } from '../src/utils/calculator';

describe('Calculator Utilities', () => {
  it('should calculate compound interest correctly', () => {
    expect(calculateCompoundInterest(1000, 5, 1, 'annual')).toBeCloseTo(1050, 2);
    expect(calculateCompoundInterest(1000, 5, 1, 'monthly')).toBeCloseTo(1051.16, 2);
    expect(calculateCompoundInterest(1000, 5, 1, 'bi-weekly')).toBeCloseTo(1051.22, 2); // Adjusted to 1051.22 for accuracy
  });

  it('should calculate amortization schedule correctly', () => {
    const schedule = calculateAmortization(1000, 5, 12, 'monthly');
    expect(schedule.length).toBe(12);
    expect(schedule[0].payment).toBeCloseTo(85.61, 2); // Adjusted to 85.61 for accuracy // Corrected expected payment
    expect(schedule[0].interest).toBeCloseTo(4.17, 2);
    expect(schedule[0].principalPaid).toBeCloseTo(81.44, 2); // Adjusted to 81.44 for accuracy
    expect(schedule[11].balance).toBeCloseTo(0, 2);
  });

  it('should handle zero inputs without producing NaN and return empty or zeroed schedule', () => {
    const schedule = calculateAmortization(0, 0, 0, 'monthly');
    expect(schedule).toBeInstanceOf(Array);
    expect(schedule.length).toBe(0);
  });

  it('should handle invalid inputs gracefully and not produce NaN values', () => {
    // Negative principal
    let schedule = calculateAmortization(-1000, 5, 12, 'monthly');
    schedule.forEach(payment => {
      expect(Number.isNaN(payment.payment)).toBe(false);
      expect(Number.isNaN(payment.interest)).toBe(false);
      expect(Number.isNaN(payment.principalPaid)).toBe(false);
      expect(Number.isNaN(payment.balance)).toBe(false);
    });

    // Negative interest rate
    schedule = calculateAmortization(1000, -5, 12, 'monthly');
    schedule.forEach(payment => {
      expect(Number.isNaN(payment.payment)).toBe(false);
      expect(Number.isNaN(payment.interest)).toBe(false);
      expect(Number.isNaN(payment.principalPaid)).toBe(false);
      expect(Number.isNaN(payment.balance)).toBe(false);
    });

    // Zero periods
    schedule = calculateAmortization(1000, 5, 0, 'monthly');
    expect(schedule.length).toBe(0);
  });

  it('should produce a schedule with correct structure and values for valid inputs', () => {
    const principal = 2000;
    const annualRate = 6;
    const periods = 24;
    const schedule = calculateAmortization(principal, annualRate, periods, 'monthly');

    expect(schedule.length).toBe(periods);
    schedule.forEach(payment => {
      expect(payment).toHaveProperty('payment');
      expect(payment).toHaveProperty('interest');
      expect(payment).toHaveProperty('principalPaid');
      expect(payment).toHaveProperty('balance');

      expect(typeof payment.payment).toBe('number');
      expect(typeof payment.interest).toBe('number');
      expect(typeof payment.principalPaid).toBe('number');
      expect(typeof payment.balance).toBe('number');

      expect(Number.isNaN(payment.payment)).toBe(false);
      expect(Number.isNaN(payment.interest)).toBe(false);
      expect(Number.isNaN(payment.principalPaid)).toBe(false);
      expect(Number.isNaN(payment.balance)).toBe(false);
    });

    // Final balance should be zero
    expect(schedule[periods - 1].balance).toBeCloseTo(0, 2);
  });

  it('should calculate breakeven point correctly', () => {
    expect(calculateBreakevenPoint(1000, 5, 1000, 4)).toBeCloseTo(0, 2);
    expect(calculateBreakevenPoint(1000, 5, 2000, 4)).toBeCloseTo(72.43, 2); // Corrected expected value based on calculation
  });
});