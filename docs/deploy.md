# Deploy – Kraftly Mina sidor

## Flödet

(Mermaid-diagram: PR → CI → merge → publish → deploy-staging → Render → verifiering)

## Miljöer

| Miljö                             | URL                                    | Image                                                                               | API                                                                                       | Uppdateras                                     |
| --------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Staging (`APP_ENV=staging`)       | https://kraftly-watt-main.onrender.com | `ghcr.io/gahnejennifer/kraftly_watt:<sha>`, byggs en gång i CI och pushas till GHCR | Test-API:t, inte skarpt API. Nyckeln sätts i Render, inte i imagen. `FEATURE_NORWAY=true` | Automatiskt vid merge till main                |
| Produktion (`APP_ENV=production`) | https://kraftly-watt.onrender.com      | Samma image och sha som staging just verifierat, ingen ny build                     | Test-API:t (i verkligheten en egen prod-nyckel). Ingen `FEATURE_NORWAY`                   | Efter godkännande i GitHub-miljön `production` |

Render-tjänsterna ligger på Jennifers konto (Hobby-planen tillåter inte fler medlemmar). Pipelinen når dem via deploy-hooks i GitHub-miljöerna.

## Konfiguration – var bor vad?

(API_KEY, API_URL, PORT, RENDER_DEPLOY_HOOK, STAGING_URL, GITHUB_TOKEN)

| Variabel | Hemlig?                                              | Lokalt                                                                    | Staging                                                                | Används av                                                                             |
| -------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
|          | PORT: "läses från process.env.PORT, sätts av Render" | RENDER_DEPLOY_HOOK: "GitHub Actions secret, triggar deploy efter publish" | STAGING_URL: "hårdkodad i workflow-filen .github/workflows/deploy.yml" | GITHUB_TOKEN: "autogenererad av GitHub Actions, används för att pusha image till GHCR" |

## API-nyckeln

**Vad hände med den gamla, varför den är död (curl-utskriften med 401), var den nya ligger. Skrev ni om historiken? Varför / varför inte?**

Den gamla nyckeln (`kraftly_live_sk_9f3a71bd42e88c015d6f`) låg hårdkodad i
`src/services/api.js` sedan vi ärvde koden. Den är nu ersatt av en nyckel som sätts via miljövariabeln `API_KEY`, som aldrig committas.

**Verifiering mot test-API:t (curl):**
PS /Users/jennifergahne/Documents/GitHub/Kraftly_Watt> $API="https://kraftly-api-staging.onrender.com"
PS /Users/jennifergahne/Documents/GitHub/Kraftly_Watt> curl -s -w " %{http_code}`n" $API/api/user
{"error":"Saknad eller ogiltig API-nyckel"} 401
PS /Users/jennifergahne/Documents/GitHub/Kraftly_Watt> curl -s -w " %{http_code}`n" -H "X-Api-Key: e84fff011f1b35d4e34432f72f15f2f4" $API/api/user
{"id":1,"name":"Anna Andersson","email":"anna.andersson@example.com","address":"Solvägen 12, 802 67 Gävle","contract":"Rörligt pris","customerNo":"K-104233"} 200
PS /Users/jennifergahne/Documents/GitHub/Kraftly_Watt> curl -s -w " %{http_code}`n" -H "X-Api-Key: kraftly_live_sk_9f3a71bd42e88c015d6f" $API/api/user  
{"error":"Saknad eller ogiltig API-nyckel"} 401

## Rollback

**Renderkonto**
Kontot ägs av techlead som roterar var tredje vecka.
I dagsläget ägs det av Jennifer eftersom techlead för denna vecka inte var på plats när vi satte upp kontot.

**Två sätt, steg för steg**

1. **Via Render-dashboarden (snabbast):** gå till tjänsten → Events/Deploys → hitta senaste fungerande deploy → klicka Rollback to this deploy. Render pekar om trafiken till den gamla imagen/committen direkt, utan ny build.
2. **Via git (mer spårbart):** git revert av den trasiga committen (eller git reset + force-push om ni tillåter det) → pusha till main → låt CI/CD-flödet bygga och deploya om som vanligt.

**Hur ni kontrollerar att det lyckades.**
Vi kollar att /healthz svarar 200 och att kolla att version/commit-SHA i sidfoten matchar den gamla committen.

## Tider (uppmätta)

(merge → publish klar · hook → rätt sha svarar · totalt · kallstart)

| Steg                                                                 | Tid       |
| -------------------------------------------------------------------- | --------- |
| Merge → publish klar:                                                | 1m 45s    |
| Hook → rätt SHA svarar:                                              | 31s       |
| Totalt: summan, t.ex.                                                | 2 min 16s |
| Kallstart: gör ett anrop efter 15+ min inaktivitet, ta tid till svar | 38 sek    |

## Kända begränsningar

(kallstart, vem som äger Render-kontot, arm64 vs amd64, ingen prod ännu)

Kallstart: 38 sek efter 15 min inaktivitet på gratisnivån — accepterat i staging
Vem äger kontot: Jennifer, admin på Render-teamet
arm64 vs amd64: vi bygger på Apple Silicon lokalt men Render kör amd64, så vi kör docker buildx build --platform linux/amd64 i CI
