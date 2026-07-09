export function formatFee(amount) {
  return `$${Number(amount).toLocaleString('en-US')}`
}
