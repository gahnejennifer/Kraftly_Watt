# AI i utvecklingsflödet

## Vad vi kopplade in

Varje pull request mot `main` granskas av en språkmodell (claude-opus-5-5). Workflowen `.github/workflows/ai-review.yml` tar diffen under `src/`, skickar den till modellen med systemprompten i `scripts/ai-review.mjs` och postar svaret som en kommentar med rubriken "🤖 AI-granskning (förslag, inte beslut)". Den körs vid varje ny PR och varje ny push, bara från grenar i vårt eget repo, och hoppar över diffar över 1 500 rader.

Nyckeln ligger som secret `ANTHROPIC_API_KEY` under Settings → Secrets and variables → Actions, aldrig i koden.

Jobbet är inte en required check, och skriptet avslutar alltid med 0. En falsk positiv ska aldrig kunna blockera en korrekt PR. Om granskningen stoppade merge skulle teamet snart sluta läsa kommentarerna.

Workflowen kom in med PR #104 (inga ändringar under `src/`, så kommentaren blev "inga ändringar under src/" efter 9 s). Första riktiga PR:en: #107 – tid från push till kommentar: 25 s.

Kostnad per granskning: PR #107 gav 827 tokens in och 154 ut ≈ $0,0064 ≈ 6 öre (pris $4 respektive $20 per miljon tokens, ca 10 kr/dollar). En större diff kostar mer, upp till ungefär en krona.

## Utvärdering

| PR               | Punkten i några ord                                                                                                                                                                                            | Träff / miss / oavgjord | Varför                                                                                                                                                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #107             | "Inget att anmärka på." (ändrade button komponent och la till så att komponenenten kunde ha aria-label)                                                                                                        | – (inga punkter)        | Korrekt. Ändringen var liten och ofarlig, och modellen hittade inte på några problem.                                                                                                                                                                      |
| #112 (körning 1) | Kördes inte: API-nyckeln godtogs inte (401)                                                                                                                                                                    | – (inga punkter)        | Nyckeln hade bytts. Granskningen kördes om när secreten var uppdaterad.                                                                                                                                                                                    |
| #112 (körning 2) | "Inget att anmärka på."                                                                                                                                                                                        | Miss                    | Samma diff gav två riktiga punkter i körning 4. Modellen missade bland annat att felmeddelandet inte läses upp.                                                                                                                                            |
| #112 (körning 3) | "Inget att anmärka på."                                                                                                                                                                                        | Miss                    | Samma som körning 2.                                                                                                                                                                                                                                       |
| #112 (körning 4) | Felmeddelandet i KField saknar `role="alert"`/`aria-live` och läses inte upp när det dyker upp efter submit · `:aria-describedby` efter `v-bind="$attrs"` skriver över en beskrivning som föräldern skickar in | Träff                   | Båda stämmer. Felmeddelandet: `aria-describedby` läses bara vid fokus, och det blir aktuellt när flyttanmälan visar fel via KField. `aria-describedby`: tekniskt rätt (sista attributet vinner i Vue), men ingen vy skickar in den idag, så låg prioritet. |
| #113             | "Inget att anmärka på."                                                                                                                                                                                        | – (inga punkter)        |                                                                                                                                                                                                                                                            |
| #114 (körning 1) | Kördes inte: API-nyckeln godtogs inte (401)                                                                                                                                                                    | – (inga punkter)        | Nyckeln hade bytts. Granskningen kördes om när secreten var uppdaterad.                                                                                                                                                                                    |
| #114 (körning 2) | "Ångra" ligger i `<form>` utan `type` och blir en submit-knapp som kör både `reset` och `save`                                                                                                                 | Miss                    | KButton har redan `type="button"` som standard (och det testas i `KButton.a11y.test.js`). AI:n ser bara diffen, inte `KButton.vue`, och gissade fel.                                                                                                       |
| #115 (körning 1) | Avtalsfelet inte kopplat till `<select>` · valideringsfelen meddelas inte · `submitMove` saknar try/catch                                                                                                      | Träff                   | Alla tre stämmer.                                                                                                                                                                                                                                          |
| #115 (körning 2) | Samma tre punkter, plus att testet inte täcker avtalsfelet                                                                                                                                                     | Träff                   | Stämmer, men påståendet att `res.ok` aldrig kontrolleras är fel: `request()` i `api.js` kastar redan vid `!res.ok`.                                                                                                                                        |
| #115 (körning 3) | Samma tre punkter, plus att knappen inte spärras och anmälan kan skickas flera gånger                                                                                                                          | Träff                   | Stämmer, men samma fel om `res.ok` som körning 2. Dubbelklick-punkten fanns bara här.                                                                                                                                                                      |
| #116             | `afterEach` kollar inte `failure`, så fokus flyttas till rubriken även när navigeringen avbryts                                                                                                                | Träff                   | Stämmer: Vue Router kör `afterEach` även vid avbrutna navigeringar, och `to.path === from.path` fångar inte det fallet. Händer sällan (t.ex. snabba klick i menyn), så låg prioritet. Lagas med `if (failure) return`.                                     |

Totalt: 6 PR:ar (#107, #112, #113, #114, #115, #116), 12 körningar - 5 träffar, 3 missar, 0 oavgjorda räknat per körning. Unika fynd: 3 träffar, 2 missar, 0 oavgjorda.

#112 sa två av tre lyckade körningar "Inget att anmärka på", men kom sedan med en träff.
#115 däremot gav samma huvudfynd alla tre gånger.

## Två exempel

(skrivs när tabellen har minst tre PR:ar)

## Vår regel

(skrivs tisdag, efter utvärderingen)

## Två exempel

### Träff – #112, körning 4

> **src/components/KField.vue: ett felmeddelande som dyker upp i efterhand läses inte upp.** `<p class="k-field__error">` saknar `role="alert"` eller `aria-live`. Den som använder skärmläsare får alltså inte veta att valideringen slog till, till exempel efter att formuläret skickats, förrän fokus flyttas tillbaka till fältet.

Det stämmer. `aria-describedby` läses bara upp när fältet får fokus, så ett fel som dyker upp efter ett klick på knappen är tyst för en skärmläsare. Varken vi eller axe-testerna såg det: axe kontrollerar att felet är kopplat till fältet, inte att det meddelas när det dyker upp. Två dagar senare blev det aktuellt på riktigt, när flyttanmälan började visa felen via KField i stället för med `alert()` (#115). Samma brist hittades då igen i alla tre körningarna.

### Miss – #114

> **src/views/ProfileView.vue:** Knappen "Ångra" ligger nu inuti `<form>` men saknar `type`. Om `KButton` inte sätter `type="button"` som standard blir den en submit-knapp, och ett klick kör då både `reset` och `save`.

Det stämmer inte. `KButton` har `type: { type: String, default: 'button' }`, och `KButton.a11y.test.js` testar att knappen är `type="button"`. AI:n ser bara diffen, och `KButton.vue` ändrades inte i #114, så den kunde inte se standardvärdet och gissade. Hade vi lagt till `type="button"` på knappen hade det inte lagat någonting.

## Vår regel

1. AI-granskningen är ett förslag, aldrig ett beslut. Den är inte en required check, och en människa granskar alltid PR:en.
2. Varje punkt kontrolleras mot koden innan vi ändrar något. Särskilt när AI:n skriver "om …" om en fil som inte finns i diffen. Den ser bara diffen och gissar om resten (#114).
3. "Inget att anmärka på" betyder inte att koden är felfri. Samma diff gav "Inget att anmärka på" två gånger och sedan ett riktiga fynd (#112).
4. Håller vi inte med svarar vi i kommentaren med varför, så att missarna syns för nästa granskare.
5. 401 eller ingen kommentar: be om en ny nyckel, repoägaren byter secreten, och sedan körs Re-run all jobs. Alternativt körs granskningen lokalt och svaret klistras in som kommentar.
6. Nyckeln skrivs aldrig ut av skriptet och läggs aldrig i en kommentar, eftersom en publik nyckel spärras automatiskt.
7. För stor diff (över 1 500 rader) så bör man dela upp PR:en. Granskaren hoppar över den, och det gör en människa också.
8. Byter vi modell eller ändrar prompten så gör vi om utvärderingen på de nästa tre PR:arna, eftersom det är en ny granskare.
