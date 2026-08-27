const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const parseDate = (value) => {
	const [year, month, day] = value.split('-').map(Number)
	return new Date(year, month - 1, day)
}

export const invoiceStatus = (invoice, today) => {
	if (invoice.status === 'Betald') return 'Betald'

	const dueDate = parseDate(invoice.due)
	const currentDate = startOfDay(today)

	return dueDate < currentDate ? 'Förfallen' : 'Obetald'
}