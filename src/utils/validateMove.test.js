import { describe, it, expect } from 'vitest'
import { validateMove } from './validateMove'

describe('test validateMove', () => {
    it('should return invalid if adress is missing', () => {
        const moveForm = { address: '', zip: '80267', city: 'Gävle', date: '2026-10-01', contract: 'Rörligt pris' }

        const expected = {
            address: false,
            zip: true,
            city: true,
            date: true,
            contract: true
        }

        //Act
        const result = validateMove(moveForm, new Date())

        //Assert
        expect(result).toStrictEqual(expected)
    })
})