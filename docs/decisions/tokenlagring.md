# Beslut: var lagrar vi access token?

**Datum:** <2026-10-02>
**Beslut:** Access token hålls i minnet i browsern. Refresh token ligger i en httpOnly-cookie som API:t sätter.

## Bakgrund

Portalen visar en enskild kunds personliga data, så en stulen token ger tillgång till
kundens uppgifter. Den ursprungliga lösningen sparade inloggningen i `localStorage`
(`kraftly_logged_in`), och det var ett av hålen vi bevisade i hackerlabbet (A02). M6
handlade om att byta bort det. Frågan var vart token skulle ta vägen i stället.

## Alternativ vi jämförde

| Alternativ       | För                                                                                                                                                                    | Emot                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `localStorage`   | Enklast, och överlever omladdning och ny flik                                                                                                                          | Vilket skript som helst på sidan kan läsa den (`localStorage.getItem(...)`), så vid en XSS kan en angripare stjäla token rakt av. Det var hålet vi bevisade i labbet |
| JS-läsbar cookie | Följer med anrop automatiskt                                                                                                                                           | Lika stöldbar som localStorage om den inte är httpOnly, och en cookie som skickas på varje anrop öppnar för CSRF (också ett hål vi såg i labbet)                     |
| **Minne (valt)** | Token ligger inte kvar i något beständigt lager som kan läsas i efterhand. Tillsammans med CSP (`script-src 'self'`) är den klart svårare att komma åt än localStorage | Omladdning tömmer minnet, så en ny token måste hämtas                                                                                                                |

## Motivering

Vi prioriterade att token inte ska gå att läsa ur ett beständigt lager, eftersom det är
den vanligaste och allvarligaste läckan (XSS leder till stulen token). Ett injicerat
skript kan fortfarande läsa variabeln medan sidan är öppen, så minne gör det svårare men
inte omöjligt.

Priset är att en omladdning (F5) tömmer minnet. Det löser vi med refresh-token: den ligger
i en httpOnly-cookie som JavaScript inte kan läsa, och `src/router/index.js` hämtar en ny
access token mot `POST /api/v2/auth/refresh` en gång vid appstart, innan routern bestämmer
om användaren ska till `/login`.

## Konsekvenser

- Access token (JWT, 10 min) finns i en `ref` i `src/services/token.js`, läst med
  `getAccessToken()` och satt med `setAccessToken()`. Den skrivs aldrig till
  `localStorage`, `sessionStorage` eller en JS-läsbar cookie.
- Användaren loggas inte ut av en omladdning, eftersom sessionen återställs vid appstart.
- Access token förnyas **bara vid appstart**. Går den ut mitt i en session (efter 10 min)
  får anropen 401 och kastar ett fel i `request` i `api.js`, utan att token förnyas och
  utan att användaren skickas till `/login`. Det är en känd brist (se `known-issues.md`).
  Lösningen är att `request` vid 401 anropar `refresh()` en gång och försöker om, och
  annars skickar användaren till `/login`.
- **Vi omprövar beslutet om:**
  - Vi får en egen server (t.ex. en BFF) som kan sätta en sessionscookie. Då kan access
    token flyttas helt ur JavaScript.
  - Vi inför SSR, eftersom servern då måste kunna läsa inloggningen (se `rendering.md`).
  - Vi måste släppa in tredjepartsskript som luckrar upp CSP, så att skyddet via
    `script-src 'self'` försvagas.
