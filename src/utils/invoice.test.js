import { it, expect } from 'vitest'
import { invoiceStatus } from './invoice'

it('returns "Förfallen" for an unpaid invoice with a past due date', () => {
  const invoice = { status: 'Obetald', due: '2026-08-26' }
  const today = new Date('2026-08-27T15:30:00')
  const result = invoiceStatus(invoice, today)
  expect(result).toBe('Förfallen')
})

it('returns "Obetald" for an unpaid invoice with a future due date', () => {
  const invoice = { status: 'Obetald', due: '2026-08-28' }
  const today = new Date('2026-08-27T15:30:00')
  const result = invoiceStatus(invoice, today)
  expect(result).toBe('Obetald')
})

it('returns "Betald" for a paid invoice regardless of the due date', () => {
  const invoice = { status: 'Betald', due: '2026-08-26' }
  const today = new Date('2026-08-27T15:30:00')
  const result = invoiceStatus(invoice, today)
  expect(result).toBe('Betald')
})
