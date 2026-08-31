import { describe, it, expect } from 'vitest'
import { validateMove } from './validateMove'

describe('test validateMove', () => {
  it('should return invalid if address is missing', () => {
    const moveForm = {
      address: '',
      zip: '80267',
      city: 'Gävle',
      date: '2026-10-01',
      contract: 'Rörligt pris',
    }

    const expected = {
      address: false,
      zip: true,
      city: true,
      date: true,
      contract: true,
    }

    const result = validateMove(moveForm, new Date('2026-08-29'))

    expect(result).toStrictEqual(expected)
  })

  it('should return invalid if the move date is less than 14 days away', () => {
    const moveForm = {
      address: 'Testgatan 1',
      zip: '80267',
      city: 'Gävle',
      date: '31.08.2026',
      contract: 'Rörligt pris',
    }

    const result = validateMove(moveForm, new Date('2026-08-29'))

    expect(result.date).toBe(false)
  })

  it('should return valid if the move date is at least 14 days away', () => {
    const moveForm = {
      address: 'Testgatan 1',
      zip: '80267',
      city: 'Gävle',
      date: '2026-09-12',
      contract: 'Rörligt pris',
    }

    const result = validateMove(moveForm, new Date('2026-08-29'))

    expect(result.date).toBe(true)
  })
})
