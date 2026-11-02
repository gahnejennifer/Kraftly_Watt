# Slutdemo torsdag 5/11

**Demo-ansvarig:** Ilona · **Miljö:** prod – https://kraftly-watt.onrender.com · **Tid:** 10 min demo + 5 min frågor · **Version:** `v1.0`

**Vi som visar:** Jennifer, Ilona och Natassja. Truc har gått vidare till sin praktik och är inte med på demon.

Körschemat börjar med det beställaren frågar efter – vad det ger, vad det kostar, vad vi riskerar – och går sedan ner i hur. Ett demo-ögonblick per område, inte en rundtur.

## Körschema

| Minut     | Vad                                                                                                                                                                              | Vem      | Vad som ska synas                                                                                                                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–1       | **Vad vi tog över – och vad det kostade beställaren.** Vem som helst kunde logga in och hamnade som Anna, API-nyckeln låg i koden och det fanns inga tester eller någon pipeline | Ilona    | Tre rader ur [`docs/debt.md`](debt.md): _Inloggning_, _API ska flyttas till env_, _BaseButton används inte_                                                                                              |
| 1–2       | **Inloggning:** en riktig kund loggar in, och en omladdning loggar inte ut                                                                                                       | Ilona    | Logga in som Anna i prod → _Hej Anna!_ → Cmd+R → fortfarande inloggad. DevTools → Application → Local Storage: ingen token                                                                               |
| 2–3       | **Säkerhet:** ingen kommer åt data utan att logga in – och läckan vi själva hittade                                                                                              | Jennifer | Två flikar i webbläsaren: https://kraftly-watt.onrender.com/api/v2/user → `401`, https://kraftly-watt.onrender.com/api/user → `410`. En mening om v1-läckan som stängdes 29/10 (#128)                    |
| 3–4:30    | **Leverans:** en merge går till staging av sig själv, och till prod först efter godkännande – samma image hela vägen                                                             | Jennifer | Actions → senaste CI-körningen med _Review deployments_ · `/version.txt` i staging och prod visar samma sha                                                                                              |
| 4:30–5:30 | **Feature flag:** Norge-stödet är på i staging och av i prod, utan ny build                                                                                                      | Jennifer | Översikten i staging med Norge-kortet bredvid prod utan · `/config.js` i båda                                                                                                                            |
| 5:30–6:30 | **Prestanda:** /login hämtar 71 % mindre JavaScript, och en PR som gör sidan tyngre stoppas                                                                                      | Natassja | Siffran 141,82 kB → 41,41 kB ur [`docs/performance.md`](performance.md) · [den röda Lighthouse-körningen](https://github.com/gahnejennifer/Kraftly_Watt/actions/runs/37785342926/job/113338707393?pr=86) |
| 6:30–7:30 | **Tillgänglighet:** portalen går att använda med bara tangentbordet                                                                                                              | Natassja | Tab genom översikten i prod: fokus syns på varje knapp, _Fler spartips_ och _Logga ut_ nås, Enter skickar inloggningen                                                                                   |
| 7:30–8:30 | **Överlämningen:** nästa team kan ta över utan att fråga oss                                                                                                                     | Natassja | README → _Så vet du att den fungerar_ och tabellen _Dokumentation_ · arkitekturskissen i [`docs/architecture.md`](architecture.md)                                                                       |
| 8:30–9    | **Vad vi inte gjorde**                                                                                                                                                           | Natassja | [`docs/known-issues.md`](known-issues.md) – _Vad vi hade gjort med två veckor till_: token-förnyelse vid 401, rate limiting på login, skärmläsargenomgång                                                |
| 9–10      | **Sammanfattning: vad portalen klarar i dag**                                                                                                                                    | Ilona    | Prod: en riktig kund loggar in säkert, och varje ändring når kunden testad, granskad och godkänd                                                                                                         |
| 10–15     | Frågor                                                                                                                                                                           | alla     | –                                                                                                                                                                                                        |

## Förberedelser

- [ ] Prod verifierad samma morgon – `/version.txt` visar sha:n för `v1.0`
- [ ] Prod **och staging** väckta tio minuter före (Render sover efter 15 minuter utan trafik, första anropet tar ca 40 s)
- [ ] Flikarna öppna, i ordning:
  1. [`docs/debt.md`](debt.md) på GitHub
  2. Prod, utloggad: https://kraftly-watt.onrender.com
  3. Två flikar: https://kraftly-watt.onrender.com/api/v2/user och https://kraftly-watt.onrender.com/api/user
  4. Actions → senaste CI-körningen på `main`
  5. https://kraftly-watt-main.onrender.com/version.txt och https://kraftly-watt.onrender.com/version.txt
  6. Staging inloggad (Norge-kortet) bredvid prod inloggad
  7. [`docs/performance.md`](performance.md), _Efter_ · [den röda Lighthouse-körningen](https://github.com/gahnejennifer/Kraftly_Watt/actions/runs/37785342926/job/113338707393?pr=86)
  8. README och [`docs/architecture.md`](architecture.md) på GitHub
  9. [`docs/known-issues.md`](known-issues.md)
- [ ] Inloggad med testkontot i en flik, utloggad i en annan
- [ ] Reserven på skrivbordet: skärmdumpar av varje demo-ögonblick i `docs/screenshots/demo/`
- [ ] Det som ska skrivas live finns att kopiera (nedan)

### Att kopiera

```text
anna.andersson@example.com
kraftly-anna
```

Reserv om webbläsaren visar en tom sida i stället för felmeddelandet – samma kontroll i terminalen:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://kraftly-watt.onrender.com/api/v2/user
curl -s -o /dev/null -w "%{http_code}\n" https://kraftly-watt.onrender.com/api/user
```

## Om något går fel

| Om                         | Då                                                                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Prod svarar inte           | Säg det, byt till skärmdumparna i `docs/screenshots/demo/` och berätta vad som skulle synas. Fortsätt i samma ordning                     |
| Inloggningen fungerar inte | Visa skärmdumpen av inloggad översikt. Prova Bo (`bo.bergstrom@example.com` / `kraftly-bo`) en gång – fungerar inte heller det, gå vidare |
| Nätet dör                  | Allt i körschemat finns som skärmdump. Säg att nätet dog och fortsätt med reserven – ingen felsökning på scenen                           |
| Vi är efter i tid          | Stryk först _Överlämningen_ (7:30–8:30), sedan _Prestanda_. _Säkerhet_ och _Vad vi inte gjorde_ stryks aldrig                             |

## Reserven

En skärmdump per demo-ögonblick, sparad i `docs/screenshots/demo/`:

| Fil                  | Vad den visar                                                    |
| -------------------- | ---------------------------------------------------------------- |
| `01-debt.png`        | De tre raderna ur `docs/debt.md`                                 |
| `02-inloggad.png`    | _Hej Anna!_ i prod · Local Storage utan token                    |
| `03-api.png`         | `/api/v2/user` → `401` och `/api/user` → `410` i webbläsaren     |
| `04-deploy.png`      | CI-körningen med godkännandet · samma sha i staging och prod     |
| `05-flagga.png`      | Norge-kortet i staging bredvid prod utan                         |
| `06-prestanda.png`   | Tabellen _Efter_ i `docs/performance.md` · den röda budget-PR:en |
| `07-tangentbord.png` | Synligt fokus på en knapp                                        |
| `08-overlamning.png` | README, _Dokumentation_ · arkitekturskissen                      |
