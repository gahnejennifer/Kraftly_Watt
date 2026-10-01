import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchInvoices } from '../services/api.js'
import { setAccessToken } from '../services/token.js'

describe('skyddade anrop kräver token', () => {
  beforeEach(() => {
    setAccessToken(null) // ingen inloggning
  })

  it('utan token svarar API:t 401 och anropet kastar', async () => {
    global.fetch = vi.fn(async (url, opts) => {
      const hasToken = opts?.headers?.Authorization?.startsWith('Bearer ')
      return { ok: hasToken, status: hasToken ? 200 : 401, json: async () => ({}) }
    })
    await expect(fetchInvoices()).rejects.toThrow('API error 401')
  })
})
