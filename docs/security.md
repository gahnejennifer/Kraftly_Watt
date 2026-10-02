# Säkerhet – TEAM WATT

## Hotbilden i en mening

Det vi skyddar är kundernas personuppgifter och fakturor på Mina sidor. Angriparen är i första hand någon som vill komma åt en annan kunds data eller agera i kundens namn – antingen genom en stulen/förfalskad token, ett öppet API-anrop, eller injicerad kod (XSS) i webbläsaren.

## Autentiseringen (M6)

En kund loggar in i LoginView mot POST /api/v2/auth/login med e-post och lösenord. Lyckad inloggning ger en kortlivad access token (JWT, 10 min) i svaret, som vi håller i en JS-variabel i minnet (src/services/token.js) – aldrig i localStorage, eftersom allt där är läsbart för valfri kod på sidan (t.ex. vid XSS). Refresh-token sätts av API:t i en HttpOnly-cookie som JavaScript inte kan läsa. Nackdelen med minne är att token försvinner vid omladdning; det löser vi genom att appen vid start hämtar en ny access token via POST /api/v2/auth/refresh mot cookien (App.vue), så en F5 inte loggar ut användaren. Själva skyddet sitter i API:t, som kräver Authorization: Bearer <token> och väljer data ur token – en route guard skickar bara utloggade till /login för UX:ens skull.

## OWASP Top 10 – genomgång

| #   | Risk                                  | Gäller oss?             | Vad vi hittade                                                                                                                                                                                                                                  | Vad vi gjorde                                                                                                                                                                                                                                   | Kontroll                                                                                                                                                                                                                                                       |
| --- | ------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control                 | Ja                      | v1 gav fakturor utan login; klienten kunde styra vems data via parametrar                                                                                                                                                                       | v2 väljer data ur token; route guard (UX) + API kräver Bearer-token (skyddet)                                                                                                                                                                   | curl /api/v2/invoices utan token → 401; ?customerNo= ignoreras (identiskt svar); test apiAuth.test.js                                                                                                                                                          |
| A02 | Security Misconfiguration             | Ja                      | Säkerhetsheaders saknades eller sattes inte på alla platser (särskilt risk för att missa cache-locations i Nginx), samt osäker hantering av CORS (*)                                                                                            | Lade till en heltäckande CSP, HSTS, X-Frame-Options och övriga headers i nginx.conf.template så att de ärvs korrekt på alla locations.                                                                                                          | Verifierade med curl -sI på både huvudsidan, /assets/ och textfiler att alla headers finns med på varje svar.                                                                                                                                                  |
| A03 | Software Supply Chain Failures        | Nej – ej i fokus för M6 | –                                                                                                                                                                                                                                               | –                                                                                                                                                                                                                                               | –                                                                                                                                                                                                                                                              |
| A04 | Cryptographic Failures                | Ja                      | Saknade eller otillräckliga säkerhetsheaders för kryptering/tvingande HTTPS.                                                                                                                                                                    | Implementerade HSTS (Strict-Transport-Security: max-age=31536000) för att tvinga webbläsaren till HTTPS.                                                                                                                                        | curl -sI visar korrekt HSTS-header.                                                                                                                                                                                                                            |
| A05 | Injection (XSS för oss)               | Ja                      | Risk för XSS om data från API:t renderas som HTML (exempelvis via v-html) eller om fält innehåller skript/img-taggar                                                                                                                            | Införde CSP (script-src 'self') som ett extra skyddslager som begränsar vad ett eventuellt injicerat skript kan göra, och rensade/säkrade koden (gick över till säkrare alternativ som {{ }} istället för v-html där det behövdes).             | Testat att CSP blockerar externa/oönskade skript och att headern syns i curl-svaren.                                                                                                                                                                           |
| A06 | Insecure Design                       |                         |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                |
| A07 | Authentication Failures               | Ja                      | v1:s `/api/login` returnerade alltid en token (`{ token: 'fake-token-123' }`) utan att kontrollera lösenordet, och klienten "loggade in" genom att sätta `localStorage.kraftly_logged_in = 'true'`. Ingen broms mot upprepade gissningar fanns. | Bytte till v2:s riktiga autentisering (`/api/v2/auth/login`), där lösenordet faktiskt kontrolleras, och tog bort den fejkade v1-loginen + `localStorage.kraftly_logged_in`. Rate limiting/lockout har vi **inte** lagt till – kvarstående risk. | `POST /api/v2/auth/login` med fel lösenord (känd e-post) och med okänd e-post ger i båda fallen identiskt svar: `{"error":"Fel e-post eller lösenord"}` → avslöjar inte vilka konton som finns. Rate limiting: ej implementerat, flaggat som kvarstående risk. |
| A08 | Software/Data Integrity Failures      |                         |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                |
| A09 | Logging & Alerting Failures           |                         |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                |
| A10 | Mishandling of Exceptional Conditions |                         |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                |

## Headers vi sätter (nginx)

Filen docker/security-headers.conf inkluderas i varje location i nginx.conf.template.
Content-Security-Policy: default-src 'self'; script-src 'self'; …; frame-ancestors 'none' stoppar främmande skript och iframes
X-Content-Type-Options: nosniff hindrar att filer tolkas som fel typ
X-Frame-Options: DENY skyddar mot clickjacking
Referrer-Policy: strict-origin-when-cross-origin begränsar vad som skickas som referrer
Strict-Transport-Security: max-age=31536000 tvingar https

CORS: alla API-anrop går via vår egen proxy (location /api/), alltså samma origin, så ingen CORS-header behövs och ingen * finns kvar.

```
curl -sI http://localhost:8080/
HTTP/1.1 200 OK
Server: nginx/1.27.5
Date: Thu, 01 Oct 2026 13:08:19 GMT
Content-Type: text/html
Content-Length: 475
Last-Modified: Thu, 01 Oct 2026 11:51:36 GMT
Connection: keep-alive
ETag: "6abe4948-1db"
Cache-Control: no-cache
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
Accept-Ranges: bytes
```

```
curl -sI http://localhost:8080/index.html
HTTP/1.1 200 OK
Server: nginx/1.27.5
Date: Thu, 01 Oct 2026 13:21:52 GMT
Content-Type: text/html
Content-Length: 475
Last-Modified: Thu, 01 Oct 2026 11:51:36 GMT
Connection: keep-alive
ETag: "6abe4948-1db"
Cache-Control: no-cache
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
Accept-Ranges: bytes
```

```
curl -sI http://localhost:8080/config.js
HTTP/1.1 200 OK
Server: nginx/1.27.5
Date: Thu, 01 Oct 2026 13:22:05 GMT
Content-Type: application/javascript
Content-Length: 71
Last-Modified: Thu, 01 Oct 2026 11:51:38 GMT
Connection: keep-alive
ETag: "6abe494a-47"
Cache-Control: no-cache
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
Accept-Ranges: bytes
```

```
curl -sI http://localhost:8080/version.txt
HTTP/1.1 200 OK
Server: nginx/1.27.5
Date: Thu, 01 Oct 2026 13:22:17 GMT
Content-Type: text/plain
Content-Length: 6
Last-Modified: Thu, 01 Oct 2026 11:51:37 GMT
Connection: keep-alive
ETag: "6abe4949-6"
Cache-Control: no-cache
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
Accept-Ranges: bytes
```

```
curl -I https://kraftly-watt-main.onrender.com
HTTP/2 200
date: Thu, 01 Oct 2026 13:22:43 GMT
content-type: text/html
cache-control: no-cache
etag: W/"6abe5e02-1db"
content-security-policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
last-modified: Thu, 01 Oct 2026 13:20:02 GMT
referrer-policy: strict-origin-when-cross-origin
rndr-id: e99565d2-c007-47ce
server: cloudflare
strict-transport-security: max-age=31536000
vary: Accept-Encoding
x-content-type-options: nosniff
x-frame-options: DENY
x-render-origin-server: nginx/1.27.5
cf-cache-status: DYNAMIC
cf-ray: a43bc71bfe756a4d-ARN
alt-svc: h3=":443"; ma=86400
```

## Kända brister (medvetet kvar)

1. Style-src 'unsafe-inline' är kvar eftersom appen (Vue) behöver inline-stilar. Det försvagar CSP för stilar, men skript är fortfarande låsta till 'self'.
2. HSTS är satt utan includeSubDomains och preload, eftersom vi inte kontrollerar hela domänen.
3. Express-API:t skickar X-Powered-By: Express och egna CSP-headrar på felsvar (observerat med curl). Ofarligt, men inte städat.
