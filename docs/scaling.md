## Vad vi mätte

Kommando: `npx autocannon -c 50 -d 10 …` mot imagen lokalt, 2026-09-24

| Anrop                                                     | Req/s (avg) | p99    | Kommentar                                                              |
| --------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------- |
| GET /                                                     | 26 912      | 19 ms  |                                                                        |
| GET /assets/index-*.js                                    | 4 656       | 27 ms  |                                                                        |
| GET /api/user                                             | 340         | 183 ms | 0 av 3399 svar var 2xx — kräver troligen auth, ej ett giltigt lasttest |
| Mot staging (-c 10, -t 30): 207 req/s (avg), p99 = 105 ms |

## Vad siffrorna säger

Lokalt hanterar nginx statiska filer extremt snabbt: `/` klarar ~27 000 req/s med p99 på
19 ms, och JS-filen ~4 700 req/s med p99 på 27 ms (den senare är tyngre eftersom filen
är större och faktiskt läses från disk varje gång i detta test, till skillnad från en
riktig browser som skulle cacha den helt tack vare `immutable`-headern).

`/api/user` är INTE ett giltigt test i sin nuvarande form — nästan alla anrop
fick ett felsvar, troligen för att endpointen kräver autentisering som
autocannon inte skickar med. Detta måste testas om med en giltig token innan
vi kan dra slutsatser om API:ets prestanda.

Mot staging (Render) är siffrorna mycket lägre: 207 req/s och p99 på 105 ms,
jämfört med tiotusentals req/s lokalt. Flaskhalsen är alltså INTE nginx eller
våra cache-headers — det är nätverket (Render ligger fysiskt längre bort,
och det är en delad, gratis serverresurs) samt eventuellt en långsammare
container/CPU-tilldelning på Render jämfört med din lokala dator.

Slutsats: cache-headrarna hjälper riktiga användare (färre repeterade anrop
för statiska filer), men den stora skillnaden i upplevd hastighet mellan
lokalt och staging kommer från infrastrukturen, inte från applikationskoden.

## Vad vi gjorde

**Cache-headers** (bevis under M5 i milestones.md). Sparar en hämtning helt för
återkommande användare på hashade filer (JS/CSS) tack vare `immutable` — deras
browser behöver aldrig ens fråga servern efter första besöket. `index.html`,
`config.js` och `version.txt` kontrolleras alltid mot servern (snabbt, via ETag)
så att ingen fastnar med gammal kod efter en deploy. 2. **CDN:** [nu / senare / aldrig] — <fyll i beslut här. Om "senare": vad krävs?
T.ex. registrera domän hos Cloudflare/Fastly, peka DNS dit, ingen kodändring
behövs eftersom cache-headers redan finns på plats.> 3. **Fler instanser:** vid vilken siffra? <Baserat på dagens mätning: staging klarar
~207 req/s med en instans. Om trafiktoppen (från avsnitt 1) överstiger det med
marginal, är det dags att skala horisontellt.> 4. **Det vi inte kan påverka (API:et):** `/api/user` kunde inte lasttestas korrekt
(kräver auth, se `Vad vi mätte`). Vi bör be backend-teamet om deras egna
lasttestsiffror för den endpointen, samt fråga om den har någon egen cache-
eller rate-limit-strategi.

## Varför (inte) Kubernetes

(Tre meningar. Om ni gjorde övning 2 B: vad fick ni, vad kostade det.)
Siffrorna säger att vi behöver bara en container. För att kubernetes kräver mycket arbetet för att det ska funka. Så i detta fall är det inte tillgängligt i en liten produkt.

## När stänger man en flagga i stället för att rulla tillbaka?

|                                                                | Feature flag | Rollback |
| -------------------------------------------------------------- | ------------ | -------- |
| Tar                                                            |              |          |
| Påverkar                                                       |              |          |
| Passar när                                                     |              |          |
| Regeln vi enats om: …                                          |
| (Fyll i tiderna i morgon, när ni gjort rollbacken på riktigt.) |
