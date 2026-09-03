[![CI](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml/badge.svg)](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml)

# kraftly-portal

Customer portal for Kraftly. Delivered by Webbmakarna AB 2026-06-30.

## Getting started

    npm install
    npm start

TODO: write proper documentation

# kraftly-mina-sidor

# Working agreement

- Mötestider utanför schemat: 10.00 digitalt fredagar (avstämning och arbetar tillsammans), 10.00 digitalt tisdagar vid behov.
- Kommunikationsvägar: Grupp i Slack. Vi håller en god kommunikation men förväntas inte svara utanför skoltider.
- Definition of done: Kod ska vara testad och grön samt reviewad av tech-lead
- Tech lead-schema: Jennifer v.1-3, Natassja v.4-6, Illona v.7-9, Truc v.10-12
- Hur säger man till när något skaver: Vi pratar med varandra öppet och tänker på vår ton gentemot varandra, väntar inte för länge med att ta upp något vid behov. Vi håller även i korta retros på fredagarna där man ges tillfälle att ta upp hur veckan gått och vad vi tar med oss till nästa vecka, då kan man ta upp om något skaver.

# Motivering till våra ESLint-regler

**Vi delar upp reglerna i två nivåer beroende på vad de fångar:**

**error — stoppar committen:**

no-var — var har funktionsscope istället för blockscope, vilket kan orsaka svårupptäckta buggar (t.ex. i loopar). Det finns inget legitimt skäl att använda var i modern kod, så vi tillåter det aldrig.
eqeqeq (kräver ===/!==) — == gör implicit typkonvertering som kan ge oväntade resultat (t.ex. '0' == 0 är sant, null == undefined är sant). Det är en vanlig källa till riktiga buggar, inte bara en stilfråga, så vi vill bli stoppade om det smyger sig in.

**warn — varnar men blockerar inte:**

no-console — vi har idag medvetna console.log-anrop kvar i felhanteringen (t.ex. i api.js) som en tillfällig lösning. Att sätta den till error skulle blockera commits av kod vi ännu inte hunnit städa. Den ska bort innan release, men är inte kritisk nog att stoppa arbetet just nu.
no-alert — samma resonemang: vi använder alert() som en enkel platshållare för användarfeedback (t.ex. i InvoicesView.vue vid nedladdning) i väntan på en riktig notis-komponent. En medveten, tillfällig skuld — inte en bugg.
