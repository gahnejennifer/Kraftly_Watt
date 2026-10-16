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

| Brist                                    | Var                            | Hittades med              | Åtgärd (PR) |
| ---------------------------------------- | ------------------------------ | ------------------------- | ----------- |
| `<html lang="en">` – sidan är på svenska | index.html                     | kodläsning – **inte** axe |             |
| Sidtiteln är "Vite App"                  | index.html                     | kodläsning                |             |
| `<th>` saknar `scope`                    | InvoicesView (fakturatabellen) | kodläsning – **inte** axe |             |

## Tangentbordsgenomgång

16 oktober 2026, Firefox, lokalt (npm run api + npm run dev), main före M8-ändringarna.
Bara tangentbordet: Tab, Shift+Tab, Enter, mellanslag.

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
