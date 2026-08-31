import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('api.js – env-konfiguration', () => {
  beforeEach(() => {
    vi.resetModules() // tvingar filen att läsas om, så nya env-värden faktiskt används
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('REGRESSION (debt.md – "API ska flyttas till env"): BASE_URL hämtas från env, inte hårdkodad', async () => {
    vi.stubEnv('VITE_API_URL', 'https://mocked-test-url.example.com')

    const api = await import('../services/api.js')

    expect(api.getBaseUrl()).toBe('https://mocked-test-url.example.com')
  })
}) 