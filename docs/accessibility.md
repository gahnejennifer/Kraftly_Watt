# Tillgänglighet

_Mål: WCAG 2.2 nivå AA. Kontrollerat med axe i komponenttesterna, Storybooks Accessibility-flik
och en genomgång med tangentbordet. Storybook och axe körs lokalt (i pipelinen: M9)._

## Komponentbiblioteket

| Komponent    | Ersätter                                                        | API                                                                                           |
| ------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `KButton`    | BaseButton, AppButton, `.btn`, `.button-secondary`, div-knappar | `variant`: primary · secondary · text, `type` (standard `button`), `block`, texten är en slot |
| `StatusChip` | `<span class="status-chip">` direkt i fakturavyn                | `invoice` (objekt med `status` och `due`)                                                     |

    npm run storybook    # komponenterna med stories, fliken Accessibility
    npm run test:a11y    # axe-testerna (filerna *.a11y.test.js)

## Vad vi åtgärdade

| Brist                                                                                  | Var                                  | Hittades med                                          | Åtgärd (PR)                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `<html lang="en">` – sidan är på svenska                                               | index.html                           | kodläsning – **inte** axe                             | `lang="sv"` (#94)                                                                    |
| Sidtiteln är "Vite App"                                                                | index.html                           | kodläsning                                            | `Mina sidor – Kraftly` (#94)                                                         |
| `<th>` saknar `scope`                                                                  | InvoicesView (fakturatabellen)       | kodläsning – **inte** axe                             | `scope="col"` på varje `<th>` + test (#97)                                           |
| `*:focus { outline: none }` – fokus syns inte                                          | styles.css                           | tangentbordet – **inte** axe                          | `:focus-visible`, vit ring i toppmenyn (#94)                                         |
| Låg kontrast StatusChip Betald (`#12b76a` på `#ecfdf3`): 2,48:1                        | StatusChip                           | Accessibility-fliken (`color-contrast`)               | `#067647` → 5,39:1, Violations 1 → 0 (#95)                                           |
| Låg kontrast StatusChip Obetald (`#e35d6a` på `#fff1f0`): 3,16:1                       | StatusChip                           | Accessibility-fliken (`color-contrast`)               | `#b42318` → 5,97:1, Violations 1 → 0 (#95)                                           |
| Låg kontrast `.hint` (`#b8c0cf` på vitt): 1,83:1                                       | styles.css (inloggningen)            | kodläsning, beräknat                                  | `#5c6679` → 5,78:1 (#95)                                                             |
| Låg kontrast etiketter (`#7c8698` på vitt): 3,67:1                                     | ProfileView, DashboardView           | kodläsning, beräknat                                  | `#5c6679` → 5,78:1 (#95)                                                             |
| Låg kontrast kvitto efter flyttanmälan (`#12b76a` på vitt): 2,62:1                     | MoveFormView                         | kodläsning, beräknat                                  | `#067647` → 5,69:1 (#95)                                                             |
| Tom kolumnrubrik i fakturatabellen                                                     | InvoicesView                         | axe (`empty-table-header`, minor)                     | dold text "Åtgärd" (#97)                                                             |
| Ladda ner säger inte vilken faktura                                                    | InvoicesView                         | kodläsning                                            | dold text "faktura F-…" i knappen (#97)                                              |
| `<tr>` direkt i `<table>`, utan `thead`/`tbody`                                        | InvoicesView                         | Vite-varning vid testkörning                          | `thead` + `tbody` (#97)                                                              |
| Logotypen i toppmenyn saknar alt                                                       | App.vue                              | kodläsning (grep `<img`)                              | `alt="Kraftly"` (#97)                                                                |
| Fler spartips, Ladda ner och Logga ut var `<div>`/`<span>` med `@click`                | DashboardView, InvoicesView, App.vue | tangentbordet – **inte** axe                          | `KButton` (#93)                                                                      |
| Fyra knappvarianter för samma sak (BaseButton, AppButton, `.btn`, `.button-secondary`) | LoginView, ProfileView, MoveFormView | grep + kodläsning (`// TODO merge with BaseButton`)   | `KButton`, de gamla borttagna (#98)                                                  |
| Låg kontrast Spara-knappen (vit text på `#12b76a`): 2,62:1                             | ProfileView                          | kodläsning, beräknat                                  | `KButton` primary `#2f54eb` → 5,85:1 (#98)                                           |
| Fält med bara placeholder som namn                                                     | LoginView, MoveFormView              | `getByLabelText` – **inte** axe                       | `<label for>` + `id`, `autocomplete` (#96, #99)                                      |
| Fält helt utan namn                                                                    | ProfileView                          | axe (`label`, critical)                               | `<label for>` + `id`, `autocomplete` (#96, #99)                                      |
| Fokus stannade på menylänken vid sidbyte – skärmläsaren sa inget om att sidan bytts    | App.vue, router                      | tangentbordsgenomgången och kodläsning – **inte** axe | `router.afterEach` flyttar fokus till sidans `<h1>` (`tabindex="-1"`) (#<PR-nummer>) |

## Tangentbordsgenomgång

Före: 16 oktober 2026, Firefox, lokalt (npm run api + npm run dev), main före M8-ändringarna.

Efter: 19 oktober 2026, Firefox, lokalt, main efter alla M8-PR:er.

Bara tangentbordet: Tab, Shift+Tab, Enter, mellanslag och pilar.

| Vy             | Vad vi testade                        | Före                                                                                                                                                                                                                  | Efter                                                                                                                                                                                                  |
| -------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Inloggning     | Tabba till fälten, logga in med Enter | ✅ Fälten nås med Tab. ✅ Enter på logga-in-knappen loggar in/ger feedback på fel lösenord. ❌ Fokus syns inte på knappen. ❌ Enter i skrivfälten skickar inte.                                                       | ✅ Det syns med markering att fälten nås med Tab. ✅ Enter på knappen Logga in skickar. ❌ Enter i skrivfälten skickar inte.                                                                           |
| Översikt       | Syns fokus? Nås Fler spartips?        | ✅ Enter ledde till Fakturor/Flyttanmälan/Mina uppgifter. ✅ Mellanslag hoppar ner på sidan en bit i taget. ❌ Inget fokus syns. ❌ Fyra osynliga tabbstopp (menyn). ❌ Fler spartips nås inte. ❌ Logga ut nås inte. | ✅ Tab når alla knappar inklusive spartips. ✅ Det syns tydligt vad som är markerat. ✅ Enter skickar på alla knappar.                                                                                 |
| Flyttanmälan   | Fyll i och skicka formuläret          | ✅ Fälten nås med Tab. ✅ Enter på knappar skickar. ❌ Rullgardinen syns inte som fokuserad, men alt + pil fungerar. ❌ Knappar nås men syns inte. ❌ Enter i fälten skickar inte.                                    | ✅ Rullgardinen syns nu som fokuserad. ✅ Knappar och fält syns att de nås med Tab. ✅ Enter på knappen Skicka flyttanmälan skickar. ✅ Enter på knappar skickar. ❌ Enter i skrivfälten skickar inte. |
| Mina uppgifter | Ändra och spara                       | ✅ Knappar fungerar med Enter. ❌ Knapparna nås, men saknar fokus. ❌ Enter i fälten skickar inte.                                                                                                                    | ✅ Syns nu tydligt vilka knappar och fält man tabbar till. ✅ Enter på knappar skickar. ❌ Enter i fälten skickar inte.                                                                                |
| Fakturor       | Nå Ladda ner                          | ❌ Fyra osynliga tabbstopp (menyn). ❌ Ladda ner och Logga ut nås inte.                                                                                                                                               | ✅ Nu nås Ladda ner och det är synligt var man tabbar. ✅ Enter fungerar för alla knappar.                                                                                                             |
| Utloggning     | Nå Logga ut i menyn                   | ❌ Går inte att tabba till logga ut.                                                                                                                                                                                  | ✅ Går att tabba till logga ut nu, och skicka via enter.                                                                                                                                               |

## Vad axe inte hittar

- **Fel språk.** `lang="en"` på en svensk sida gör att en skärmläsare läser upp svensk text med engelskt uttal. axe kollar bara att `lang` finns, inte att det stämmer med innehållet. Hittat genom att läsa index.html.
- **Osynligt fokus.** `outline: none` i styles.css gör att man inte ser var man är när man tabbar. axe testar inte hur sidan ser ut, och i Vitest ritas ingenting. Hittat med tangentbordet.
- **Saknad `scope`.** axe godkänner en tabell utan `scope` när den är så enkel som vår. Hittat genom att läsa InvoicesView.vue.
- **Klickbara `<div>` och `<span>`.** Fler spartips, Ladda ner och Logga ut gick inte att nå med Tab, men axe godkände dem, eftersom en `<div @click>` inte ser fel ut i DOM:en. axe ser inte att den borde vara en knapp. Hittat med tangentbordet.

## Kända brister

Det vi har sett men inte lagat i M8, och det vi inte har testat.

**Sett, inte lagat**

- **Enter i textfälten skickar inte formulären.** Inloggningen och flyttanmälan och Mina uppgifter saknar `<form>`, så man måste tabba till knappen. Hittat i tangentbordsgenomgången.
- **Felen i flyttanmälan visas med `alert()`** och är inte kopplade till fälten med `aria-describedby`. Det görs med KField i Boiler Room 3.
- **Förbrukningsdiagrammet** (`<canvas>`) har inget textalternativ med siffrorna.
- **Hero-bilden** på översikten har en beskrivande alt-text, fast den är dekoration. `alt=""` hade varit rätt, så att skärmläsaren hoppar över den.
- **E2E-testet för inloggningen** (`cypress/e2e/smoke.cy.js`) är bortkommenterat, så inloggningen täcks bara av komponenttestet.

**Inte testat**

- Skärmläsare (VoiceOver eller NVDA)
- Zoom till 200 %
- Storybook och axe i pipelinen (M9). Idag körs axe-testerna i CI via `npm run test:run`, men Accessibility-fliken bara lokalt.
- Stories för NorwayNotice och ConsumptionChart (Boiler Room 3)

**Att tänka på vid testning:** på en av våra datorer (Mac) nådde Tab inga knappar alls, inte ens på en tom testsida med två knappar. Det var en inställning på datorn och inte koden, men det betyder att tangentbordsgenomgången bör göras på mer än en dator.
