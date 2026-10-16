# Tillgänglighet

_Mål: WCAG 2.2 nivå AA. Kontrollerat med axe i komponenttesterna, Storybooks Accessibility-flik
och en genomgång med tangentbordet. Storybook och axe körs lokalt (i pipelinen: M9)._

## Komponentbiblioteket

| Komponent | Ersätter | API |
| --------- | -------- | --- |
|           |          |     |

    npm run storybook    # komponenterna med stories, fliken Accessibility
    npm run test:a11y    # axe-testerna (filerna *.a11y.test.js)

## Vad vi åtgärdade

| Brist                                                              | Var                            | Hittades med                            | Åtgärd (PR)                                  |
| ------------------------------------------------------------------ | ------------------------------ | --------------------------------------- | -------------------------------------------- |
| `<html lang="en">` – sidan är på svenska                           | index.html                     | kodläsning – **inte** axe               | #94                                          |
| Sidtiteln är "Vite App"                                            | index.html                     | kodläsning                              | #94                                          |
| `<th>` saknar `scope`                                              | InvoicesView (fakturatabellen) | kodläsning – **inte** axe               | `scope="col"` på varje `<th>` + test (#…)    |
| `*:focus { outline: none }` – fokus syns inte                      | styles.css                     | tangentbordet – **inte** axe            | `:focus-visible`, vit ring i toppmenyn (#94) |
| Låg kontrast StatusChip Betald (`#12b76a` på `#ecfdf3`): 2,48:1    | StatusChip                     | Accessibility-fliken (`color-contrast`) | `#067647` → 5,39:1, Violations 1 → 0 (#95)   |
| Låg kontrast StatusChip Obetald (`#e35d6a` på `#fff1f0`): 3,16:1   | StatusChip                     | Accessibility-fliken (`color-contrast`) | `#b42318` → 5,97:1, Violations 1 → 0 (#95)   |
| Låg kontrast `.hint` (`#b8c0cf` på vitt): 1,83:1                   | styles.css (inloggningen)      | kodläsning, beräknat                    | `#5c6679` → 5,78:1 (#95)                     |
| Låg kontrast etiketter (`#7c8698` på vitt): 3,67:1                 | ProfileView, DashboardView     | kodläsning, beräknat                    | `#5c6679` → 5,78:1 (#95)                     |
| Låg kontrast kvitto efter flyttanmälan (`#12b76a` på vitt): 2,62:1 | MoveFormView                   | kodläsning, beräknat                    | `#067647` → 5,69:1 (#95)                     |
| Tom kolumnrubrik i fakturatabellen                                 | InvoicesView                   | axe (`empty-table-header`, minor)       | dold text "Åtgärd" (#…)                      |
| Ladda ner säger inte vilken faktura                                | InvoicesView                   | kodläsning                              | dold text "faktura F-…" i knappen (#…)       |
| `<tr>` direkt i `<table>`, utan `thead`/`tbody`                    | InvoicesView                   | Vite-varning vid testkörning            | `thead` + `tbody` (#…)                       |
| Logotypen i toppmenyn saknar alt                                   | App.vue                        | kodläsning (grep `<img`)                | `alt="Kraftly"` (#…)                         |

## Tangentbordsgenomgång

16 oktober 2026, Firefox, lokalt (npm run api + npm run dev), main före M8-ändringarna.
Bara tangentbordet: Tab, Shift+Tab, Enter, mellanslag.

| Vy             | Vad vi testade                        | Före                                                                                                                                                                 | Efter |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Inloggning     | Tabba till fälten, logga in med Enter | Fälten nås med Tab. Fokus syns inte på knappen. Enter på logga-in-knappen loggar in/ger feedback på fel lösenord. Enter i skrivfälten skickar inte.                  |       |
| Översikt       | Syns fokus? Nås Fler spartips?        | Inget fokus syns. Fyra osynliga tabbstopp (menyn). Fler spartips nås inte. Enter ledde till Fakturor/Flyttanmälan/Mina uppgifter utan att det syntes var fokus stod. |       |
| Flyttanmälan   | Fyll i och skicka formuläret          | Fälten nås med Tab. Rullgardinen syns inte som fokuserad, pilarna byter val men alternativen visas inte. Knappen nås men syns inte. Enter i fälten skickar inte      |       |
| Mina uppgifter | Ändra och spara                       | Knapparna nås osynligt och fungerar med Enter. Enter i fälten skickar inte                                                                                           |       |
| Fakturor       | Nå Ladda ner                          | Fyra osynliga tabbstopp (menyn). Ladda ner nås inte .                                                                                                                |       |
| Utloggning     | Nå Logga ut i menyn                   | Går inte att tabba till logga ut.                                                                                                                                    |       |

## Vad axe inte hittar

- **Fel språk.** `lang="en"` på en svensk sida gör att en skärmläsare läser upp svensk text med engelskt uttal. axe kollar bara att `lang` finns, inte att det stämmer med innehållet. Hittat genom att läsa index.html.
- **Osynligt fokus.** `outline: none` i styles.css gör att man inte ser var man är när man tabbar. axe testar inte hur sidan ser ut, och i Vitest ritas ingenting. Hittat med tangentbordet.
- **Saknad `scope`.** axe godkänner en tabell utan `scope` när den är så enkel som vår. Hittat genom att läsa InvoicesView.vue.

## Kända brister
