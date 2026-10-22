# AI i utvecklingsflödet

## Vad vi kopplade in

Varje pull request mot `main` granskas av en språkmodell (claude-opus-5-5). Workflowen `.github/workflows/ai-review.yml` tar diffen under `src/`, skickar den till modellen med systemprompten i `scripts/ai-review.mjs` och postar svaret som en kommentar med rubriken "🤖 AI-granskning (förslag, inte beslut)". Den körs vid varje ny PR och varje ny push, bara från grenar i vårt eget repo, och hoppar över diffar över 1 500 rader.

Nyckeln ligger som secret `ANTHROPIC_API_KEY` under Settings → Secrets and variables → Actions, aldrig i koden.

Jobbet är inte en required check, och skriptet avslutar alltid med 0. En falsk positiv ska aldrig kunna blockera en korrekt PR. Om granskningen stoppade merge skulle teamet snart sluta läsa kommentarerna.

Workflowen kom in med PR #104 (inga ändringar under `src/`, så kommentaren blev "inga ändringar under src/" efter 9 s). Första riktiga PR:en: #107 – tid från push till kommentar: 25 s.

Kostnad per granskning: PR #107 gav 827 tokens in och 154 ut ≈ $0,0064 ≈ 6 öre (pris $4 respektive $20 per miljon tokens, ca 10 kr/dollar). En större diff kostar mer, upp till ungefär en krona.

## Utvärdering

claude-opus-5-5, 22–27/10.

| PR   | Punkten i några ord                                                                                     | Träff / miss / oavgjord | Varför                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| #107 | "Inget att anmärka på." (ändrade button komponent och la till så att komponenenten kunde ha aria-label) | – (inga punkter)        | Korrekt. Ändringen var liten och ofarlig, och modellen hittade inte på några problem. |

Totalt: 0 punkter på 1 PR – 0 träffar, 0 missar, 0 oavgjorda. (fylls på t.o.m. 27/10)

## Två exempel

(skrivs när tabellen har minst tre PR:ar)

## Vår regel

(skrivs tisdag, efter utvärderingen)
