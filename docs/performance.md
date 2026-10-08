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
