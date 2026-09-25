# Skalning – Kraftly Mina sidor

## Vad vi vet om trafiken

Kraftly har ca 40 000 kunder per månad. Topparna är fakturadagen, elprisnyheter och Norge-lanseringen i vår.

Vår gissning för värsta fall, fakturadagen:

- 25 % av kunderna loggar in samma dag → 10 000 besök
- 20 % av dem under den värsta timmen → 2 000 besök/timme
- ca 20 anrop per besök → 40 000 anrop/timme ≈ **11 req/s**
- En elprisnyhet samma dag, gissat 5× → **ca 55 req/s**

## Vad vi mätte

Kommando: `npx autocannon -c 50 -d 10 …` mot imagen lokalt (nginx-containern + mock-API:t via `npm run api`)

| Anrop                   | Req/s (avg) | p99    | Kommentar                                                   |
| ----------------------- | ----------- | ------ | ----------------------------------------------------------- |
| GET /                   | 26 912      | 19 ms  |                                                             |
| GET /assets/index-\*.js | 4 656       | 27 ms  |                                                             |
| GET /api/user           | 346         | 109 ms | Node/Express (mock-API:t) bakom nginx-proxyn. Alla svar 2xx |

Mot staging (-c 10, -t 30): 207 req/s (avg), p99 = 105 ms

## Vad siffrorna säger

Lokalt hanterar nginx statiska filer extremt snabbt: `/` klarar ~27 000 req/s med p99 på
19 ms, och JS-filen ~4 700 req/s med p99 på 27 ms (den senare är tyngre eftersom filen
är större och faktiskt läses från disk varje gång i detta test, till skillnad från en
riktig browser som skulle cacha den helt tack vare `immutable`-headern).

**API:t är flaskhalsen.** Så fort ett anrop går vidare från nginx till Node sjunker det från ca 27 000 till 346 req/s, ungefär 80 gånger färre, och p99 går från 19 ms till 109 ms. API:t ägs av backend-teamet och är den del vi minst kan påverka.

**Frontenden har marginal.** Staging (en instans, Render Free) klarade 207 req/s. Vår värsta gissning är ca 55 req/s, alltså ungefär 4× marginal.

Mot staging (Render) är siffrorna mycket lägre: 207 req/s och p99 på 105 ms,
jämfört med tiotusentals req/s lokalt. Flaskhalsen är alltså INTE nginx eller
våra cache-headers — det är nätverket (Render ligger fysiskt längre bort,
och det är en delad, gratis serverresurs) samt eventuellt en långsammare
container/CPU-tilldelning på Render jämfört med din lokala dator.

Slutsats: cache-headrarna hjälper riktiga användare (färre repeterade anrop
för statiska filer), men den stora skillnaden i upplevd hastighet mellan
lokalt och staging kommer från infrastrukturen, inte från applikationskoden.

## Vad vi gjorde

1. **Cache-headers** (bevis under M5 i milestones.md). Sparar en hämtning helt för
   återkommande användare på hashade filer (JS/CSS) tack vare `immutable` — deras
   browser behöver aldrig ens fråga servern efter första besöket. `index.html`,
   `config.js` och `version.txt` kontrolleras alltid mot servern (snabbt, via ETag)
   så att ingen fastnar med gammal kod efter en deploy.
2. **CDN: senare.** Behövs inte med 4× marginal. Om trafiken växer, till exempel med Norge, kan ett CDN läggas framför utan kodändringar, eftersom cache-headers redan talar om vad som får cachas och hur länge.
3. **Fler instanser: vid ca 150 req/s** (ca 70 % av de 207 vi mätte mot staging), eller när p99 mot prod går över 500 ms. Det mäter vi med samma autocannon-kommando mot prod.
4. **Det vi inte kan påverka (API:t):** API:t är ungefär 80 gånger långsammare än nginx. Vi ber backend-teamet ta bort den inbyggda fördröjningen på 600 ms i `/api/consumption` och sluta logga varje anrop, och frågar om deras egna lasttestsiffror.

## Varför (inte) Kubernetes

Inte nu. En container på Render Free klarade 207 req/s mot en värsta gissning på ca 55 req/s, och Render ger oss redan omstart vid krasch, deploy via hook och rollback via workflow. Kubernetes hade kostat ett kluster, manifest och mycket att lära sig, för att lösa ett skalningsproblem vi inte har.

## När stänger man en flagga i stället för att rulla tillbaka?

|            | Feature flag                                                                                                                                              | Rollback                                                                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tar        | 16s                                                                                                                                                       | 25s i prod tillkommer väntande på godkännande från någon i teamet.                                                                                                                                                                          |
| Påverkar   | Bara funktionen kopplat till flaggan i den miljön påverkas                                                                                                | Hela appen påverkas, eftersom vi går tillbaka en version och allt som ändrats efter den sha:n försvinner                                                                                                                                    |
| Passar när | Felet sitter i något som ligger i en avgränsad feature som ska lanseras, alltså bakom en flagga (t.ex. Norge-kortet), något som är lätt att slå av och på | Felet sitter i något utan flagga, något som är bredare och påverkar hela appen (t.ex. trasig nginx-config, en bugg i fakturavyn), där det inte är lika lätt att bara slå av något utan man behöver gå tillbaka en version och utreda felet. |

**Regeln vi enats om:**
Ligger felet bakom en flagga så stänger vi den flaggan eftersom det är ett avgräsat fel och har mindre påverkan på helheten och att inget annat behöver backas. Annars kör vi en rollback till senaste fungerande sha och fixar felet i lugn och ro. Ingen panikfix på fredageftermiddag.
