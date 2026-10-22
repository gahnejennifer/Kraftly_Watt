# Hållbarhet och etik

## Siffrorna

Uppmätt med `scripts/co2.mjs` (co2.js 0.19.0, Sustainable Web Design-modellen v4), 22/10 2026.

|                     | kB per besök | g CO2e per besök (SE) | kg CO2e per månad (SE) | kg CO2e per månad (globalt) |
| ------------------- | ------------ | --------------------- | ---------------------- | --------------------------- |
| Före M7 (taggen M6) | 491          | 0,029                 | 3,7                    | 9,1                         |
| Efter M7 (main)     | 265          | 0,016                 | 2,0                    | 4,9                         |

**Efter M7** (main, `npm run build && npm run co2`):

```
co2.js – Sustainable Web Design v4 · dist/ (index.html + assets/, okomprimerat)

| kB per besök | g CO2e per besök (SE) | kg CO2e per månad (SE) | kg CO2e per månad (globalt) |
|---:|---:|---:|---:|
| 265 | 0,016 | 2,0 | 4,9 |

Elmix (co2.js): Sverige 35,89 g CO2e/kWh (SWE) · globalt 472,94 g CO2e/kWh (WORLD)
Energi: 10,2 kWh per månad (34,0 GB × 0,30 kWh/GB)
Antaganden: 40 000 kunder × 3,2 sessioner = 128 000 besök/månad · andel förstabesök 100 %
Obs: tillverkningen av enheter, nät och datacenter räknas alltid med SWD v4:s globala 494 g CO2e/kWh – bara driften får landets mix.
```

**Före M7** (taggen M6, byggd i en worktree, `npm run co2 -- ../kraftly-m6/dist`):

```
co2.js – Sustainable Web Design v4 · ../kraftly-m6/dist/ (index.html + assets/, okomprimerat)

| kB per besök | g CO2e per besök (SE) | kg CO2e per månad (SE) | kg CO2e per månad (globalt) |
|---:|---:|---:|---:|
| 491 | 0,029 | 3,7 | 9,1 |

Elmix (co2.js): Sverige 35,89 g CO2e/kWh (SWE) · globalt 472,94 g CO2e/kWh (WORLD)
Energi: 18,9 kWh per månad (62,9 GB × 0,30 kWh/GB)
Antaganden: 40 000 kunder × 3,2 sessioner = 128 000 besök/månad · andel förstabesök 100 %
Obs: tillverkningen av enheter, nät och datacenter räknas alltid med SWD v4:s globala 494 g CO2e/kWh – bara driften får landets mix.
```

M7 minskade portalen med 46 % (491 → 265 kB per besök), och utsläppen per månad sjönk i samma takt.

## Metoden och vad vi inte räknar

Vi summerade `index.html` och allt under `assets/` i `dist/` (okomprimerat) och räknade varje besök som ett första besök. Båda gör siffran högre än verkligheten, eftersom servern skickar filerna komprimerade och återbesök hämtar dem ur cachen (cache-headers sedan M5). Trafiken antas vara 40 000 kunder × 3,2 sessioner i månaden (ungefär ett besök när fakturan kommer och ett par kontroller av förbrukningen), och driften räknas med svensk elmix (35,89 g CO2e/kWh). Modellen räknar ändå tillverkningen av servrar, nät och enheter med global elmix. API-anropen, test-API:ts server och själva hostingen hos Render ingår inte, och _Efter M7_ är mätt på dagens main, som även innehåller M8:s ändringar.

## Etikfall: Chatta med Kraftly

**Situationen.** Affärsutveckling vill lägga en chattruta, "Chatta med Kraftly", på översikten för att minska samtalen till kundtjänst veckan efter fakturan. För att kunna svara skickas kundens timförbrukning och fakturor med i varje fråga till en extern AI-leverantör, inte till Kraftlys egna servrar. Leverantören är vald men avtalet är inte klart, och vi vet inte i vilket land datan behandlas. Produktägaren frågar om vi kan bygga en första version i nästa sprint.

**Vårt beslut.** Ja med villkor. Vi bygger inte förrän villkoren nedan är uppfyllda, och inte med timdata.

**Varför.** Att förklara en faktura ligger nära ändamålet datan samlades in för (att fakturera enligt avtalet med kunden), men att skicka den till en extern leverantör är ett nytt sätt att behandla den, och det ska kunden få välja. Dataminimering: för att förstå en faktura räcker dygnssummor. Timdata är fortfarande personuppgifter, inte känsliga i GDPR:s mening, men de visar när någon sover, är hemma eller är bortrest, vilket kan utnyttjas till exempel vid inbrott. Kunden som skriver i rutan tror att hon pratar med Kraftly och att hennes data stannar hos Kraftly, inte att den skickas till ett annat företag, kanske i ett annat land.

**Vad vi gör i stället / villkor.**

- **Data:** bara dygnssummor för de två senaste fakturaperioderna och fakturornas belopp, aldrig timdata, namn eller adress.
- **Leverantören:** ett signerat personuppgiftsbiträdesavtal som produktägaren har läst innan vi bygger. Datan behandlas inom EU/EES. Leverantören får inte spara frågor eller data efter att svaret skickats, och får inte träna modeller på dem.
- **Loggning:** Kraftly sparar frågor och svar i högst 30 dagar, för felsökning och klagomål. Bara kundtjänst kommer åt dem. Kunden kan begära ut en kopia av sin chatt.
- **Samtycke:** chattrutan frågar innan något skickas, med en tydlig förklaring av vilken data som skickas och vart. Rutan är inte förifylld. Säger kunden nej visas kundtjänsts nummer i stället, så att hon ändå kan få hjälp. Samtycket går att ta tillbaka.
- **Fel svar:** Kraftly ansvarar för svaren, inte leverantören. Rutan visar tydligt att det är en AI som svarar och att den kan ha fel, och varje svar visar siffrorna det bygger på, så att kunden kan kontrollera mot fakturan. Kundtjänsts nummer finns alltid synligt.
- **Vem bestämmer:** produktägaren beslutar om lansering först när avtalet är signerat och villkoren ovan är kontrollerade av teamet.
