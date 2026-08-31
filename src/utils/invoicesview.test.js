import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import InvoicesView from '../views/InvoicesView.vue'
import * as api from '../services/api'

describe('InvoicesView – nedladdningsknapp', () => {
  it('visar "Ladda ner" bara för fakturor som är nedladdningsbara', async () => {
    vi.spyOn(api, 'fetchInvoices').mockResolvedValue([
      {
        id: 'F-001',
        period: 'Januari 2026',
        amount: 500,
        due: '2026-02-01',
        status: 'Obetald',
        downloadable: true,
      },
      {
        id: 'F-002',
        period: 'Februari 2026',
        amount: 450,
        due: '2026-03-01',
        status: 'Obetald',
        downloadable: false,
      },
    ])

    const wrapper = mount(InvoicesView)
    await flushPromises() // väntar in onMounted + fetchInvoices

    const rows = wrapper.findAll('tr')
    // Kollar texten radvis
    const f001Row = rows.find((tr) => tr.text().includes('F-001'))
    const f002Row = rows.find((tr) => tr.text().includes('F-002'))

    expect(f001Row.find('.download').exists()).toBe(true)
    expect(f002Row.find('.download').exists()).toBe(false)
  })
})
