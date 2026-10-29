[![CI](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml/badge.svg)](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml)

# Kraftly-portal

Kundportalen _Mina sidor_ för Kraftly. Levererad av Webbmakarna AB 2026-06-30 och vidareutvecklad av team Watt (Jennifer, Truc, Ilona, Natassja).

| Miljö      | Adress                                                         |
| ---------- | -------------------------------------------------------------- |
| Staging    | https://kraftly-watt-main.onrender.com                         |
| Produktion | https://kraftly-watt.onrender.com (deployas efter godkännande) |

Båda tjänsterna ligger på Render Free och sover efter 15 minuter utan trafik. Första anropet efter det kan ta upp till en minut.

## Kom igång

**Du behöver:** Node 22 eller senare (`node -v`) och git. För Docker-vägen även [Docker Desktop](https://docs.docker.com/get-started/get-docker/).

### Utan Docker

1. Kopiera miljöfilen. Den krävs, annars startar inte API:t:
   ```bash
   cp .env.example .env
   ```
   Värdet i `.env.example` räcker lokalt – du behöver ingen riktig API-nyckel.
2. Installera beroendena:
   ```bash
   npm install
   ```
3. Starta mock-API:t. Terminalen fortsätter köra, låt den vara:
   ```bash
   npm run api
   ```
4. Öppna en **andra terminal** och starta appen:
   ```bash
   npm run dev
   ```
5. Öppna http://localhost:5173.

### Med Docker

1. Kopiera miljöfilen: `cp .env.example .env`
2. Starta Docker Desktop och vänta tills det är igång.
3. Kör:
   ```bash
   docker compose up --build
   ```
4. Öppna http://localhost:8080. Terminalen visar loggarna och fortsätter köra – stäng den inte. Stoppa med Ctrl+C och sedan `docker compose down`.

### Så vet du att den fungerar

Logga in med ett testkonto:

| Konto | E-post                       | Lösenord       |
| ----- | ---------------------------- | -------------- |
| Anna  | `anna.andersson@example.com` | `kraftly-anna` |
| Bo    | `bo.bergstrom@example.com`   | `kraftly-bo`   |

Efter inloggningen ska du se **Hej Anna!** (eller **Hej Bo!**) och ett stapeldiagram under _Din elförbrukning – senaste 12 månaderna_. Diagrammet laddar runt en halv sekund senare än resten, eftersom mock-API:t fördröjer förbrukningen med flit. Fakturorna finns under **Fakturor**.

Får du _Fel e-postadress eller lösenord_ med rätt uppgifter körs inte mock-API:t – kontrollera terminalen med `npm run api`.

### Övriga kommandon

| Kommando                                | Vad det gör                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `npm run test:run`                      | Enhets- och komponenttester – sista raden ska säga _passed_ |
| `npm run test:a11y`                     | Bara tillgänglighetstesterna (axe)                          |
| `npm run e2e:cy`                        | Startar API och app och kör Cypress-testerna                |
| `npm run storybook`                     | Komponentbiblioteket på http://localhost:6006               |
| `npm run build`                         | Produktionsbygget till `dist/`                              |
| `npm run lint` · `npm run format:check` | Samma kontroller som pipelinen kör                          |

### Port redan upptagen?

Port 4000 (API), 5173 (Vite) och 8080 (Docker) får inte användas av något annat. Stoppa först dina containrar med `docker compose down`, och leta sedan upp vad som använder porten:

|                      | Mac             | Windows (PowerShell)            |
| -------------------- | --------------- | ------------------------------- |
| Vad använder porten? | `lsof -i :8080` | `netstat -ano \| findstr :8080` |
| Stäng processen      | `kill <PID>`    | `taskkill /PID <PID> /F`        |

## Hemligheter, deploy och rollback

- **Hemligheter:** lokalt behövs ingen riktig nyckel. I staging och produktion ligger `API_KEY` i Render och deploy-hookarna i GitHub-miljöerna – se [`docs/deploy.md`](docs/deploy.md#konfiguration--var-bor-vad).
- **Till produktion:** merge till `main` → staging automatiskt → godkännande i GitHub → produktion med samma image. Se [`docs/deploy.md`](docs/deploy.md#en-ändring-till-produktion).
- **Rollback:** Actions → _Rollback_ → välj miljö och sha. Se [`docs/deploy.md`](docs/deploy.md#rollback).

## Dokumentation

| Fil                                                                                                        | Svarar på                                                                  |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [`docs/architecture.md`](docs/architecture.md)                                                             | Vad pratar med vad, var det kör och lagren i frontend                      |
| [`docs/decisions/`](docs/decisions/README.md)                                                              | Varför – ett dokument per beslut, med index                                |
| [`docs/deploy.md`](docs/deploy.md)                                                                         | Hur en ändring når staging och produktion, var hemligheterna bor, rollback |
| [`docs/pipeline.md`](docs/pipeline.md)                                                                     | Vad som krävs för att merga och vad man gör när `main` är röd              |
| [`docs/known-issues.md`](docs/known-issues.md)                                                             | Vad som är känt trasigt eller medvetet ogjort                              |
| [`docs/readiness.md`](docs/readiness.md)                                                                   | Checklistan _Produktionsfärdig app_ med status per rad                     |
| [`docs/testing.md`](docs/testing.md)                                                                       | Vad som testas var, och varför                                             |
| [`docs/containers.md`](docs/containers.md)                                                                 | Dockerfilen, imagens storlek och hur compose hänger ihop                   |
| [`docs/scaling.md`](docs/scaling.md)                                                                       | Mätvärden, flaskhalsen och regeln för flagga kontra rollback               |
| [`docs/security.md`](docs/security.md)                                                                     | Inloggningen och OWASP-genomgången                                         |
| [`docs/performance.md`](docs/performance.md)                                                               | Hur vi mäter, optimeringarna och budgeten i CI                             |
| [`docs/accessibility.md`](docs/accessibility.md)                                                           | Komponentbiblioteket och tangentbordsgenomgången                           |
| [`docs/ai-in-pipeline.md`](docs/ai-in-pipeline.md)                                                         | AI-granskningen och vår regel för den                                      |
| [`docs/sustainability.md`](docs/sustainability.md)                                                         | CO2-siffran och etikfallet                                                 |
| [`docs/demo.md`](docs/demo.md)                                                                             | Körschemat för slutdemon                                                   |
| [`docs/log.md`](docs/log.md) · [`docs/milestones.md`](docs/milestones.md) · [`docs/debt.md`](docs/debt.md) | Loggen, milstolparna och skulden vi tog över                               |

# Working agreement

## Tech lead

| Person   | Vecka   |
| -------- | ------- |
| Jennifer | v.1-3   |
| Truc     | v.4-6   |
| Ilona    | v.7-9   |
| Natassja | v.10-12 |

## Schema

| Mötestid       | Vad innefattar mötet                         | Digitalt / Fysiskt |
| -------------- | -------------------------------------------- | ------------------ |
| 10:00 fredagar | Avstämning & Arbetar tillsammans             | Digitalt           |
| 10:00 tisdagar | Avstämning & Arbetar tillsammans (vid behov) | Digitalt           |

## Kommunikationsvägar

- Grupp i Slack.
- Vi håller en god kommunikation men förväntas inte svara utanför skoltider.

## Definition of done (DoD)

- Kod ska vara testad
- Pipelinen ska vara grön
- Kod ska vara reviewad av minst 1 annan i teamet

## Riktlinjer

**Hur säger man till när något skaver:** Vi pratar med varandra öppet och tänker på vår ton gentemot varandra, väntar inte för länge med att ta upp något vid behov. Vi håller även i korta retros på fredagarna där man ges tillfälle att ta upp hur veckan gått och vad vi tar med oss till nästa vecka, då kan man ta upp om något skaver.

## Motivering till våra ESLint-regler

**Vi delar upp reglerna i två nivåer beroende på vad de fångar:**

**error — stoppar committen:**

- `no-var` — var har funktionsscope istället för blockscope, vilket kan orsaka svårupptäckta buggar (t.ex. i loopar). Det finns inget legitimt skäl att använda var i modern kod, så vi tillåter det aldrig.
- `eqeqeq` (kräver `===`/`!==`) — `==` gör implicit typkonvertering som kan ge oväntade resultat (t.ex. `'0' == 0` är sant, `null == undefined` är sant). Det är en vanlig källa till riktiga buggar, inte bara en stilfråga, så vi vill bli stoppade om det smyger sig in.

**warn — varnar men blockerar inte:**

- `no-console` — vi har idag medvetna `console.log`-anrop kvar i felhanteringen (t.ex. i `api.js`) som en tillfällig lösning. Att sätta den till error skulle blockera commits av kod vi ännu inte hunnit städa. Den ska bort innan release, men är inte kritisk nog att stoppa arbetet just nu.
- `no-alert` — samma resonemang: vi använder `alert()` som en enkel platshållare för användarfeedback (t.ex. i `InvoicesView.vue` vid nedladdning) i väntan på en riktig notis-komponent. En medveten, tillfällig skuld — inte en bugg.
