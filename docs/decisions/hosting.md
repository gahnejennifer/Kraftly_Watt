# Beslut: hosting på Render

**Datum:** 18 september 2026
**Beslut:** Vi kör staging och produktion som var sin container på Render, från samma image i GHCR.

## Bakgrund

Kraftly_Watt (`kraftly-mina-sidor`) är en Vite + Vue 3-app som byggs till statiska filer. Filerna serveras av nginx i en Docker-container, och samma nginx är proxy för `/api` – det är den som lägger på `API_KEY` innan anropet går vidare till Kraftlys API. `.env.example` beskriver det så här:

> _"Nyckeln som servern framför appen skickar till API:t"_ — servern framför appen är nginx-containern.

Det här är den viktigaste tekniska förutsättningen för hela beslutet: **nyckeln får aldrig nå webbläsaren, så vi behöver något som kan köra vår Docker-image med en proxy – inte bara servera statiska filer.** Kursen kör Render, och variablerna sätts i Render → Environment (samma variabler som lokalt i `.env`).

## Alternativ vi jämförde

Våra egna observationer – inte tutorialens.

|                               | **Render** (nuvarande)                                                                                           | **Azure Container Apps**                                                                                                          | **Google Cloud Run**                                                                                 | **Vercel**                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kör vår image som den är?** | Ja — kör vår image från GHCR. Pipelinen triggar en deploy-hook med imagens sha.                                  | Ja — vanlig OCI-image, ingen omdöpning krävs.                                                                                     | Ja — vanlig OCI-image. Kräver att servern lyssnar på `$PORT`.                                        | **Delvis.** Kräver fil döpt `Dockerfile.vercel` (inte `Dockerfile`) och att servern lyssnar på `$PORT` – det gör vår nginx (`listen ${PORT}` i `nginx.conf.template`). |
| **Kostnad & kort**            | Gratis (750 instans-tim/mån) men sover efter 15 min. Betalt: $7/mån (alltid igång). Inget kort krävs för gratis. | Ingen fast kostnad, betalar per sekund. Gratiskvot: 180 000 vCPU-sek + 2 milj. requests/mån. Kräver faktureringskonto från start. | Liknande Azure-modell, något billigare per vCPU-sek. Kräver faktureringskonto för att aktivera alls. | Hobby gratis med begränsningar; container-funktioner faktureras på "Active CPU" på Pro. Kräver kort för Pro.                                                           |
| **Var hamnar nyckeln?**       | Render → Environment (krypterad env-var).                                                                        | Env-var eller Key Vault + managed identity.                                                                                       | Env-var eller Secret Manager.                                                                        | Environment Variable i Vercel-projektet.                                                                                                                               |
| **Kallstart**                 | Gratis: 30–60 sek efter 15 min inaktivitet. Betalt: ingen sömn.                                                  | ~1–3 sek (scale-to-zero är default).                                                                                              | Liknande Azure, ofta <2 sek.                                                                         | Skalas ner efter 5 min (prod) / 30 sek (preview) utan trafik.                                                                                                          |
| **Hur leverantörsspecifikt?** | Låg kod-lock-in, men konfigurationen (env-vars, ev. `render.yaml`) är Render-specifik.                           | Låg, ökar om vi börjar använda Key Vault/Dapr.                                                                                    | Låg, ökar med Secret Manager/Pub/Sub etc.                                                            | Högst av de fyra — nytt containerstöd (sommaren 2026), kräver `Dockerfile.vercel` och `$PORT`.                                                                         |

## Motivering

**Vad är portabelt?**
Själva appen (nginx-containern som serverar frontend och proxyar API-anrop med nyckeln på servern) är portabel — samma image kör oförändrad på Render, Azure Container Apps och Google Cloud Run. Det som inte är portabelt är plattformskonfigurationen (dashboard-inställningar, ev. CI/CD mot Render). Vercel kräver extra: en omdöpt Dockerfile.

**Vad skulle ett byte kosta?**
Till Azure/Cloud Run: lågt — mest flytt av env-vars, ingen kodändring. Till Vercel: lite mer — filnamnsbyte. Till Netlify: högt — de kör inte Docker-images, så proxyn med nyckeln skulle behöva byggas om på deras plattform. Inte aktuellt.

## Konsekvenser

- Sovande instanser (30–60 sek kallstart) är okej i staging men egentligen inte i produktion – en lång vit skärm ser ut som driftstopp för en riktig kund. Rekommendationen är att uppgradera produktionen till Starter ($7/mån). Det har vi **inte** gjort i kursen, eftersom det kostar pengar, så produktionen ligger på gratisnivån och väcks före demon. Står som känd brist i [`docs/known-issues.md`](../known-issues.md).
- Båda tjänsterna ligger på ett konto (Jennifers), eftersom Hobby-planen bara tillåter en medlem. Pipelinen når dem via deploy-hooks, så ingen annan behöver logga in för en vanlig deploy.
- Vid ett plattformsbyte testar vi i staging först, eftersom nyckeln tillfälligt måste finnas på två ställen under övergången – den tiden vill vi hålla kort i en miljö en kund faktiskt använder.
- **Vi omprövar beslutet om:** Render tar bort eller kraftigt försämrar gratisnivån, Kraftly kräver att produktionen aldrig får sova (då Starter, eller Cloud Run/Azure som har kortare kallstart), eller fler i teamet behöver komma åt tjänsterna direkt.
