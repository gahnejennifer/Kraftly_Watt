import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'jest-axe'
import LoginView from './LoginView.vue'

// LoginView använder routern för att gå vidare efter inloggning – i testet räcker en låtsasrouter.
// Ingen Pinia: vår LoginView använder ingen store (och @pinia/testing kräver Pinia 4).
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {} }),
}))

describe('LoginView – tillgänglighet', () => {
  it('har inga axe-överträdelser', async () => {
    const { container } = render(LoginView)
    expect(await axe(container)).toHaveNoViolations()
  })

  // axe godkänner en placeholder som namn – getByLabelText gör det inte
  it('fälten har labels som en skärmläsare hittar', () => {
    render(LoginView)
    expect(screen.getByLabelText('E-postadress')).toBeInTheDocument()
    expect(screen.getByLabelText('Lösenord')).toBeInTheDocument()
  })
})
