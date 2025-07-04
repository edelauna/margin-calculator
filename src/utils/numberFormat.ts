export function formatNumber(value: number, opts: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }): string {
  return value.toLocaleString('en-CA', opts);
}