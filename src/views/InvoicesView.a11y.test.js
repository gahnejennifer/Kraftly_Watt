import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'jest-axe'
import InvoicesView from './InvoicesView.vue'

vi.mock('../services/api', () => ({
  fetchInvoices: vi.fn().mockResolvedValue([
    {
      id: 'F-001',
      period: 'September 2026',
      amount: 812,
      status: 'Obetald',
      due: '2999-12-31',
      downloadable: true,
    },
  ]),
}))

describe('InvoicesView – tillgänglighet', () => {
  it('har inga axe-överträdelser', async () => {
    const { container } = render(InvoicesView)
    await screen.findByText('F-001')
    expect(await axe(container)).toHaveNoViolations()
  })

  // axe klagar inte på saknad scope – därför ett eget test
  it('kolumnrubrikerna har scope="col"', async () => {
    render(InvoicesView)
    expect(await screen.findByRole('columnheader', { name: 'Belopp' })).toHaveAttribute(
      'scope',
      'col'
    )
  })

  it('Ladda ner säger vilken faktura', async () => {
    render(InvoicesView)
    expect(
      await screen.findByRole('button', { name: 'Ladda ner faktura F-001' })
    ).toBeInTheDocument()
  })
})
