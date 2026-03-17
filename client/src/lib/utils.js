export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value, currency = 'INR') {
  const n = Number(value || 0)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDateInputValue(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function uid(prefix = 'tx') {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

