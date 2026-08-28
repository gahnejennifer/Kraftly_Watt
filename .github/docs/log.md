## Datum: 2026-08-21
Ilona, Natassja, Jennifer hade avstämning och gjorde klart setupen med codeowners, checkade PR-mallen och work agreement. 
Satte upp dokument för milestones, log och skuldinventering. Vi bestämde att vi kommer att göra skuldinventeringen individuellt eftersom vi kan arbeta olika tider och att vi stämmer av med varandra på tisdag hur det gått och fyller på loggen då. Ilona och Truc kommer till dess köra repot lokalt och testa att det fungerar för dem också.
**Svårt:** Att veta om vi gjort rätt på codeowners och om alla ska stå med där varje vecka oavsett vem som är techlead.

## Datum: 2026-08-25
Ilona, Natassja, Truc, Jennifer stämde av vad vi alla hade hittat under skuldinventeringen och diskuterade det vi hittat. Sen sammanfattade vi det tillsammans och stämde av att appen fungerade lokalt för alla i teamet. 
**Svårt:** Vi upplevde att det var lite svårt att veta exakt vad som förväntas göra vid en skuldinventering, om det är allt som kan förbättras med appen eller om det bara avser buggar man hittar i koden. Vi hade gärna fått mer instruktioner på vad som förväntades och vad vi ska titta efter. Det hade vi gärna fått vid framtida uppgifter. Det är svårt att ta över någon annans kod, jättebra att vi får öva på det.

## Datum: 2026-08-28 · Boiler Room 1
**Gjort:** Vi började dagen med att gå igenom vad vi tidigare fått gjort eftersom alla i gruppe inte varit med, så att vi alla var uppsjungna på det senaste. Vi jobbade också vidare på gårdagens uppgift. Sen satt vi individuellt och letade efter tester som vi skulle kunna skriva i M1. Vi gjorde sen 2 tester, varav det ena var ett enhetstest och det andra ett komponenttest. Eftersom det andra var ett komponenttest har vi också satt upp jsdom osv för att få komponenttestning att fungera. Vi har ockås testat E2E i både Cypress och Playwright där vi tillslut valde Cypress och motiverade det. När vi testade så jämförde vi de olika verktygen och satte tillsammans upp båda verktygen då vi inte var tillräckligt många för att dela upp oss.

**Grönt:** … (länkar till PR:ar)
Kvar till M1-taggen tisdag: 
- 3st test på egna findings (7/10 klara)
- Minst ett regressionstest på en bugg ur vår docs/debt.md
- ESLint + Prettier körs i pre-commit
- Teststrategi i docs/testing.md

**E2E:** valde Cypress · smoke + mockat test gröna: ja
**Fastnat på:** …