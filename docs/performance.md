# Prestanda

## Så mäter vi

Dashboarden: Chrome DevTools → Performance → Local metrics, produktionsbygget
(`npm run build && npm run preview` mot lokala mock-API:t), enhetsläge iPhone 12 Pro,
Fast 4G, CPU no throttling, cache av, median av tre omladdningar (`Cmd+R` direkt på
dashboarden). JavaScript: gzip i `npm run build`.

## Före (main)

| Mått                   | Värde                                                |
| ---------------------- | ---------------------------------------------------- |
| LCP dashboard (median) | 1,04 s (1,07 / 1,03 / 1,04)                          |
| CLS dashboard (median) | 0,00 (0,00 / 0,00 / 0,00) – 1 shift: `p.hint` 0,0008 |
| LCP-element            | `img.hero` (hero.jpg, 96 kB, 2400 × 1200 px)         |
| JS /login (gzip)       | 141,82 kB – en fil för alla sidor                    |
| JS dashboarden (gzip)  | 141,82 kB – samma fil                                |

## Optimeringarna

### Spår 1 • Bilden och det som hoppar

### 1.1 Hero-bilden som WebP

LCP-elementet är `img.hero`. Bilden var en JPG på 96 kB och 2400 × 1200 px, men visas
som mest ca 900 px bred, och den saknade `width`/`height`. Vi konverterade till WebP,
skalade ner till 1200 px (räcker för 2× skärmar), lade till `width`/`height` +
`height: auto` så att browsern reserverar platsen innan bilden laddats, och
`fetchpriority="high"` så att LCP-bilden hämtas först. PR: #79

**Fynd:** Bilden gick från 96 kB till 5 kB (5044 byte), minskning på ca 95%.

|                        | Före                        | Efter                       |
| ---------------------- | --------------------------- | --------------------------- |
| hero-bilden            | 96 kB (JPG, 2400 × 1200)    | 5 kB (WebP, 1200 × 600)     |
| LCP dashboard (median) | 1,04 s (1,07 / 1,03 / 1,04) | 0,94 s (0,98 / 0,93 / 0,94) |
| CLS dashboard (median) | 0,00                        | 0,00                        |

### 1.2 Reserverad plats för diagrammet

När dashboarden laddas visas först "Laddar…" i förbrukningskortet. När
`/api/v2/consumption` svarat (efter ca 600 ms) byts texten mot diagrammet, som är mycket
högre, och raden under (`p.hint`, "Källa: din elmätare…") trycktes ner. Vi lade
"Laddar…" och diagrammet i en `div.chart-box` med `aspect-ratio`, så att platsen är
reserverad från start och inget under flyttas när svaret kommer. PR: #…

Mätt mot main efter lazy routes (#80).

|                        | Före                            | Efter                       |
| ---------------------- | ------------------------------- | --------------------------- |
| LCP dashboard (median) | 1,09 s (1,09 / 1,09 / 1,13)     | 1,12 s (1,12 / 1,12 / 1,11) |
| CLS dashboard (median) | 0,00 – 1 shift: `p.hint` 0,0008 | 0 – inga shifts             |

LCP oförändrat, som väntat: ändringen rör inte bilden. Hoppet syntes knappt i CLS på
mobil eftersom det mesta som flyttades låg under skärmkanten, men på en större skärm
eller långsammare API flyttas hela resten av sidan.

**Känt:** lådans proportioner matchar inte Chart.js exakt, så det blir lite tom yta
under diagrammet. Justeras när Chart.js-ändringen i spår 2 är klar.

### Spår 2 • JavaScript

### 2.1 Lazy routes

Alla vyer importerades statiskt i `src/router/index.js`, så `/login` hämtade en enda
fil på 141,82 kB gzip, inklusive dashboardens diagramkod. Vi bytte till
`() => import(...)` så att varje vy blir en egen fil som bara hämtas när sidan
besöks. Routern hade inte lazy routes sedan tidigare.

|                         | Före      | Efter    |
| ----------------------- | --------- | -------- |
| JS /login (gzip)        | 141,82 kB | 41,42 kB |
| JS dashboarden (gzip)   | 141,82 kB | 140,6 kB |
| Antal JS-filer i bygget | 1         | 8        |

Dashboarden är i stort sett oförändrad eftersom `DashboardView` (100,13 kB gzip)
innehåller Chart.js och lodash; det tas i nästa optimeringar.

### Hur optimeringarna påverkar varandra

LCP på dashboarden gick från 0,94 s (efter 1.1, hero-bilden) till 1,09 s efter lazy
routes (2.1). Bilden ligger i `DashboardView.vue`, som nu är en egen fil: browsern
hittar bilden först när både `index-*.js` och `DashboardView-*.js` har hämtats. Det är
en medveten avvägning – mycket mindre JavaScript på /login, mot något senare LCP på
dashboarden. LCP ligger fortfarande långt under budgeten på 2,5 s.
