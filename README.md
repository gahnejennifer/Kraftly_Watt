[![CI](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml/badge.svg)](https://github.com/gahnejennifer/Kraftly_Watt/actions/workflows/ci.yml)

# kraftly-portal

Customer portal for Kraftly. Delivered by Webbmakarna AB 2026-06-30.

## Getting started

Use without docker:

1. Open a terminal and write: npm install
2. Write: npm run api
3. Open a second terminal and write: npm run dev
4. Open the Vite URL shown in the terminal.

Use with docker:

1. Create a file named .env in the root directory of the project. Paste the key into this file.
2. Open the Docker Desktop program on your computer. (You can find it here https://docs.docker.com/get-started/get-docker/)
3. Open a powershell terminal and run: docker compose up --build
4. In Docker Desktop you can now click on krafty_watt and open the site.

Note! Your 4000 and 8080 ports must not already be in use.

Solution Windows:

1. Stop the Docker containers by running: docker compose down
2. Check if port 4000 in use by running: netstat -ano | findstr :4000
   Check if port 8080 in use by running: netstat -ano | findstr :8080
   If in use the port will then show: TCP 0.0.0.0:<port> 0.0.0.0:0 LISTENING <PID>
3. Close port by: taskkill /PID <PID> /F

Solution Mac:

1. Stop the Docker containers by running: docker compose down
2. Check if port 4000 in use by running: lsof -i :4000
   Check if port 8080 in use by running: lsof -i :8080
   If the port is in use the terminal will show:
   node <pid> user 23u IPv6 ... TCP *:<port> (LISTEN)
3. Close port by: kill <PID>

## Notes

TODO: write proper documentation

# kraftly-mina-sidor

# Working agreement

- Mötestider utanför schemat: 10.00 digitalt fredagar (avstämning och arbetar tillsammans), 10.00 digitalt tisdagar vid behov.
- Kommunikationsvägar: Grupp i Slack. Vi håller en god kommunikation men förväntas inte svara utanför skoltider.
- Definition of done: Kod ska vara testad och grön samt reviewad av tech-lead
- Tech lead-schema: Jennifer v.1-3, Truc v.4-6, Illona v.7-9, Natassja v.10-12
- Hur säger man till när något skaver: Vi pratar med varandra öppet och tänker på vår ton gentemot varandra, väntar inte för länge med att ta upp något vid behov. Vi håller även i korta retros på fredagarna där man ges tillfälle att ta upp hur veckan gått och vad vi tar med oss till nästa vecka, då kan man ta upp om något skaver.

# Motivering till våra ESLint-regler

**Vi delar upp reglerna i två nivåer beroende på vad de fångar:**

**error — stoppar committen:**

no-var — var har funktionsscope istället för blockscope, vilket kan orsaka svårupptäckta buggar (t.ex. i loopar). Det finns inget legitimt skäl att använda var i modern kod, så vi tillåter det aldrig.
eqeqeq (kräver ===/!==) — == gör implicit typkonvertering som kan ge oväntade resultat (t.ex. '0' == 0 är sant, null == undefined är sant). Det är en vanlig källa till riktiga buggar, inte bara en stilfråga, så vi vill bli stoppade om det smyger sig in.

**warn — varnar men blockerar inte:**

no-console — vi har idag medvetna console.log-anrop kvar i felhanteringen (t.ex. i api.js) som en tillfällig lösning. Att sätta den till error skulle blockera commits av kod vi ännu inte hunnit städa. Den ska bort innan release, men är inte kritisk nog att stoppa arbetet just nu.
no-alert — samma resonemang: vi använder alert() som en enkel platshållare för användarfeedback (t.ex. i InvoicesView.vue vid nedladdning) i väntan på en riktig notis-komponent. En medveten, tillfällig skuld — inte en bugg.
