import Alpine from "alpinejs"
import "./store/store.ts"
import ConversionTool from "./components/ConversionTool"
import CTAButton from "./components/CTAButton"
import { InputForm } from "./components/InputForm.ts"
import "./components/InputForm"
import { updateSchedule } from "./components/ScheduleTable.ts"
import { updateChart } from "./components/CostChart.ts"

window.Alpine = Alpine

// Register Alpine data components
Alpine.data("conversionTool", ConversionTool)
Alpine.data("ctaButton", CTAButton)

const appElement = document.querySelector<HTMLDivElement>("#app")!
appElement.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Margin Calculator</h1>
              <p class="text-sm text-gray-600">Smart Investment Decisions</p>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <span class="text-sm text-gray-600">Professional Financial Analysis</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gradient mb-4">
          Compare Financing vs Withdrawing Cash on Margin
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Make informed investment decisions by comparing the true costs of traditional financing against withdrawing cash on margin.
        </p>
      </div>

      <!-- Main Grid Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <!-- Input Form Column -->
        <div class="xl:col-span-1 order-1">
          <div class="card xl:sticky xl:top-24">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Calculation Parameters
            </h3>
            ${InputForm()}
          </div>
        </div>

        <!-- Results Column -->
        <div class="xl:col-span-2 order-2 space-y-6 lg:space-y-8 min-w-0">

          <!-- Chart Section -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Cost Comparison Analysis
            </h3>
            <div class="chart-container bg-gray-50 rounded-lg p-2 sm:p-4 w-full overflow-hidden" style="height: 300px; min-height: 300px;"></div>
          </div>

          <!-- Scenario Toggle -->
          <div x-data="conversionTool" class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Scenario Analysis
              </h3>
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">Schedule View:</span>
                <span x-text="scenario" class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize"></span>
              </div>
            </div>
            <button @click="toggleScenario" class="btn btn-primary w-full sm:w-auto flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
              <span>Toggle to&nbsp;</span><span x-text="scenario === 'financing' ? ' Margin' : 'Financing'"></span><span>&nbsp;Schedule</span>
            </button>
          </div>

          <!-- Schedule Table -->
          <div x-data class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              Payment Schedule
              <span x-text="() => '(' + ($store.app.scenario === 'financing' ? 'Financing' : 'Margin') + ' Scenario)'" class="ml-2 text-sm font-normal text-gray-600 capitalize"></span>
            </h3>
            <div class="schedule-container overflow-x-auto"></div>
          </div>

          <!-- Enhanced CTA Section with Multiple Options -->
          <div class="space-y-6 lg:space-y-8">
            <!-- Primary CTA -->
            <div x-data="ctaButton" class="card bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 relative overflow-hidden">
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-5">
                <svg class="w-full h-full" viewBox="0 0 100 100" fill="none">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>
              
              <div class="relative text-center">
                <div class="flex items-center justify-center mb-4">
                  <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 class="text-2xl font-bold text-gray-900 mb-3">Withdraw Cash on Margin @ Wealthsimple</h3>
                <p class="text-sm text-gray-600 mb-6">Get up to $25 bonus when you fund your account.</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                  <button @click="openReferralLink" class="btn-cta-primary group">
                    <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Open Account
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </button>
                </div>
                
                
              </div>
            </div>

            <!-- Secondary CTA - Educational -->
            <div class="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="flex-1 mb-4 md:mb-0">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">Want to Learn More About Margin Investing?</h4>
                  <p class="text-gray-600 text-sm">Understand the risks and benefits before you start.</p>
                </div>
                <div class="flex-shrink-0">
                  <button @click="openMarginGuide" class="btn-outline">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Read Wealthsimple's Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
      <div x-data class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p class="text-sm">©  <span x-text="new Date().getFullYear()"></span> Margin Financial Calculator. Built for informed investment decisions.</p>
          <p class="text-xs mt-2">This tool provides estimates for educational purposes. Consult with a financial advisor for personalized advice.</p>
        </div>
      </div>
    </footer>
  </div>
`

// Start Alpine AFTER the DOM content is loaded
Alpine.start()

// Separate effects for chart and schedule updates to decouple them
// Chart updates only when form data changes (not scenario changes)
Alpine.effect(() => {
  const formData = Alpine.store("app").formData

  if (formData) {
    const { purchaseAmount, financingRate, marginAdjustment, timePeriod, compoundingFrequency } = formData

    // Chart always shows both scenarios for comparison - no scenario dependency
    updateChart(purchaseAmount, financingRate, marginAdjustment, timePeriod, compoundingFrequency)
  }
})

// Schedule updates when either form data OR scenario changes
Alpine.effect(() => {
  const formData = Alpine.store("app").formData
  const scenario = Alpine.store("app").scenario

  if (formData) {
    const { purchaseAmount, financingRate, marginAdjustment, periods, compoundingFrequency } = formData

    // Determine the effective rate based on the current scenario
    const effectiveRate = scenario === "margin" ? marginAdjustment : financingRate

    // Schedule shows only the selected scenario
    updateSchedule(purchaseAmount, effectiveRate, periods, compoundingFrequency)
  }
})
