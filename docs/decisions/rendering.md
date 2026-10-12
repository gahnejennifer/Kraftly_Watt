# Beslut: SPA, SSR eller SSG för Mina sidor?

**Datum:** 12 oktober 2026
**Beslut:** Vi behåller SPA (Vue + Vite, statiska filer från nginx-containern).

## Bakgrund

Kraftlys portal är "Mina sidor": allt utom `/login` kräver inloggning och visar en
enskild kunds data (förbrukning, fakturor, flytt, profil). Appen byggs i dag till
statiska filer som nginx serverar, och nginx proxar `/api` med API-nyckeln. Access
token ligger i minnet i browsern och refresh token i en httpOnly-cookie (se
`tokenlagring.md`). Efter M7 laddar dashboarden på LCP 1,07 s med CLS 0 (iPhone 12 Pro,
Fast 4G), och /login hämtar 43 kB JavaScript (se `performance.md`).

## Alternativ vi jämförde

|                                  | SPA (i dag)                         | SSR (Nuxt)                                                           | SSG (statiskt förrenderat)                 |
| -------------------------------- | ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| Var renderas HTML?               | I browsern, efter att JS laddats    | På servern vid varje anrop                                           | Vid bygget, en gång                        |
| Första synliga innehåll          | Efter JS + API-svar                 | Direkt i HTML:en                                                     | Direkt i HTML:en                           |
| Passar inloggad, personlig data? | Ja                                  | Ja, men servern måste kunna läsa inloggningen                        | Nej – kunddata går inte att bygga i förväg |
| Sökmotorer och delningslänkar    | Ser en tom sida                     | Ser innehållet                                                       | Ser innehållet                             |
| Drift                            | Statiska filer + nginx (det vi har) | En Node-server som alltid måste vara uppe                            | Statiska filer (som SPA)                   |
| Påverkan på vår auth             | Ingen                               | Token i minnet når inte servern – kräver cookie-baserad auth vid SSR | Ingen, men hjälper bara publika sidor      |
| Kostnad att byta                 | –                                   | Hög: ny ramverkskod, ny server, ny auth-modell                       | Låg för enstaka publika sidor              |

## Motivering

Vi svarade på tre frågor:

- **Ska sidan hittas eller delas?** Nej. Mina sidor är personliga och ska inte indexeras
  eller delas. SEO, SSR:s och SSG:s största fördel, ger oss ingenting.
- **Syns den innan man loggat in?** Bara `/login`, som är liten: 43 kB JS och LCP 1,38 s
  i Lighthouse. Resten är tom utan inloggning, så det finns inget att förrendera.
- **Är vi beredda att drifta en server?** Inte för det här. SSR kräver en Node-process
  som alltid är uppe, och på Render Free sover den efter 15 minuter. Kallstarten
  (30–60 s) skulle då drabba varje sidladdning, inte bara API-anropen. Vi skulle också
  behöva bygga om auth så att servern kan läsa inloggningen.

Prestandan är redan inom budget som SPA. Det långsamma i dag är API:t
(`/api/v2/consumption` väntar ca 600 ms), och det löser varken SSR eller SSG – SSR skulle
tvärtom låta servern vänta på samma API innan den skickar någon HTML alls.

## Konsekvenser

- Vi behåller nuvarande bygge, nginx-container och auth-modell.
- Första besöket kräver att JavaScript laddas innan något syns. Därför vaktar vi
  JS-mängden med budgeten i CI (45 kB på /login).
- **Vi omprövar beslutet om:**
  - Kraftly vill ha **publika sidor som ska hittas eller delas** (t.ex. Norge-lanseringen,
    prislistor, kundservice). Då är SSG för just de sidorna förstahandsvalet.
  - Dashboardens **LCP går över 2,5 s** för riktiga användare trots optimeringar, och
    det beror på renderingen och inte på API:t.
  - Vi ändå **driftar en Node-server** av andra skäl (t.ex. en BFF), så att SSR inte
    längre kräver ny infrastruktur.
