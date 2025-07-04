// src/store/appStore.ts
import Alpine from 'alpinejs';

interface FormData {
  purchaseAmount: number;
  financingRate: number;
  marginAdjustment: number;
  timePeriod: number;
  compoundingFrequency: 'annual' | 'monthly' | 'bi-weekly';
  periods: number;
  periodicPayment: number;
  marginPeriodicPayment: number;
}

interface AppStore {
  formData: FormData | null;
  scenario: 'financing' | 'margin';
  setFormData(data: FormData): void;
  setScenario(newScenario: 'financing' | 'margin'): void;
}

// Initialize the store
Alpine.store('app', {
  formData: null, // Initialize with null or default values if you have them
  scenario: 'financing', // Default scenario

  setFormData(data: FormData) {
    this.formData = data;
    // Log for debugging
    console.log('Store: formData updated', this.formData);
  },

  setScenario(newScenario: 'financing' | 'margin') {
    this.scenario = newScenario;
    // Log for debugging
    console.log('Store: scenario updated', this.scenario);
  },
} as AppStore); // Type assertion for TypeScript

// You might export the type for use in other files if needed
export type { FormData, AppStore };