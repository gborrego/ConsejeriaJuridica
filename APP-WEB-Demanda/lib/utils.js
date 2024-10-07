export function validateNonEmptyFields(arrayToValidate) {
  if (arrayToValidate.length === 0) return false

  for (const field of arrayToValidate) {
    if (typeof field === 'string' && field.trim() === '') return false
    if (typeof field === 'boolean' && field === false) return false
    if (typeof field === 'undefined') return false
    if (typeof field === 'number' && field === 0) return false
  }

  return true
}

export function getDate() {
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(Date.now())
}
