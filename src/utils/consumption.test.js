import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useConsumptionStore } from '../stores/consumption'
import * as api from '../services/api'

describe('consumption store', () => {
  beforeEach(() => {
    // Skapar en ny, ren Pinia-instans inför varje test
    setActivePinia(createPinia())
  })

  it('sätter loading till true under load och false efter, samt sparar data', async () => {
    // Arrange: mocka fetchConsumption så vi slipper anropa riktiga API:et
    vi.spyOn(api, 'fetchConsumption').mockResolvedValue({
      months: ['Jan', 'Feb'],
      values: [120, 98],
    })

    const store = useConsumptionStore()

    // Act: starta load() men vänta inte in den direkt
    const promise = store.load()

    // Assert 1: loading ska vara true medan anropet pågår
    expect(store.loading).toBe(true)

    // vänta in att load() blir klar
    await promise

    // Assert 2: loading ska vara false efteråt
    expect(store.loading).toBe(false)

    // Assert 3: data ska vara satt till det mockade svaret
    expect(store.data).toEqual({ months: ['Jan', 'Feb'], values: [120, 98] })
  })
})
