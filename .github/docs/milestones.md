# M0
[x] Teamrepo skapat från starter-templaten, med skyddad main (PR krävs + minst en godkänd review), PR-mall och CODEOWNERS
[x] Working agreement i README: mötestider, kommunikationsvägar, definition of done för PR:er, tech lead-schema för rotationen
[x] Appen körs lokalt hos alla i teamet
[x] Skuldinventering i docs/debt.md
[x] Kort logg i docs/log.md: vad ni gjorde, vad som var svårt

# M1
[x] Testsvit med minst 10 meningsfulla test – både logik (enhet) och komponent, körbara med npm run test:run, alla gröna
[x] Minst 5 av testerna är på kod som inte var med i torsdagens övningar (stores, api.js, LoginView, ProfileView, spinnern, det svalda felet …)
[x] Minst ett regressionstest på en bugg ur er docs/debt.md – ett test som hade fångat buggen om den funnits kvar. Skriv i testnamnet eller en kommentar vilken skuld det gäller
[] ESLint + Prettier körs i pre-commit via husky + lint-staged. npm run lint och npm run format:check går igenom på main utan errors
[x] Teststrategi i docs/testing.md enligt strukturen från workshopen: nivåer, karta över vad som testas var, era fem beslut (inkl. täckningskrav ja/nej och varför), vad ni medvetet inte testar
[x] E2E-beslutet dokumenterat i docs/decisions/e2e-verktyg.md (se nedan), och det valda verktygets smoke-test mergat till main (körbart med npm run e2e:pw eller npm run e2e:cy)
[x] Logg i docs/log.md: en post per arbetsdag – vad ni gjorde, vad som var svårt, vem som gjorde vad