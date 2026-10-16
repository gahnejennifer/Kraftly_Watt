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

| Brist | Var | Hittades med | Åtgärd (PR) |
| ----- | --- | ------------ | ----------- |
|       |     |              |             |

## Tangentbordsgenomgång

16 oktober 2026, Firefox, lokalt (npm run api + npm run dev), main före M8-ändringarna.
Bara tangentbordet: Tab, Shift+Tab, Enter, mellanslag.

## Tangentbordsgenomgång

16 oktober 2026, Firefox, lokalt (npm run api + npm run dev), main före M8-ändringarna.
Bara tangentbordet: Tab, Shift+Tab, Enter, mellanslag.

| Vy             | Vad vi testade                        | Före                                                                                                                                                                 | Efter |
| -------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| Inloggning     | Tabba till fälten, logga in med Enter | Fälten nås med Tab. Fokus syns inte på knappen. Enter i lösenordsfältet loggar in/ger feedback på fel lösenord. Enter i fälten skickar inte.                         |       |
| Översikt       | Syns fokus? Nås Fler spartips?        | Inget fokus syns. Fyra osynliga tabbstopp (menyn). Fler spartips nås inte. Enter ledde till Fakturor/Flyttanmälan/Mina uppgifter utan att det syntes var fokus stod. |       |
| Flyttanmälan   | Fyll i och skicka formuläret          | Fälten nås med Tab. Rullgardinen syns inte som fokuserad, pilarna byter val men alternativen visas inte. Knappen nås men syns inte. Enter i fälten skickar inte      |       |
| Mina uppgifter | Ändra och spara                       | Knapparna nås osynligt och fungerar med Enter. Enter i fälten skickar inte                                                                                           |       |
| Fakturor       | Nå Ladda ner                          | Fyra osynliga tabbstopp (menyn). Ladda ner nås inte .                                                                                                                |       |
| Utloggning     | Nå Logga ut i menyn                   | Går inte att tabba till logga ut.                                                                                                                                    |       |

## Vad axe inte hittar

## Kända brister
