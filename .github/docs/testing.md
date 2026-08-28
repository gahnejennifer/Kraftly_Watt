# Teststrategi – Kraftly Mina sidor

## Nivåer
Enhet (Vitest): …
Komponent (Vitest + Vue Testing Library): …
E2E (Cypress): …

## Karta: vad testas var
**Del av portalen**	      **Nivå**      **Varför just där?**                                                                **Finns test idag?**
Prisformattering		    Enhet         Specifik ändring, tydligt att mäta med enhetstest  	                              Ja
Förnamn i hälsning		    Enhet         Det är en avgränsad funktion som inte är beroende av andra delar av koden	          Ja
Fakturastatus (förfallen?)	Komponent     Eftersom den är beroende av flera funktioner (dagens datum, förfallodatum, status)  Ja		
Validering flyttanmälan		Enhet         Funktion som går igenom objekt, den är avgränsad och går inte igenom något annat    Ja	
StatusChip			        Enhet         En del av större test men kan köras separat också                                   Ja
Flyttanmälans formulär		E2E           Vi behöver testa hela flödet och beteendet i webbläsaren där formuläret fylls i     Nej	
Förbrukningsdiagrammet	    Komponent     Det är en ensild vue-komponent som inte är beroende av hela flödet för att testas   Nej		
Stores (user, consumption)	E2E           Kritisk del av applikationen som måste fungera för att användaren ska komma in	  Nej	
API-klienten (api.js)		
Inloggningsflödet			
Navigation mellan sidor			
… era egna tillägg:
Ladda ner fakturan-knapp    Komponent?
OnMounted i ConsumtionChart Komponent     Vi ska testa att den hämtar data och kör när komponenten monterar.                  Ja
Consumtionjs i dashboard    Enhet         En isolerad funktion som sätter loading till true medan hämtningen pågår            Ja

## Regler
- PR mergas bara när …
- En buggfix …
- Vi mockar API:et genom …
- Täckning: …

Vad testar vi inte, och varför? (Chart.js? CSS? Routerns interna beteende?)
Hur mockar vi API:et? Modulmock (vi.mock) i komponenttester, riktigt mock-API i E2E, eller något annat? En regel, inte per test.
Vad krävs för att en PR ska få mergas när det gäller test? Alla gröna är självklart. Måste ny logik ha nytt test? Måste en buggfix ha ett regressionstest? (Facits svar: ja på det senare – och det är en bra regel.)
Täckningskrav – ja eller nej? Ett vanligt reflexval är "80 % coverage". Vad garanterar det faktiskt? Vad garanterar det inte? Bestäm er, och skriv varför.
Namngivning & placering. *.test.js bredvid koden eller i tests/? Testnamn på svenska eller engelska? (Koden är på engelska. Testnamn läses av människor – bestäm.)

## Vad vi medvetet inte testar
- CSS
- Hur koden är strukturerad
- Externa delar (API)

## Kommandon
npm test · npm run test:run · (npm run cy:open)