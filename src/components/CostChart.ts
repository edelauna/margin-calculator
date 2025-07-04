import Chart, { type PointStyle } from "chart.js/auto"
import { calculateCompoundInterest } from "../utils/calculator"
import { formatNumber } from "../utils/numberFormat"

let currentChartInstance: Chart | null = null

export function updateChart(
  purchaseAmount: number,
  financingRate: number,
  marginAdjustment: number,
  timePeriod: number,
  compoundingFrequency: string,
) {
  const chartContainer = document.querySelector(".chart-container") as HTMLElement | null
  if (!chartContainer) {
    console.error("Chart container not found.")
    return
  }

  // Ensure container is properly sized and responsive
  chartContainer.className = "chart-container bg-gray-50 rounded-lg p-2 sm:p-4 w-full overflow-hidden"
  chartContainer.style.height = "300px" // Fixed height for mobile
  chartContainer.style.minHeight = "300px"

  // Set responsive height based on screen size
  if (window.innerWidth >= 640) {
    chartContainer.style.height = "400px"
  }

  let canvas = chartContainer.querySelector("canvas") as HTMLCanvasElement | null
  if (!canvas) {
    canvas = document.createElement("canvas")
    canvas.style.maxWidth = "100%"
    canvas.style.height = "100%"
    chartContainer.appendChild(canvas)
  }

  const ctx = canvas.getContext("2d")

  if (ctx) {
    if (currentChartInstance) {
      currentChartInstance.destroy()
    }

    const financingFutureValue = calculateCompoundInterest(
      purchaseAmount,
      financingRate,
      timePeriod,
      compoundingFrequency,
    )
    const marginFutureValue = calculateCompoundInterest(
      purchaseAmount,
      marginAdjustment,
      timePeriod,
      compoundingFrequency,
    )

    const financingInterest = financingFutureValue - purchaseAmount
    const marginInterest = marginFutureValue - purchaseAmount

    // Calculate savings/cost difference
    const difference = marginInterest - financingInterest
    const betterOption = difference < 0 ? "Margin" : "Financing"

    currentChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Traditional Financing", "Margin Withdrawal"],
        datasets: [
          {
            label: "Principal Amount",
            data: [purchaseAmount, purchaseAmount],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: "Interest Cost",
            data: [financingInterest, marginInterest],
            backgroundColor: [
              marginInterest < financingInterest ? "rgba(239, 68, 68, 0.8)" : "rgba(34, 197, 94, 0.8)",
              marginInterest < financingInterest ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)",
            ],
            borderColor: [
              marginInterest < financingInterest ? "rgba(239, 68, 68, 1)" : "rgba(34, 197, 94, 1)",
              marginInterest < financingInterest ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 2,
            borderRadius: 0,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 5,
            right: 5,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: window.innerWidth < 640 ? 10 : 12,
                weight: 500,
              },
              color: "#374151",
              maxRotation: window.innerWidth < 640 ? 45 : 0,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: "rgba(156, 163, 175, 0.2)",
            },
            ticks: {
              font: {
                size: window.innerWidth < 640 ? 9 : 11,
              },
              color: "#6B7280",
              callback: (value) => {
                const num = Number(value)
                if (window.innerWidth < 640 && num >= 1000) {
                  return "$" + (num / 1000).toFixed(0) + "k"
                }
                return "$" + formatNumber(num)
              },
            },
            title: {
              display: window.innerWidth >= 640,
              text: "Total Cost (CAD)",
              font: {
                size: 12,
                weight: 600,
              },
              color: "#374151",
            },
          },
        },
        plugins: {
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            titleColor: "#F9FAFB",
            bodyColor: "#F9FAFB",
            borderColor: "rgba(75, 85, 99, 0.2)",
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: {
              size: window.innerWidth < 640 ? 12 : 14,
            },
            bodyFont: {
              size: window.innerWidth < 640 ? 11 : 13,
            },
            callbacks: {
              label: (context) => {
                const value = context.parsed.y
                return (
                  context.dataset.label +
                  ": $" +
                  formatNumber(value)
                )
              },
              afterBody: () => [
                `Interest Difference: $${formatNumber(Math.abs(difference))}`,
                `${betterOption} is ${Math.abs(difference) < financingInterest * 0.01 ? "slightly" : "significantly"} better`,
                `Savings: ${((Math.abs(difference) / Math.max(financingInterest, marginInterest)) * 100).toFixed(1)}%`,
              ],
            },
          },
          title: {
            display: true,
            text: window.innerWidth < 640 ? "Cost Comparison" : "Total Cost Comparison: Principal + Interest",
            font: {
              size: window.innerWidth < 640 ? 14 : 16,
              weight: 600,
            },
            color: "#111827",
            padding: {
              bottom: window.innerWidth < 640 ? 10 : 20,
            },
          },
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "rect",
              font: {
                size: window.innerWidth < 640 ? 10 : 12,
                weight: 500,
              },
              color: "#374151",
              padding: window.innerWidth < 640 ? 10 : 20,
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                const principalDataset = datasets.find(ds => ds.label === "Principal Amount");
                const interestDataset = datasets.find(ds => ds.label === "Interest Cost");
                const redColor = "rgba(239, 68, 68, 0.8)";
                const greenColor = "rgba(34, 197, 94, 0.8)";
                const redBorder = "rgba(239, 68, 68, 1)";
                const greenBorder = "rgba(34, 197, 94, 1)";
                const labels = [];
  
                if (principalDataset) {
                  labels.push({
                    text: principalDataset.label ?? "Principal Amount",
                    fillStyle: principalDataset.backgroundColor as string,
                    strokeStyle: principalDataset.borderColor as string,
                    lineWidth: 2,
                    hidden: false,
                    index: datasets.indexOf(principalDataset),
                    pointStyle: "rect" as PointStyle,
                  });
                }
  
                if (interestDataset) {
                  // Add two legend items for Interest Cost: red and green
                  labels.push({
                    text: "Interest (Unfavorable)",
                    fillStyle: redColor,
                    strokeStyle: redBorder,
                    lineWidth: 2,
                    hidden: false,
                    index: datasets.indexOf(interestDataset),
                    pointStyle: "rect" as PointStyle,
                  });
                  labels.push({
                    text: "Interest (Favorable)",
                    fillStyle: greenColor,
                    strokeStyle: greenBorder,
                    lineWidth: 2,
                    hidden: false,
                    index: datasets.indexOf(interestDataset),
                    pointStyle: "rect" as PointStyle,
                  });
                }

                return labels;
              },
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    })
  }

  // Handle window resize
  const handleResize = () => {
    if (currentChartInstance) {
      currentChartInstance.resize()
    }
  }

  window.removeEventListener("resize", handleResize)
  window.addEventListener("resize", handleResize)
}
