# Beslut: verktyg för E2E-tester

**Datum:** 2026-08-28
**Beslut:** Vi använder Cypress för end-to-end-tester.

## Bakgrund

Vi behöver ett E2E-smoketest i CI (M2) och vill kunna mocka API:et.
Teamet kan Cypress sedan tidigare. Playwright utvärderades idag.

## Vad vi såg (era observationer – inte tutorialens)

|                            | Cypress                                                                                                                    | Playwright                                                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tid till första gröna test | 2s                                                                                                                         | 7.1s                                                                                                                                                                         |
| Hur man hittar element     | CSS-selektorer (input[placeholder="..."]) och cy.contains('button', 'Logga in')                                            | Läsbart (getByPlaceholder), inga egna CSS-selektorer behövdes                                                                                                                |
| Mockning av nätverk        | Ingen mockning - testet gick mot riktiga mock-API:et                                                                       | Ingen mockning – testet gick mot riktiga mock-API:et (npm run api)                                                                                                           |
| Väntan / flakiness         | Inbyggd auto-retry i cy.get(...) / cy.contains(...) – väntar automatiskt tills elementet finns, ingen egen wait() behövdes | Inbyggd auto.wait expect(...).toHaveText(...), behövde inte skriva egna wait.                                                                                                |
| Felmeddelanden             | Tydligt med UI med att testet gick igenom                                                                                  | Testet passerade, men terminalen visade en ovärderad Vue/Vite-varning (<tr> fel i <table> i InvoicesView.vue) men det syns oavsett testverktyg, inte kopplat till Playwright |

## Motivering

Vi känner oss tryggare med Cypress eftersom vi har bekantat oss med det tidigare samt då vi upplever det lättare att överblicka rent visuellt då det finns ett UI i webbläsaren. Utöver det så uppskattar vi att det går att se steg för steg i testet i webbläsaren, hur det såg ut i varje steg. Allt detta underlättade vår felsökning eftersom vi är nya ,med tester. Dessutom var CY snabbare än PW (även om det inte går att säga rent statistiskt efter 1 test).

## Konsekvenser

- Om vi behöver garantera att sidan fungerar i Safari är det enklare i PW
- Ingen automatisk serverstart i configen — CY kräver start-server-and-test i package.json, medan Playwrights webServer-block gör det direkt i configen. Lite mer att underhålla i CI-pipelinen.
- Ett test per fil körs i samma webbläsarkontext som standard — Playwright har inbyggt stöd för att köra tester parallellt i isolerade kontexter enklare, vilket kan bli relevant om testsviten växer.
- cy.visit() är begränsad till en origin per test som standard — kan bli ett problem om vi i framtiden behöver testa flöden som går mellan olika domäner (t.ex. en betalningsleverantör iom att vi har fakturor på hemsidan som visar betald/obetald).
  **Vad som krävs för att byta senare:**
- Testerna är skrivna med Cypress-specifik syntax (cy.get(), cy.contains(), cy.intercept()) som inte är kompatibel med Playwrights API (page.getByRole(), page.route()) — allt testinnehåll skulle behöva skrivas om, inte bara konfigurationen.
- Eftersom vi redan har en fungerande playwright.config.js och ett smoke-test i Playwright (från er utvärdering), skulle grundstrukturen finnas kvar — det är själva testfallen som måste porteras.
- Ingen data eller CI-integration är låst till Cypress specifikt (start-server-and-test-scriptet kan återanvändas för Playwright också), så det är framför allt testkoden i sig som är kostnaden.
