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
