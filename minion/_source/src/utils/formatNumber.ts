export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
}

export function humanizeNumber(value: number): string {
  if (value >= 1e8) {
    return `${(value / 1e8).toFixed(1)}億`
  } else if (value >= 1e4) {
    return `${(value / 1e4).toFixed(1)}萬`
  }
  return value.toString()
}
