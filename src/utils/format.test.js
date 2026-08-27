import { describe, it, expect } from 'vitest'
import { formatAmount } from './format'

describe ('formatAmount', () => {
    it('should return thousandsSeparated amount', () => {
        const amount = 1234567;
        const result = formatAmount(amount)
    expect(result).toBe('1 234 567 kr')    
    
    })

    it('should return amount with kr', () => {
        const amount = 412;
        const result = formatAmount(amount)      
    expect(result).toBe('412 kr')   
    })

    it('should return decimalSeparated amount', () => {
        const amount = 99.5;
        const result = formatAmount(amount)       
    expect(result).toBe('99,50 kr')    
    })

    it('should return '-' to undefined amount', () => {
        const amount = undefined;
        const result = formatAmount(amount)       
    expect(result).toBe('-')    
    })
})