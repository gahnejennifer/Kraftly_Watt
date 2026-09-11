# M0

[x] Teamrepo skapat från starter-templaten, med skyddad main (PR krävs + minst en godkänd review), PR-mall och CODEOWNERS
[x] Working agreement i README: mötestider, kommunikationsvägar, definition of done för PR:er, tech lead-schema för rotationen
[x] Appen körs lokalt hos alla i teamet
[x] Skuldinventering i docs/debt.md
[x] Kort logg i docs/log.md: vad ni gjorde, vad som var svårt

# M1

[x] Testsvit med minst 10 meningsfulla test – både logik (enhet) och komponent, körbara med npm run test:run, alla gröna
[x] Minst 5 av testerna är på kod som inte var med i torsdagens övningar (stores, api.js, LoginView, ProfileView, spinnern, det svalda felet …)
[x] Minst ett regressionstest på en bugg ur er docs/debt.md – ett test som hade fångat buggen om den funnits kvar. Skriv i testnamnet eller en kommentar vilken skuld det gäller
[x] ESLint + Prettier körs i pre-commit via husky + lint-staged. npm run lint och npm run format:check går igenom på main utan errors
[x] Teststrategi i docs/testing.md enligt strukturen från workshopen: nivåer, karta över vad som testas var, era fem beslut (inkl. täckningskrav ja/nej och varför), vad ni medvetet inte testar
[x] E2E-beslutet dokumenterat i docs/decisions/e2e-verktyg.md (se nedan), och det valda verktygets smoke-test mergat till main (körbart med npm run e2e:pw eller npm run e2e:cy)
[x] Logg i docs/log.md: en post per arbetsdag – vad ni gjorde, vad som var svårt, vem som gjorde vad

# M2

[x] Workflow i .github/workflows/ci.yml som körs på varje pull request mot main och på varje push till main, med lint, format-check, test:run och build – alla gröna på main
[x] Smoke-testet som eget jobb – Cypress eller Playwright enligt ert beslutsdokument från Boiler Room, grönt i CI
[x] Branch protection på main (ruleset): pull request krävs, minst 1 approval, alla era jobb som required status checks, "require branches to be up to date". Bypass-listan tom – tech lead ingår i regeln
[x] Bevis på att grinden fungerar: en PR i historiken där statusen var röd och merge-knappen låst, som sedan blev grön och mergades. Länka den från docs/pipeline.md
[x] npm-cache aktiverad och uppmätt: tiden för npm ci (och hela körningen) före och efter, med skärmdumpar, i docs/pipeline.md
[x] docs/pipeline.md enligt strukturen från workshopen: Mermaid-diagram över ert flöde, tre beslut (jobbindelning, mergekrav, protokoll vid röd main), mätvärdena, skärmdump av låst merge-knapp
[x] CI-badge överst i README som visar passing
[x] Logg i docs/log.md: en post per arbetsdag, inklusive vem som gjorde vad
[x] npm-cache aktiverad och uppmätt: tiden för npm ci (och hela körningen) före och efter, med skärmdumpar, i docs/pipeline.md
[x] docs/pipeline.md enligt strukturen från workshopen: Mermaid-diagram över ert flöde, tre beslut (jobbindelning, mergekrav, protokoll vid röd main), mätvärdena, skärmdump av låst merge-knapp
[x] CI-badge överst i README som visar passing
[x] Logg i docs/log.md: en post per arbetsdag, inklusive vem som gjorde vad

# M3

[x] Multi-stage Dockerfile i repots rot: byggsteg med Node, serveringssteg med nginx. Ingen Node och ingen node_modules i den färdiga imagen
[x] .dockerignore med minst node_modules, dist och .git
[x] nginx.conf med SPA-fallback – omladdning på /fakturor ger appen, inte 404
[x] Imagen är under 100 MB – skärmdump av docker image ls i docs/containers.md. Har du två storlekskolumner gäller DISK USAGE, den första
docker compose up --build från ett rent klon startar frontend (localhost:8080) och mock-API, och man kan logga in och se dashboarden
[x] docker build som eget jobb i CI (image), grönt på main, med imagens storlek i loggen
[] docs/containers.md enligt mallen från workshopen: hur man kör, storlekstabell med uppmätta siffror (minst naiv vs. multi-stage), tre beslut (basimage · hur mock-API:t körs · hur browsern når API:t), vad som körs i CI, kända begränsningar
[x] README Getting started omskriven: ett sätt med Docker, ett utan – och npm start-felet borta (skulden från M0)
[x] Logg i docs/log.md: en post per arbetsdag, inklusive vem som gjorde vad. Ny tech lead presenterad i loggen
[] Valfritt (räknas inte i DoD, men underlättar M4): frontenden anropar /api relativt med proxy i Vite och nginx i stället för hårdkodat localhost:4000 · imagen pushas till GitHub Container Registry från pipelinen.
