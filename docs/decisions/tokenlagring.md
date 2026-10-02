# Beslut: var lagrar vi access token?

## Vad vi valde

Access token (JWT, 10 min) hålls **i minnet** – i en Vue `ref` i `src/services/token.js`,
läst via `getAccessToken()` och satt via `setAccessToken()`. Den skrivs aldrig till
`localStorage`, `sessionStorage` eller en JS-läsbar cookie. Refresh token hanteras inte av
oss i klienten: den sätts av API:t i en **httpOnly-cookie** (`/api/v2/auth/login`), som
JavaScript inte kan läsa, och följer med automatiskt till `/api/v2/auth/refresh`.

## Alternativen vi vägde

- **localStorage** – enklast, och överlever omladdning och ny flik. Men vilket skript som
  helst på sidan kan läsa den (`localStorage.getItem(...)`), så vid en XSS kan en angripare
  stjäla token rakt av. Det var precis hålet vi bevisade i hackerlabbet (A02), och den
  fejkade `localStorage.kraftly_logged_in` som M6 skulle bort med. Valdes bort.
- **JS-läsbar cookie** – följer med anrop automatiskt, men om den inte är httpOnly är den
  lika stöldbar som localStorage, och en cookie som skickas på varje anrop öppnar för CSRF
  (ännu ett hål vi såg i labbet). Valdes bort för access token.
- **Minne (valt)** – token finns bara i en variabel i den körande appen. Ett injicerat
  skript kan fortfarande läsa variabeln under tiden sidan är öppen, men token försvinner vid
  omladdning och ligger inte kvar i något beständigt lager som kan läsas i efterhand. I
  kombination med vår CSP (`script-src 'self'`) är det klart svårare att komma åt än
  localStorage.

## Varför, och vad det kostar

Vi prioriterade att token **inte ska gå att läsa ur ett beständigt lager** – det är den
vanligaste och allvarligaste läckan (XSS → stulen token). Priset är att en omladdning (F5)
tömmer minnet, så appen måste be om en ny access token igen. Det löser vi med att den
kortlivade access-token förnyas mot den httpOnly-cookien via `POST /api/v2/auth/refresh`
(cookien är beständig och oläsbar för JS), så användaren inte loggas ut av en omladdning.

> Status: refresh-anropet finns i `api.js`, men är i skrivande stund inte fullt inkopplat
> att köras automatiskt vid 401 / vid appstart. Tills det är klart tappar en omladdning
> inloggningen. Spårad som kvarstående punkt för Spår 1. (Uppdatera denna rad när det är
> gjort.)
