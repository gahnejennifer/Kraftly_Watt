export const validateMove = (moveForm, currentDate = new Date()) => {
  const value = moveForm.date?.trim()

  let moveDate = null

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    moveDate = new Date(`${value}T00:00:00`)
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    const [day, month, year] = value.split('.')
    moveDate = new Date(`${year}-${month}-${day}T00:00:00`)
  }

  const today = new Date(currentDate)
  today.setHours(0, 0, 0, 0)

  const minimumMoveDate = new Date(today)
  minimumMoveDate.setDate(minimumMoveDate.getDate() + 14)

  return {
    address: moveForm.address.length > 0,
    zip: moveForm.zip && moveForm.zip.length === 5,
    city: moveForm.city && moveForm.city.length > 0,
    date: !!moveDate && !Number.isNaN(moveDate.getTime()) && moveDate >= minimumMoveDate,
    contract: moveForm.contract && moveForm.contract.length > 0
  }
}