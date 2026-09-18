# Teststrategi – Kraftly Mina sidor

## Nivåer

Enhet (Vitest): …
Komponent (Vitest + Vue Testing Library): …
E2E (Cypress): …

## Karta: vad testas var

| Del av portalen                      | Nivå      | Varför just där?                                                                                                                                                                                         | Finns test idag? |
| :----------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- |
| Prisformattering                     | Enhet     | Specifik ändring, tydligt att mäta med enhetstest                                                                                                                                                        | Ja               |
| Förnamn i hälsning                   | Enhet     | Det är en avgränsad funktion som inte är beroende av andra delar av koden                                                                                                                                | Ja               |
| Fakturastatus (förfallen?)           | Komponent | Eftersom den är beroende av flera funktioner (dagens datum, förfallodatum, status)                                                                                                                       | Ja               |
| Validering flyttanmälan              | Enhet     | Funktion som går igenom objekt, den är avgränsad och går inte igenom något annat                                                                                                                         | Ja               |
| StatusChip                           | Enhet     | En del av större test men kan köras separat också                                                                                                                                                        | Ja               |
| Flyttanmälans formulär               | E2E       | Vi behöver testa hela flödet och beteendet i webbläsaren där formuläret fylls i                                                                                                                          | Nej              |
| Förbrukningsdiagrammet               | Komponent | Det är en enskild vue-komponent som inte är beroende av hela flödet för att testas                                                                                                                       | Nej              |
| Stores (user, consumption)           | Enhet     | Vi mockar bort API-anropet helt och testar isolerat att loading/data sätts korrekt — ingen webbläsare eller nätverk inblandat                                                                            | Ja               |
| API-klienten (api.js)                | Enhet     | Regressionstest. Det är ren, isolerad logik i en enskild fil, vi behöver inte starta webbläsaren eller klicka er igenom UI:t för att bevisa det.                                                         | Ja               |
| Inloggningsflödet                    | E2E       | Ett helt kritiskt flöde eftersom det har flera saker kopplat till sig. Simulerar användarbeteenden.                                                                                                      | Ja               |
| Navigation mellan sidor              | E2E       | eftersom det handlar om riktig webbläsarnavigering, klickbara länkar och URL-ändringar, är det precis den typen av flöde E2E-tester är gjorda för.                                                       | Nej              |
| Ladda ner fakturan-knapp             | Komponent | Komponenttest som monterar InvoicesView med en mockad fetchInvoices()-lista som innehåller både en nedladdningsbar och en icke-nedladdningsbar faktura, och verifierar att knappen bara syns på rätt rad | Ja               |
| OnMounted i ConsumtionChart          | Komponent | Vi ska testa att den hämtar data och kör när komponenten monterar.                                                                                                                                       | Ja               |
| Consumtionjs i dashboard             | Enhet     | En isolerad funktion som sätter loading till true medan hämtningen pågår                                                                                                                                 | Ja               |
| Fakturasidan (rendering av API-data) | E2E       | Bevisar att UI:t visar exakt det API:et returnerar, oavsett innehåll — inte hårdkodat eller cachat                                                                                                       | Ja               |

## Regler

- **PR mergas bara när:** PR-mallen är ifylld, minst en person har reviewat, eventuell feedback är agerad på och testerna är gröna.
- **Ny logik:** All ny logik ska ha nytt test.
- **En buggfix:** måste ha ett regressionstest.
- **Vi mockar API:et genom att:** I enhets- och komponenttester mockar vi API-anrop genom att ersätta funktionerna i services/api.js (vi.spyOn/vi.mock). I E2E-tester använder vi antingen det riktiga mock-API:et (npm run api) för grundläggande flöden (t.ex. smoke-testet), eller cy.intercept() för att simulera specifika svar som är svåra att skapa i den riktiga mock-datan (t.ex. en gammal faktura från 2019).
- **Täckning:** Nej, vi sätter inget procentkrav. Ett sådant mått uppmuntrar att skriva tester för att höja en siffra, snarare än att testa det som faktiskt är kritiskt eller riskabelt. Istället kräver vi att ny logik och buggfixar alltid har test (se regel ovan), vilket vi anser ger bättre kvalitet än ett godtyckligt procenttal.
- **Namngivning & placering:** Alla test förutom E2E läggs i utils och döps till *.test.js. Testnamn på engelska. Namnen ska matcha funktionen/delen av koden som testas.

## Vad vi medvetet inte testar

- CSS
- Hur koden är strukturerad
- Externa delar (API)

## Kommandon

npm test · npm run test:run · (npm run cy:open)
