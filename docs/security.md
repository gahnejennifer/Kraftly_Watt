# Säkerhet – TEAM WATT

## Hotbilden i en mening

<Vad är värt att skydda i portalen, och vem är angriparen? En eller två meningar.>

## Autentiseringen (M6)

<Hur loggar en kund in, var ligger access token, hur fungerar refresh, hur skyddas API:t?>

## OWASP Top 10 – genomgång

| #   | Risk                                  | Gäller oss? | Vad vi hittade                                                            | Vad vi gjorde                                                                 | Kontroll                                                                                              |
| --- | ------------------------------------- | ----------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| A01 | Broken Access Control                 | Ja          | v1 gav fakturor utan login; klienten kunde styra vems data via parametrar | v2 väljer data ur token; route guard (UX) + API kräver Bearer-token (skyddet) | curl /api/v2/invoices utan token → 401; ?customerNo= ignoreras (identiskt svar); test apiAuth.test.js |
| A02 | Security Misconfiguration             |             |                                                                           |                                                                               |                                                                                                       |
| A03 | Software Supply Chain Failures        |             |                                                                           |                                                                               |                                                                                                       |
| A04 | Cryptographic Failures                |             |                                                                           |                                                                               |                                                                                                       |
| A05 | Injection (XSS för oss)               |             |                                                                           |                                                                               |                                                                                                       |
| A06 | Insecure Design                       |             |                                                                           |                                                                               |                                                                                                       |
| A07 | Authentication Failures               |             |                                                                           |                                                                               |                                                                                                       |
| A08 | Software/Data Integrity Failures      |             |                                                                           |                                                                               |                                                                                                       |
| A09 | Logging & Alerting Failures           |             |                                                                           |                                                                               |                                                                                                       |
| A10 | Mishandling of Exceptional Conditions |             |                                                                           |                                                                               |                                                                                                       |

## Headers vi sätter (nginx)

<Lista + curl -I-utdrag från er staging.>

## Kända brister (medvetet kvar)

<Det ni valt att inte laga än, och varför. Ärlighet ger poäng.>
