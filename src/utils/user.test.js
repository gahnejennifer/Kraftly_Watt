import { expect, it } from 'vitest'
import { firstName } from './user'

it('should return the first name from a full name', () => {
  const fullName = 'John Doe'
  const result = firstName(fullName)
  expect(result).toBe('John')
})

it('should return an empty string for undefined (issue #66)', () => {
  expect(firstName(undefined)).toBe('')
})

it('should return an empty string for null (issue #68)', () => {
  expect(firstName(null)).toBe('')
})
