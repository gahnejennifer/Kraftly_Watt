# Pipeline – Kraftly Mina sidor

Allt styrs av `.github/workflows/ci.yml`. Pipelinen körs på varje pull request, på varje push till `main` och för hand via _Run workflow_. Hur deployen och rollbacken går till står i [`deploy.md`](deploy.md).

## Flöde

```mermaid
flowchart LR
  PR["Pull request<br/>eller push till main"] --> Q["quality<br/>lint · format · test:run"]
  PR --> B["build<br/>vite build → dist/"]
  PR --> SB["Storybook<br/>build-storybook"]
  Q --> E["e2e<br/>Cypress"]
  B --> E
  B --> L["Prestandabudget<br/>(Lighthouse)"]
  Q --> IMG["Image → GHCR<br/>push bara från main"]
  E --> IMG
  L --> IMG
  IMG -->|"bara main"| STG["Deploy → staging"]
  STG -->|"godkännande"| PROD["Deploy → produktion"]
```

## Jobben

| Jobb                           | Vad det gör                                                               | Väntar på                | Körs på PR?      | Required check |
| ------------------------------ | ------------------------------------------------------------------------- | ------------------------ | ---------------- | -------------- |
| `quality`                      | `npm run lint`, `npm run format:check`, `npm run test:run`                | –                        | ja               | ja             |
| `build`                        | `vite build`, laddar upp `dist/` som artefakt                             | –                        | ja               | ja             |
| `e2e`                          | Cypress mot mock-API:t (`npm run e2e:cy`)                                 | quality, build           | ja               | ja             |
| `Storybook`                    | `npm run build-storybook` – en trasig story stoppar PR:en                 | –                        | ja               | ja             |
| `Prestandabudget (Lighthouse)` | tre Lighthouse-körningar mot `dist/` – LCP ≤ 2,5 s, CLS ≤ 0,1, JS ≤ 47 kB | build                    | ja               | ja             |
| `Image → GHCR`                 | bygger imagen med commitens sha. Pushar bara från `main`                  | quality, e2e, Lighthouse | ja (bara bygget) | ja             |
| `Deploy → staging`             | Render-hooken, väntar på rätt sha i `/version.txt`, röktest               | Image → GHCR             | nej              | nej            |
| `Deploy → produktion`          | samma image efter godkännande i GitHub-miljön `production`                | Deploy → staging         | nej              | nej            |

AI-granskningen (`ai-review.yml`) körs också på varje PR, men kommenterar bara och är medvetet **inte** en required check – se [`ai-in-pipeline.md`](ai-in-pipeline.md).

## Beslut 1 · Jobb: parallellt eller i serie?

Vi valde att köra e2e i serie efter quality och build via needs, eftersom det sparar CI-minuter — en PR med lintfel eller trasigt bygge stoppas innan vi lägger tid på att starta mock-API, dev-server och Cypress. Nackdelen är längre svarstid: en PR som redan är grön på quality/build väntar ändå ut de jobben innan e2e ens börjar, istället för att köra allt samtidigt.

Lighthouse (M7) och Storybook (M9) lades till senare. Storybook körs parallellt eftersom det inte beror på något annat jobb, och Lighthouse väntar bara på `build` eftersom den mäter samma `dist/`. Imagen byggs först när quality, e2e och Lighthouse är gröna, så att bara kod som klarat testerna och budgeten kan bli en image.

## Beslut 2 · Vad krävs för merge?

- Required checks: `quality`, `build`, `e2e`, `Storybook`, `Prestandabudget (Lighthouse)`, `Image → GHCR`
- Approvals: 1
- Up to date: ja
- Bypass: ingen, inte ens tech lead

Deploy-jobben är inte required checks, eftersom de bara körs på `main` – efter mergen.

## Beslut 3 · Protokoll vid röd main

Den som pushar/mergar och upptäcker att main blir röd flaggar det direkt i Slack-kanalen — ingen ska behöva leta reda på vem som gjorde det.

Personen som orsakade felet (eller den som är tech lead den veckan, om personen inte är tillgänglig) får 15 minuter på sig att felsöka och laga framåt med en ny commit.

Är felet inte löst inom 15 minuter: revertera mergen som gjorde main röd, så att main är grön igen medan felet utreds i lugn och ro på en egen branch. Ingen forcerar igenom en fix eller kringgår rulesetet för att "bara få det grönt" — det gäller oavsett hur nära deadline det är.

Vid nästa arbetstillfälle (tisdag eller fredag 10.00) tas det upp kort i retrospektivet: vad gick sönder och varför slank det igenom checkarna.

## Byggtid: före och efter npm-cache

| Steg             | Utan cache | Med cache |
| ---------------- | ---------- | --------- |
| npm ci (quality) | 31s        | 29s       |
| npm ci (build)   | 29s        | 25s       |
| Hela körningen   | 1m0s       | 54s       |

**Skärmdumpar:**
![time without cache build, quality](./screenshots/Skärmavbild%202026-09-03%20kl.%2013.53.24-1.png)
![time with cache build, quality](./screenshots/Skärmavbild%202026-09-03%20kl.%2013.57.37.png)

## Skärmdump: låst merge-knapp

**PR med medvetet lintfel: https://github.com/gahnejennifer/Kraftly_Watt/pull/28**

![merge med medvetet lint fel blockerad](./screenshots/Знімок%20екрана%202026-09-03%20151851.png)
