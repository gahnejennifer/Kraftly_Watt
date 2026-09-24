# Beslut: feature flags

**Datum:** 2026-09-24<br>
**Beslut:** Kraftly slår på och av funktioner per miljö med körtidsflaggor: containern läser miljövariabler (t.ex. `FEATURE_NORWAY`) vid start och skriver dem till `config.js`, som appen läser via `isEnabled()`.

## Bakgrund

CTO:n vill att Norge-expansionen ska vara förberedd i portalen, men affären är inte klar och svenska kunder ska inte se något. I M5 fick portalen en produktionsmiljö bredvid staging, och samma image går till båda. Norge-kravet krävde därför ett sätt att få olika beteende i staging och prod utan olika builds: kortet (`NorwayNotice.vue`) ska synas i staging men inte i prod, och det ska gå att slå på eller av utan att bygga om.

## Alternativ vi jämförde

| Alternativ                             | Hur                                                                  | Bryter det mot "bygg en gång"?                                                                            | Nackdel                                                                      |
| -------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Långlivad branch                       | Norge-koden ligger på en egen branch tills affären är klar           | Ja, staging måste byggas från en annan branch än prod                                                     | Branchen glider isär från main, och merge-konflikterna växer för varje vecka |
| Byggtidsflagga (`VITE_FEATURE_NORWAY`) | Vite bakar in värdet i JS-filerna vid `npm run build`                | Ja, det krävs två images (med och utan kortet), så den som testades i staging är inte den som körs i prod | Att slå av eller på kräver en ny build och en ny deploy                      |
| Körtidsflagga (`config.js` vid start)  | `40-runtime-config.sh` läser `FEATURE_NORWAY` när containern startar | Nej, samma image i alla miljöer, bara miljövariabeln skiljer                                              | En sak till att konfigurera per miljö i Render                               |

## Motivering

Vi valde körtidsflagga eftersom det är det enda alternativet som inte bryter mot "bygg en gång". Imagen som godkänns i staging är exakt den som går till prod, och flaggan ändras med en miljövariabel på ungefär en minut, utan build eller deploy. Bara exakt `true` räknas som på, så en flagga som saknas eller är felstavad är alltid av. Röktestet i `deploy-production` blir dessutom rött om flaggan skulle vara på i prod.

## Konsekvenser

- Flaggor måste hållas koll på per miljö i Render. Därför läses de bara via `isEnabled()` i `src/utils/features.js`, så att det finns ett enda ställe att söka på.
- `config.js` är publik: inga hemligheter får hamna där.
- **När flaggan ska bort:** när Norge-lanseringen är live och flaggan har varit på i prod i en vecka utan problem. Då tas `FEATURE_NORWAY`, `v-if`-villkoret och flaggtesterna bort i en egen PR, och kortet blir en vanlig del av översikten.
- **Vem ser till det:** den som är tech lead när lanseringen sker lägger in en påminnelse (issue) samma dag som flaggan slås på i prod.
