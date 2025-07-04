export interface FormState {
  purchaseAmount?: number
  financingRate?: number
  marginAdjustment?: number
  timePeriod?: number
  compoundingFrequency?: "annual" | "monthly" | "bi-weekly"
}

/**
 * Parse URL query parameters and return form state object.
 */
export function loadFormStateFromUrl(): FormState {
  const params = new URLSearchParams(window.location.search)
  const purchaseAmount = parseFloat(params.get("purchaseAmount") ?? "")
  const financingRate = parseFloat(params.get("financingRate") ?? "")
  const marginAdjustment = parseFloat(params.get("marginAdjustment") ?? "")
  const timePeriod = parseInt(params.get("timePeriod") ?? "", 10)
  const compoundingFrequency = params.get("compoundingFrequency")

  const formState: FormState = {}

  if (!isNaN(purchaseAmount)) formState.purchaseAmount = purchaseAmount
  if (!isNaN(financingRate)) formState.financingRate = financingRate
  if (!isNaN(marginAdjustment)) formState.marginAdjustment = marginAdjustment
  if (!isNaN(timePeriod)) formState.timePeriod = timePeriod
  if (
    compoundingFrequency === "annual" ||
    compoundingFrequency === "monthly" ||
    compoundingFrequency === "bi-weekly"
  ) {
    formState.compoundingFrequency = compoundingFrequency
  }

  return formState
}

/**
 * Serialize form state and update URL query string without reloading.
 */
export function updateUrlWithFormState(formState: FormState): void {
  const params = new URLSearchParams()
  if (formState.purchaseAmount !== undefined) {
    params.set("purchaseAmount", formState.purchaseAmount.toString())
  }
  if (formState.financingRate !== undefined) {
    params.set("financingRate", formState.financingRate.toString())
  }
  if (formState.marginAdjustment !== undefined) {
    params.set("marginAdjustment", formState.marginAdjustment.toString())
  }
  if (formState.timePeriod !== undefined) {
    params.set("timePeriod", formState.timePeriod.toString())
  }
  if (formState.compoundingFrequency !== undefined) {
    params.set("compoundingFrequency", formState.compoundingFrequency)
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState({}, "", newUrl)
}