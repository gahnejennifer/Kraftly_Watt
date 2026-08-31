# Felsökning Kraftly

## Allmänt

- Basebutton används inte som komponent, olika buttons överallt på hemsidan
- Hiarki för texter (H1 osv) används inte. Blir otydligt för användare samt skärmläsare.
- API ska flyttas till env (enligt api.js). Data som bör hämtas med API ligger direkt i js-filen lokalt i källkoden.
- Hemsidans namn är Vite App, saknas favicon.

## Inloggning:

- Vem som helst kan logga in (framgår i server.js)
- Går att fylla i vad som helst samt logga in utan att fylla i något
- Vid lansering behöver man bli inloggad på sitt eget konto och inte Anna

## Hem:

- Vissa delar av texten är för ljus för att vara tillgänglig, vi skulle behöva öka kontrasten.
- Kanske man vill dölja knappen "Fler spartips" vid lansering. Alert för spartips visar att det finns en funktion som inte är redo för produktion än.
- Tonaliteten i tipset hade också kunna var lite mjukare.
- Bilden laddas avsiktligen långsamt in.

## Fakturor:

- Göra så att man kan ladda ner fakturan eller så skulle vi kunna dölja knappen.
- Varningen om <tr> cannot be child of <table> är en riktig bugg i InvoicesView.vue (troligen saknas <tbody>)

## Flyttanmälan:

- Vi skulle behöva ändra så att det inte går att göra flyttanmälan tidigare år som tex 2020.
- Känns också som att man hade velat ha mer info om vad som händer med ens flyttanmälan, om man kommer få återkoppling etc.
- Vi skulle behöva begränsa antal tecken och vad man får inte får skriva samt formatet för datum exempelvis.
- Ändra så man bara kan spara om allt är ifyllt, inte spara tomt.
- Man hade kanske kunnat ha en komponent för formuläret?
- Man kan också öka tillgängligheten genom att lägga att autocomplete som hjälper folk med minnesproblem.

## Mina uppgifter:

- Nu kan man ta bort alla sina uppgifter och spara, men det hade varit bra om det fanns krav på vad man fick ändra till. Kanske borde det egentligen behöva godkännas av elbolagets kundtjänst innan ändringen träder i kraft?
- Vi skulle behöva begränsa antal tecken och vilka tecken man får och inte får skriva.
- Placeholder hade behövts, för annars blir det helt tomt när man raderar befintlig text.
- Enda feedbacken användaren får är en alert, men man kan klicka att man inte vill få en alert igen och då kommer man inte få någon feedback. Det hade varit bra att ha mer feedback på sidan istället.
- Man kan också öka tillgängligheten genom att lägga till autocomplete.
- Man kan använda <label> för tillgänglighet vid uppläsning av sidan.
- Utan <label> så fungerar inte testerna.

## Menyn:

- När man trycker på "krafty" kommer man inte till hem, det hade varit bra om vi la tilldet i routerLink.
