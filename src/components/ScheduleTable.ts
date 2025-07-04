import { calculateAmortization } from "../utils/calculator"
import { formatNumber } from "../utils/numberFormat"

export const ScheduleTable = (principal: number, annualRate: number, periods: number, paymentFrequency: string) => {
  const schedule = calculateAmortization(principal, annualRate, periods, paymentFrequency)

  // Limit to first 12 periods for better UX, with option to show more
  const displaySchedule = schedule.slice(0, 12)

  const tableContainer = document.createElement("div")
  tableContainer.className = "w-full"

  if (schedule.length === 0) {
    tableContainer.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p>No payment schedule available. Please check your inputs.</p>
      </div>
    `
    return tableContainer
  }

  // Create scrollable wrapper for mobile
  const scrollWrapper = document.createElement("div")
  scrollWrapper.className = "overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0"

  const table = document.createElement("table")
  table.className = "min-w-full divide-y divide-gray-200"
  table.style.minWidth = "600px" // Ensure minimum width for proper display

  const header = table.createTHead()
  header.className = "bg-gray-50"
  const headerRow = header.insertRow()

  const headers = [
    { text: "Period", icon: "#", width: "w-16" },
    { text: "Payment", icon: "$", width: "w-24" },
    { text: "Principal", icon: "→", width: "w-24" },
    { text: "Interest", icon: "%", width: "w-24" },
    { text: "Balance", icon: "=", width: "w-28" },
  ]

  headers.forEach(({ text, icon, width }) => {
    const th = document.createElement("th")
    th.className = `px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${width}`
    th.innerHTML = `
      <div class="flex items-center space-x-1">
        <span class="text-gray-400 text-xs">${icon}</span>
        <span class="hidden sm:inline">${text}</span>
        <span class="sm:hidden">${text.substring(0, 4)}</span>
      </div>
    `
    headerRow.appendChild(th)
  })

  const tbody = table.createTBody()
  tbody.className = "bg-white divide-y divide-gray-200"

  displaySchedule.forEach((rowData, index) => {
    const row = tbody.insertRow()
    row.className = index % 2 === 0 ? "bg-white" : "bg-gray-50"

    const values = [
      { value: index + 1, format: "number" },
      { value: rowData.payment, format: "currency" },
      { value: rowData.principalPaid, format: "currency" },
      { value: rowData.interest, format: "currency" },
      { value: rowData.balance, format: "currency" },
    ]

    values.forEach(({ value, format }) => {
      const cell = row.insertCell()
      cell.className = "px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm"

      if (format === "currency") {
        const formattedValue = formatNumber(value)
        const shortValue = value >= 1000 ? `$${formatNumber(value / 1000, {maximumFractionDigits: 1, minimumFractionDigits: 1})}k` : `$${formattedValue}`
        cell.innerHTML = `
          <span class="font-medium text-gray-900">
            <span class="sm:hidden">${shortValue}</span>
            <span class="hidden sm:inline">$${formattedValue}</span>
          </span>
        `
      } else {
        cell.innerHTML = `<span class="text-gray-900">${value}</span>`
      }
    })
  })

  scrollWrapper.appendChild(table)
  tableContainer.appendChild(scrollWrapper)

  // Add summary footer if there are more periods
  if (schedule.length > 12) {
    const footer = document.createElement("div")
    footer.className = "bg-blue-50 px-4 sm:px-6 py-4 border-t border-blue-200 -mx-4 sm:mx-0"
    const totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0)
    const totalPayments = schedule[0].payment * schedule.length

    footer.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
        <span class="text-blue-700">Showing first 12 of ${schedule.length} payments</span>
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-blue-600 space-y-1 sm:space-y-0">
          <span>Total Interest: <strong>$${formatNumber(totalInterest)}</strong></span>
          <span>Total Payments: <strong>$${formatNumber(totalPayments)}</strong></span>
        </div>
      </div>
    `
    tableContainer.appendChild(footer)
  }

  return tableContainer
}

export function updateSchedule(principal: number, annualRate: number, periods: number, paymentFrequency: string) {
  const table = ScheduleTable(principal, annualRate, periods, paymentFrequency)
  const scheduleContainer = document.querySelector(".schedule-container")
  if (scheduleContainer) {
    scheduleContainer.innerHTML = ""
    scheduleContainer.appendChild(table)
  }
}
