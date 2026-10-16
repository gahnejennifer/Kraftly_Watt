import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'

// jest-dom ger toBeInTheDocument, toHaveAttribute, toHaveFocus … i alla testfiler.
// axe i komponenttesterna. Paketet heter jest-axe men fungerar likadant i Vitest.
// Kontrastreglerna är avstängda i jest-axe: jsdom har ingen CSS och ingen layout att mäta i.
expect.extend(toHaveNoViolations)

// Ta bort det som ritades efter varje test. Testing Library gör det bara automatiskt
// med globals: true i Vitest – det har vi inte, så utan raden ligger komponenterna kvar.
afterEach(() => cleanup())
