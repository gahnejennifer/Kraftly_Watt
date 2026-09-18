# Beslut : Render

**Datum**: 18 september 2026
**Beslut:** Vi använder Render för produktionen.

## Bakgrund

Kraftly_Watt (`kraftly-mina-sidor`) är en Vite + Vue 3-app. Enligt `package.json` beror appen på **Express**, och `.env.example` beskriver arkitekturen så här:

> _"Nyckeln som servern framför appen skickar till API:t"_ — dvs. det finns en serverprocess **framför** den byggda frontend-appen som håller `API_KEY` och pratar med det riktiga API:t. Det är alltså inte en ren statisk SPA.

Det här är den viktigaste tekniska förutsättningen för hela beslutet: **vi behöver något som kan köra en långlivad Node-process (eller vår Docker-image), inte bara servera statiska filer.** Kursen kör Render idag, satt via Environment-variabler i Render-dashboarden (samma variabler som lokalt i `.env`).

## Vad vi såg (våra observationer – inte tutorialens)

|                               | **Render** (nuvarande)                                                                                           | **Azure Container Apps**                                                                                                          | **Google Cloud Run**                                                                                 | **Vercel**                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Kör vår image som den är?** | Ja — bygger direkt från `Dockerfile` eller repo, git-push-to-deploy.                                             | Ja — vanlig OCI-image, ingen omdöpning krävs.                                                                                     | Ja — vanlig OCI-image. Kräver att servern lyssnar på `$PORT`.                                        | **Delvis.** Kräver fil döpt `Dockerfile.vercel` (inte `Dockerfile`) och att servern lyssnar på `$PORT`. [TODO: verifiera port-hantering i vår server.] |
| **Kostnad & kort**            | Gratis (750 instans-tim/mån) men sover efter 15 min. Betalt: $7/mån (alltid igång). Inget kort krävs för gratis. | Ingen fast kostnad, betalar per sekund. Gratiskvot: 180 000 vCPU-sek + 2 milj. requests/mån. Kräver faktureringskonto från start. | Liknande Azure-modell, något billigare per vCPU-sek. Kräver faktureringskonto för att aktivera alls. | Hobby gratis med begränsningar; container-funktioner faktureras på "Active CPU" på Pro. Kräver kort för Pro.                                           |
| **Var hamnar nyckeln?**       | Render → Environment (krypterad env-var).                                                                        | Env-var eller Key Vault + managed identity.                                                                                       | Env-var eller Secret Manager.                                                                        | Environment Variable i Vercel-projektet.                                                                                                               |
| **Kallstart**                 | Gratis: 30–60 sek efter 15 min inaktivitet. Betalt: ingen sömn.                                                  | ~1–3 sek (scale-to-zero är default).                                                                                              | Liknande Azure, ofta <2 sek.                                                                         | Skalas ner efter 5 min (prod) / 30 sek (preview) utan trafik.                                                                                          |
| **Hur leverantörsspecifikt?** | Låg kod-lock-in, men konfigurationen (env-vars, ev. `render.yaml`) är Render-specifik.                           | Låg, ökar om vi börjar använda Key Vault/Dapr.                                                                                    | Låg, ökar med Secret Manager/Pub/Sub etc.                                                            | Högst av de fyra — nytt containerstöd (sommaren 2026), kräver `Dockerfile.vercel` och `$PORT`.                                                         |

## Motivering

**Vad är portabelt?**
Själva appen (Node/Express-container som serverar frontend + proxyar API-anrop med nyckeln server-side) är portabel — samma image kör oförändrad på Render, Azure Container Apps och Google Cloud Run. Det som inte är portabelt är plattformskonfigurationen (dashboard-inställningar, ev. CI/CD mot Render). Vercel kräver extra: omdöpt Dockerfile + garanterad $PORT-hantering.

**Vad skulle ett byte kosta?**
Till Azure/Cloud Run: lågt — mest flytt av env-vars, ingen kodändring. Till Vercel: lite mer — filnamnsbyte + portfix. Till Netlify: högt — de kör inte Docker-images, skulle kräva omskrivning av serverdelen. Inte aktuellt.

## Konsekvenser

Sovande instanser (30–60 sek kallstart) är okej i staging, inte i produktion — appen är levererad till en riktig kund, och en lång vit skärm ser ut som driftstopp. därför är rekommendationen att uppgradera produktionsmiljön till Starter även om staging kan ligga kvar på gratisnivån.

Vid ett ev. plattformsbyte testar vi i staging först, minst [TODO: X dagar], eftersom nyckeln tillfälligt måste finnas på två ställen under övergången — den tiden vill vi hålla kort i en miljö en kund faktiskt använder.
