import Alpine from "alpinejs"
import { calculatePeriodicPayment } from "../utils/calculator"
import type { FormData } from "../store/store"
import { loadFormStateFromUrl, updateUrlWithFormState } from "../utils/urlFormState"
import { fetchPrimeRate } from "../utils/bankApi"

interface InputFormInterface {
  purchaseAmount: number
  purchaseAmountFormatted: string
  financingRate: number
  marginAdjustment: number
  timePeriod: number
  compoundingFrequency: "annual" | "monthly" | "bi-weekly"
  periodicPayment: number
  marginPeriodicPayment: number
  dirty: boolean,
  parseNumber: (value: string) => number
  formatNumber: (value: number, opts?: Intl.NumberFormatOptions) => string
  handleSubmit: (event: Event) => void
  calculateAndSetPeriodicPayment: () => void
  calculateAndSetMarginPayment: () => void
  fetchAndUpdateRate: () => Promise<void>
}

const inputFormLogic = (): Alpine.AlpineComponent<InputFormInterface> => ({
  purchaseAmount: 10000,
  purchaseAmountFormatted: "10,000",
  financingRate: 7.0,
  marginAdjustment: 5.0,
  timePeriod: 5,
  compoundingFrequency: "monthly",
  periodicPayment: 0,
  marginPeriodicPayment: 0,
  dirty: false,

  init() {
    // Load form state from URL on initialization
    const formState = loadFormStateFromUrl()
    if (formState.purchaseAmount !== undefined) {
      this.purchaseAmount = formState.purchaseAmount
      this.purchaseAmountFormatted = this.formatNumber(this.purchaseAmount)
    }
    if (formState.financingRate !== undefined) {
      this.financingRate = formState.financingRate
      this.dirty = true
    }
    if (formState.marginAdjustment !== undefined) {
      this.marginAdjustment = formState.marginAdjustment
      this.dirty = true
    }
    if (formState.timePeriod !== undefined) this.timePeriod = formState.timePeriod
    if (formState.compoundingFrequency !== undefined) this.compoundingFrequency = formState.compoundingFrequency

    this.$watch("purchaseAmount", (newValue) => {
      const newFormattedValue = this.formatNumber(newValue, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, 
    });
      if (newFormattedValue !== this.purchaseAmountFormatted) { // Prevent infinite loop
            this.purchaseAmountFormatted = newFormattedValue;
      }
      this.calculateAndSetPeriodicPayment()
      this.calculateAndSetMarginPayment()
    })
    this.$watch("financingRate", () => {
      this.dirty = true
      this.calculateAndSetPeriodicPayment()
    })
    this.$watch("marginAdjustment", () => {
      this.dirty = true
      this.calculateAndSetMarginPayment()
    })
    this.$watch("timePeriod", () => {
      this.calculateAndSetPeriodicPayment()
      this.calculateAndSetMarginPayment()
    })
    this.$watch("compoundingFrequency", () => {
      this.calculateAndSetPeriodicPayment()
      this.calculateAndSetMarginPayment()
    })
    this.$watch('purchaseAmountFormatted', (newValue) => {
        const parsedValue = this.parseNumber(newValue);
        if (parsedValue !== this.purchaseAmount) { // Prevent infinite loop
            this.purchaseAmount = parsedValue;
        }
    });

    this.calculateAndSetPeriodicPayment()
    this.calculateAndSetMarginPayment()

    this.fetchAndUpdateRate()

    setTimeout(() => {
      this.handleSubmit(new Event("submit"))
    }, 0)
  },

  async fetchAndUpdateRate() {
    if (!this.dirty) {
      const rate = await fetchPrimeRate()
      if (rate !== null) {
        this.financingRate = rate + 2
        this.marginAdjustment = rate - 0.5
        this.handleSubmit(new Event("submit"))
        this.calculateAndSetPeriodicPayment()
        this.calculateAndSetMarginPayment()
      }
    }
  },

  formatNumber(value, opts = { // Use 'en-CA' for Canadian English formatting
      minimumFractionDigits: 2,
      maximumFractionDigits: 2, 
    }) {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    return new Intl.NumberFormat('en-CA', opts).format(value);
  },

  parseNumber(value) {
        const cleaned = value.replace(/[^0-9.]/g, ''); // Remove non-numeric except dot
        return parseFloat(cleaned) || 0; // Convert to float, default to 0 if invalid
    },

  handleSubmit(event: Event) {
    event.preventDefault()

    let periods = 0
    if (this.compoundingFrequency === "annual") {
      periods = this.timePeriod * 1
    } else if (this.compoundingFrequency === "monthly") {
      periods = this.timePeriod * 12
    } else if (this.compoundingFrequency === "bi-weekly") {
      periods = this.timePeriod * 26
    }

    const formDataToStore: FormData = {
      purchaseAmount: this.purchaseAmount,
      financingRate: this.financingRate,
      marginAdjustment: this.marginAdjustment,
      timePeriod: this.timePeriod,
      compoundingFrequency: this.compoundingFrequency,
      periods: periods,
      periodicPayment: this.periodicPayment,
      marginPeriodicPayment: this.marginPeriodicPayment,
    }
    this.$store.app.setFormData(formDataToStore)
    updateUrlWithFormState(formDataToStore)
  },

  calculateAndSetPeriodicPayment() {
    if (this.purchaseAmount > 0 && this.timePeriod > 0) {
      this.periodicPayment = calculatePeriodicPayment(
        this.purchaseAmount,
        this.financingRate,
        this.timePeriod,
        this.compoundingFrequency,
      )
    } else {
      this.periodicPayment = 0
    }
  },

  calculateAndSetMarginPayment() {
    if (this.purchaseAmount > 0 && this.timePeriod > 0) {
      this.marginPeriodicPayment = calculatePeriodicPayment(
        this.purchaseAmount,
        this.marginAdjustment,
        this.timePeriod,
        this.compoundingFrequency,
      )
    } else {
      this.marginPeriodicPayment = 0
    }
  },
})

Alpine.data("inputForm", inputFormLogic)

export const InputForm = () => {
  return `
    <form x-data="inputForm" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Purchase Details Section -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
          Purchase Details
        </h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group sm:col-span-2">
            <label for="purchaseAmount" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              Purchase Amount (CAD)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500">$</span>
              <input 
                type="text"
                id="purchaseAmountFormatted"
                name="purchaseAmountFormatted"
                x-model="purchaseAmountFormatted"
                @blur="purchaseAmountFormatted = formatNumber(parseNumber(purchaseAmountFormatted), { minimumFractionDigits: 0, maximumFractionDigits: 0 })"
                @focus="purchaseAmountFormatted = purchaseAmount.toString()"
                class="input-field pl-8"
                placeholder="10,000"
                @input="handleSubmit($event)"
              />
            </div>
          </div>
          <input type="hidden" name="purchaseAmount" x-model="purchaseAmountRaw">


          <div class="form-group">
            <label for="timePeriod" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="hidden sm:inline">Time Period (Years)</span>
              <span class="sm:hidden">Years</span>
            </label>
            <input 
              type="number" 
              id="timePeriod" 
              name="timePeriod" 
              x-model="timePeriod" 
              class="input-field"
              placeholder="5"
              min="1"
              max="30"
              @input="handleSubmit($event)"
            />
          </div>

          <div class="form-group">
            <label for="compoundingFrequency" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span class="hidden sm:inline">Payment Frequency</span>
              <span class="sm:hidden">Frequency</span>
            </label>
            <select 
              id="compoundingFrequency" 
              name="compoundingFrequency" 
              x-model="compoundingFrequency" 
              class="input-field"
              @change="handleSubmit($event)"
            >
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
              <option value="bi-weekly">Bi-weekly</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Financing Scenario Section -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          Traditional Financing Scenario
        </h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="financingRate" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span class="hidden sm:inline">Interest Rate (%)</span>
              <span class="sm:hidden">Rate (%)</span>
            </label>
            <div class="relative">
              <input 
                type="number" 
                step="0.01" 
                id="financingRate" 
                name="financingRate" 
                x-model="financingRate" 
                class="input-field pr-8"
                placeholder="5.50"
                @input="handleSubmit($event)"
                min="0"
                max="30"
              />
              <span class="absolute right-3 top-3 text-gray-500">%</span>
            </div>
          </div>

          <div class="form-group">
            <label for="periodicPayment" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span class="hidden sm:inline">Calculated Payment</span>
              <span class="sm:hidden">Payment</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500">$</span>
              <input 
                type="text" 
                id="periodicPayment" 
                name="periodicPayment" 
                x-model="formatNumber(periodicPayment)" 
                readonly 
                class="input-field pl-8 bg-gray-50 cursor-not-allowed font-semibold text-green-700"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Margin Scenario Section -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Margin Withdrawal Scenario
        </h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="marginAdjustment" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span class="hidden sm:inline">Margin Rate (%)</span>
              <span class="sm:hidden">Rate (%)</span>
            </label>
            <div class="relative">
              <input 
                type="number" 
                step="0.01" 
                id="marginAdjustment" 
                name="marginAdjustment" 
                x-model="marginAdjustment" 
                class="input-field pr-8"
                placeholder="6.50"
                @input="handleSubmit($event)"
                min="0"
                max="30"
              />
              <span class="absolute right-3 top-3 text-gray-500">%</span>
            </div>
          </div>

          <div class="form-group">
            <label for="marginPeriodicPayment" class="label flex items-center">
              <svg class="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              <span class="hidden sm:inline">Calculated Payment</span>
              <span class="sm:hidden">Payment</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500">$</span>
              <input 
                type="text" 
                id="marginPeriodicPayment" 
                name="marginPeriodicPayment" 
                x-model="formatNumber(marginPeriodicPayment)" 
                readonly 
                class="input-field pl-8 bg-gray-50 cursor-not-allowed font-semibold text-purple-700"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Comparison Section -->
      <div class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
        <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Payment Comparison
        </h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="text-sm text-gray-600 mb-1">Financing Payment</div>
            <div class="text-lg font-bold text-green-700" x-text="'$' + formatNumber(periodicPayment)"></div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="text-sm text-gray-600 mb-1">Margin Payment</div>
            <div class="text-lg font-bold text-purple-700" x-text="'$' + formatNumber(marginPeriodicPayment)"></div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="text-sm text-gray-600 mb-1">Monthly Difference</div>
            <div class="text-lg font-bold" 
                 :class="marginPeriodicPayment < periodicPayment ? 'text-green-600' : 'text-red-600'"
                 x-text="(marginPeriodicPayment < periodicPayment ? '-$' : '+$') + formatNumber(Math.abs(marginPeriodicPayment - periodicPayment))">
            </div>
          </div>
        </div>
      </div>
    </form>
  `
}
