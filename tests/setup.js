import { expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'

// jest-dom ger toBeInTheDocument, toHaveAttribute, toHaveFocus … i alla testfiler.
// axe i komponenttesterna. Paketet heter jest-axe men fungerar likadant i Vitest.
// Kontrastreglerna är avstängda i jest-axe: jsdom har ingen CSS och ingen layout att mäta i.
expect.extend(toHaveNoViolations)
