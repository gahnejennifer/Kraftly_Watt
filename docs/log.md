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

- https://github.com/gahnejennifer/Kraftly_Watt/pull/11
- https://github.com/gahnejennifer/Kraftly_Watt/pull/12
- https://github.com/gahnejennifer/Kraftly_Watt/pull/13
- https://github.com/gahnejennifer/Kraftly_Watt/pull/14
- https://github.com/gahnejennifer/Kraftly_Watt/pull/15
- https://github.com/gahnejennifer/Kraftly_Watt/pull/16

Kvar till M1-taggen tisdag:

- 3st test på egna findings (7/10 klara)
- Minst ett regressionstest på en bugg ur vår docs/debt.md
- ESLint + Prettier körs i pre-commit
- Teststrategi i docs/testing.md

**E2E:** valde Cypress · smoke + mockat test gröna: ja

**Fastnat på:** Att hitta rätt bland instruktionerna, det var lite uppdelat och därmed svårt att helt förstå uppgifterna. Vi fastnade vid E2E på att det saknades beskrivning på hur exakt man skulle gå tillväga med att lägga upp mapparna, vart script skulle läggas in osv. Vi hade gärna velat få en genomgång på hur E2E-testning fungerar i praktiken innan vi gjorde detta själva, men vi förstår att det var en del av uppgiften att försöka sätta upp det själva.

## Datum: 2026-08-31

Truc, Ilona & Jennifer sågs i skolan och jobbade tillsammans på branch "Teamdag" där vi fyllde i teststrategin med alla parametrar. Vi gjorde även resterande tester som vi hade kvar på M1 (varav 1 regressionstest). Vi fyllde i milestones för M1 och blev klara med samtliga delar. Vi gick också igenom PR som vi hade för vissa fixar.

## Datum: 2026-09-03

Truc, Ilona och Jennifer jobbade under lektionstid på Övning 3 som innehöll delar av M2. Vi satte upp pipelinen för Kraftlyprojektet, såg till att Cypress E2E fungerar på Github Actions, satte upp grinden med rulesets och skrev pipeline.md. Sen testade vi också att grinden fungerar genom att verifiera det live med ett medvetet lintfel. Det fungerade! Vi la också till en badge överst i vår README som blir grön/röd live utifrån om main är grön eller inte.

**Screenshots från delar av det vi gjorde:**
![npm run format:check gick ej igenom](./screenshots/image.png)
![satt upp Cypress E2E och säg till att need funkar på Action/github](./screenshots/Screenshot%202026-09-03%20at%2014.18.09.png)
![hela körningen](./screenshots/Screenshot%202026-09-03%20at%2014.21.36.png)

## Datum: 2026-09-04

Truc och Jennifer hördes på Slack för att jobba vidare på M2 på de delar som kvarstår vilket var att lägga in PR på när grinden stoppade vårt medvetna lintfel, samt strukturera upp de printar vi tog igår så att allt låg rätt i pipeline.md och logen. Vi testade även att kika på hur lång tid npm ci tog på build och quality eftersom vi ville vara säkra på att vi kört flera gånger med cache igår när vi skulle skriva upp tiderna i tabellen. Eftersom det är fredag verkar det som att många kör Github Actions och därför tog det runt 6-7 minuter när vi körde, vilket inte riktigt gick att använda till mätningen. Vi såg i alla fall att cachen fungerar perfekt. På rad 24–25: "Cache restored successfully" och "Cache restored from key: node-cache-Linux-x64-npm-...", med en cache på ~36MB nedladdad på under en sekund (29.8 MB/sec). Det är alltså inte ett cache-miss-problem. Nu har vi redan gjort en mätning tidigare när vi körde med cache två ggr men vi ville testa en gång till för att säkerställa mätningen.

## Överlämning techlead - V3, inför M3

Jag (Jennifer) har nu varit techlead i tre veckor under M0, M1 och M2 och kommer nu lämna över till Natassja som techlead.
**Vad som är igång:**
CI-pipelinen (quality, build, e2e) är uppe och grön på main, med ruleset, badge och grinden verifierad via en riktig röd→grön PR (#28). Alla DoD-punkter för M2 är uppfyllda, inklusive npm-cache-mätningen i docs/pipeline.md. Däremot så upplevde vi att mätningen visade minimal skillnad mellan med/utan cache och därför vill vi köra om den mätningen. Cachen fungerar (bekräftat i loggarna, Cache restored successfully), men npm ci-tiderna har varit ovanligt höga (5–6 min) nu vid senaste körningarna, troligen på grund av hög belastning på GitHub Actions/npm-registret en fredag. Därför kan det vara bra att göra en ny körning för att säkerställa att print två som vi har i pipeline.md inte är från första körningen efter att cachen slogs på (den som fyller cachen).

**Vad som skaver:**
Vi tappade bort ändringar en gång genom att fortsätta committa på en branch (E2E-jobbet) efter att den redan var mergad — de nya commiterna (skärmdumpar, dokumentation) hamnade aldrig på main förrän vi upptäckte det och öppnade en ny PR. Vi behöver bli bättre på att radera feature-branches direkt efter merge och skapa en ny branch per uppgift, istället för att återanvända en gammal. Kanske kan det även vara en idé att radera gamla branches i VS-code lokalt?

**Beslut att ompröva:**
Beslut 3 (protokoll vid röd main: 15 minuter att laga framåt, annars revert) är hittills bara teori — vi har inte haft en riktig incident att testa det på. Nästa tech lead bör hålla koll på om 15 minuter känns rimligt i praktiken första gången main faktiskt blir röd på riktigt, och justera om det behövs.

## Datum: 2026-09-10

Ny techlead skulle vara Natassja men vi har bytt och det blir istället Truc som tar över kommande 3 veckor. Vi satte upp Docker i projektet och då fastnade vi på att få docker compose up --build att fungera. Eftersom vårt API inte låg i nginx.conf och att vi behövde lägga till .env-files i docker.compose.yml göt att få det att fungera. När vi skulle få det att fungera på de andra datorerna som inte skrivit koden under dagens uppgifter så stötte vi på problem. En i teamet hade då en annan server uppe på docker och då kunde docker inte nå 4000 eftersom den var upptagen. Vi fick då köra netstat -ano | findstr :4000 och taskkill /PID 40244 /F. För att vara lite proaktiva såg vi till att lägga till tydliga instruktioner i README så att nästa teammedlem enkelt kan sätta upp docker på deras dator och få allt att fungera direkt.

## Datum: 2026-09-11

Jennifer var inte med igår och försökte idag köra docker compose up --build vilket inte fungerade: docker compose up fungerar hos den som skrev filen men inte i ett rent klon. Efter att vi pushat instuktionerna i README fungerade det. Vi har nu säkrat att tilläggen i M3 fungerar för samtliga i teamet. Vi löste också mappstrukturen så att pull_request_template.md triggas igen när en PR skapas.

## Datum: 2026-09-14

Vi taggade M3 innan lunch men fick sen nya instruktioner. Efter att ha läst igenom allt insåg vi att det såg bra ut förutom lite småfix i vår README (vi hade råkat skriva port 8000 ist för 8080), samt att vi missat bocka i en del i milestones efter att vi la in containers.md. Vi ändrade också lite i vårt beslut nr 3 i containers.md.

## Datum: 2026-09-17

Vi delade upp oss för att dels ta ur nyckeln ur koden som vi ärvt samtidigt som vi satte upp pipelinens deployflöde. Tillsammans satte vi upp ett renderkonto på Jennifer och la in API-nyckeln och API-url:en. För att testa att gamla API-nyckeln är död så gjorde vi ett curltest både med och utan nyckeln. Vi la till Image → GHCR som ytterligare en check i vårt ruleset på Github och såg till att det blev grönt. Därefter testade vi också att vi fick grönt i Pipelinen på deployflödet med Render. Eftersom vi hade skrivit ett test (api.js) för att kolla om API hämtas från env och inte är hårdkodad, så failade testet efter att vi gjorde ändringarna för API. Lösningen blev att lägga till ett värde för BASE_URL istället för ''. Efter det blev pipelinen grön.

## Datum: 2026-09-18

Idag arbetade vi vidare med M4 och dokumentationen för deployment. Vi färdigställde och gick igenom docs/deploy.md, där vi kollade på tidsåtgången för testerna vid deploy. Vi jämförde olika hostingalternativ och tog beslutet att använda oss av Render för produktionen.
Vi tog beslutet att ta bort testet api.test.js eftersom det testet inte längre tillför något nu när vi flyttat API-nyckeln. Det var en snabbfix vi gjorde igår men vi vill säkerställa att vi inte har onödiga test/inaktuella test. För att säkerställa att alla delar av M4 var kara så checkade vi av milestones också. Uppdatering av getting started är nu uppdaterat med cp .env.example .env och vi la till en stagingdel också i README.
