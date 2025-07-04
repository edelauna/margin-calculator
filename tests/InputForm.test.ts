import { describe, it, expect } from 'vitest';
import { InputForm } from '../src/components/InputForm';
import { JSDOM } from 'jsdom';

describe('InputForm', () => {
  it('should be defined as a function', () => {
    expect(typeof InputForm).toBe('function');
  });

  it('should render input fields for all required parameters', () => {
    const dom = new JSDOM('<!DOCTYPE html><body></body>');
    const componentHtml = InputForm();
    dom.window.document.body.innerHTML = componentHtml;
    expect(dom.window.document.querySelector('input[name="purchaseAmount"]')).not.toBeNull();
    expect(dom.window.document.querySelector('input[name="financingRate"]')).not.toBeNull();
    expect(dom.window.document.querySelector('input[name="marginAdjustment"]')).not.toBeNull();
    expect(dom.window.document.querySelector('input[name="timePeriod"]')).not.toBeNull();
    expect(dom.window.document.querySelector('select[name="compoundingFrequency"]')).not.toBeNull();
    expect(dom.window.document.querySelector('input[name="periodicPayment"]')).not.toBeNull();
  });
  
  it('should have responsive grid classes on the form', () => {
    const componentHtml = InputForm();
    expect(componentHtml).toContain('grid grid-cols-1 sm:grid-cols-2 gap-4');
  });

  it('should have responsive grid classes on the form', () => {
    const componentHtml = InputForm();
    expect(componentHtml).toContain('grid grid-cols-1 sm:grid-cols-2 gap-4');
  });
});