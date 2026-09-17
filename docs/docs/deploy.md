# Deploy – Kraftly Mina sidor

## Flödet

(Mermaid-diagram: PR → CI → merge → publish → deploy-staging → Render → verifiering)

## Miljöer

| Miljö | URL | Image | API | Uppdateras |

## Konfiguration – var bor vad?

| Variabel | Hemlig? | Lokalt | Staging | Används av |
(API_KEY, API_URL, PORT, RENDER_DEPLOY_HOOK, STAGING_URL, GITHUB_TOKEN)

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

Två sätt, steg för steg. Hur ni kontrollerar att det lyckades.

## Tider (uppmätta)

| Steg | Tid |
(merge → publish klar · hook → rätt sha svarar · totalt · kallstart)

## Kända begränsningar

(kallstart, vem som äger Render-kontot, arm64 vs amd64, ingen prod ännu)
