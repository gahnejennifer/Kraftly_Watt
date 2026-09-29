import { describe, expect, it } from 'vitest'
import { firstName } from './user'

describe('First name tests', () => {
  it('should return the first name from a full name', () => {
    expect(firstName('John Doe')).toBe('John')
  })

  it('renders empty string if parameter is undefined', () => {
    expect(firstName(undefined)).toBe('')
  })

  it('renders empty string if parameter is null', () => {
    expect(firstName(null)).toBe('')
  })

  it('rejects special characters in the first name', () => {
    expect(() => firstName('J@hn D0e')).toThrow('Invalid characters in first name')
  })

  it('accepts Swedish characters in the first name', () => {
    expect(firstName('Åsa Öberg')).toBe('Åsa')
  })
})
