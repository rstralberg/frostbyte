# FrostByte
Ett enkelt system för en privat hemsida där det inte behövs
alltför mycket tingel och tangel. Det hela är gjort för nöjes 
skull och vikten är lagt vid att det ska vara enkelt att hantera

Behöver du mer avancerade funktion så är det här ingenting för 
dig, då passar nog WordPress eller liknande bättre.

Allt är skrivet i PHP och Jscript. Inga externa biblioket används,
så projektet ska vara 'självförsörjande'

## Utvecklingsmiljö

- `Visual Studio Code` 
- `PHP 8`
- `JScript`
- `MariaDB databas`

# Katalogstruktur

| Katalog                   | Innehåll                                              |
| --------------------------|-------------------------------------------------------|
| `/`                       | Roten för projektet                                   |
| `/.vscode`                | Inställningar för VSCode                              |
| `/php`                    | Rot för icke publik PHP-kod                           |
| `/php/db`                 | Rutiner/klasser för databasåtkomst                    |
| `/php/generators`         | Genererar HTML headers mm                             |
| `/php/reply`              | Rutiner för att svara på förfrågningar från JScript   |
| `/public`                 | Rot för den publika delen                             |
| `/public/css`             | All CSS kod                                           |
| `/public/favicons`        | Ikoner för webläsaren                                 |
| `/public/icons`           | Övriga ikoner                                         |
| `/public/fonts`           | Fonter/teckensnitt som används                        |
| `/public/js`              | Rot för alla Jscripts                                 |
| `/public/js/components`   | Baskomponenter                                        |
| `/public/js/contents`     | Rutiner för användarinnehåll                          |
| `/public/js/utils`        | Hjälprutiner av varierande slag                       |
| `/public/php`             | PHP för kommunkation med servern                      |
| `/public/uploads`         | Här laddas all bilder, videor och annat upp           |

# Databas

En mySQL databas används. Den skapas automatisk tillsammans med all tabeller 
när systemet startas. Följande tabeller ingår

| Tabell    | Innehåll                      |
| ----------| ------------------------------|
| `page`    | Alla sidor                    |
| `section`   | Alla section                    |
| `field`   | Alla fält                     |
| `config`  | Konfiguration av systemet     |
| `theme`   | Alla teman (nu två stycken)   |
| `user`    | Registrade användare          |


# Grundläggande funktion

Webbläsaren ladda in `/public/index.php` som direkt leder till `/main.php` där
den grundläggande HTML-sidan skapas. Den är ett tomt skellett med en topp-meny,
en sk 'footer', en mitten-avdelning för sideinnehåll samt ett fält till vänser
och ett till höger. Det vänstra används vid redigering till menyer för detta.

| Avdelning      | Innehåll                                                              |
| ---------------| ----------------------------------------------------------------------|
| `Toppmeny`     | Publik meny (Navbar) för sidor                                        |
| `Vänster fält` | Vid redigering finns här meny för redigeringsfuktioner, eljest tomt   |
| `Mitten fält`  | Aktuellt sidinnehåll                                                  |
| `Höger fält`   | Tomt fält                                                             |
| `Footer`       | En rad längst ned med 'All rights reserved' eller liknande            |

## Serverns funktion

Servern har egentligen bara två uppgifter

1. Skapa det tomma HTML-skelletet som behövs
2. Anropa klientens `main.js` som sedan fyller skelettet med innehåll genom frågor till servern
3. Svara på förfrågningar från kientens JScript. Dessa är i princip SQL-frågor

# Sidstruktur

En sida består av ett eller flera sektioner `sections`. En `section` består sedan av användardefinierat
innehåll av olika slag. Detta är samlat som `content` i varje sektion och är lagrat som JSON-kod. För 
närvarnde supportas förljande typer. Kod för dessa finns i `/public/js/content`. Det är tämligen enkelt
att lägga till nya typer vid behov. Kopiera bara en befitlig type, ändra namn och hantering

| Fälttyp       | Innehåll              |
|---------------|-----------------------|
| `Text`        | Vanlig text           |
| `Picture`     | En bild               |
| `Soundcloud`  | Ljud från Soundcloud  |
| `Spotify`     | Ljud från Spotify     |
| `Youtube`     | Video Youtube         |
| `Audio`       | Lokala ljudfiler      |
| `Empty`       | Tomt fält             |

# Generellt om koden

Jag ordar inget om den annat än principen om hur sidor, sektioner med innehåll skapas. 
Övrigt är tämligen enkelt och torde inte vålla några besvär att följa med i. I koden
kallas en sida för 'Page', em sektion för 'section'. 

Följande gäller gemensamt för sektionernas specialisering i `js/content`. XXXX` är
alltså namnet på specialiseringen

| Funktion          | Ansvar |
| --------------    | -------|
| `create_XXXX`     | Skapar nytt innehåll och sparar detta i databasen. 'draw' får sedan presentera det
| `draw_XXXX`       | Laddar innehåll från databasen och presenterar HTML-kod utifrån detta
| `show_XXXX_tools` | Anropas när sektionen väljs och får då lägga till det 'verktyg' som behövs vid redigering
| `delete_XXXX`     | Raderar sektionen från databasen och tar bort presentationen
| `entering_XXXX`   | Aropas när sektionen valts
| `leaving_XXXX`    | Aropas när sektionen lämnas


I praktiken går det till så här då:

När en sida väljs ur toppmenyn anropas `load_page` som laddar sidan. I denna procedur så laddas alla
sektioner som ingår i sidan genom anrop till `load_sections`. Varje section anropar sedan den specialiserade
`draw_XXXX` funktionen som fyller sektionen med innehåll


## Globals

Det finns några globala variabler man kan använda. Dom är samlade i klassen `Global`

Global.config - Aktuell konfiguration (se `/php/db/config.php`)
Global.user - Aktuell inloggad användare eller `null` (se `/php/db/user.php`)
Global.page - Aktuell sida (se `/php/db/page.php`)
Global.navbar - Referns till toppmenyn
Globla.selected - Referens till vald sektion

# Teman

För att inte krångla till det alltför mycket så supportas två teman. Ett ljust och ett mörkt. Hur dessa ska 
se ut kan redigeras. I stort sett är det frågan om färger och lite annat. Grundmodellen av HTML skellettet går 
inte att ändra.

# Användare

Det finns support för att hanterar användare som då kan vara 'vanliga' eller 'administratörer'. Administratören kan 
gör allt. Den vanliga användare kan redigera sin egen sida. Registrering av nya användare kan endast göras av en administratör

# Uppladning av bilder mm

De bilder eller annat som laddas upp för att ingå i en sida lagras i en underkatalog till `/uploads` som helt enkelt
har sidans namn. På så sätt blandas inte olika sidors material samman

# Konfiguration

Det finns en fil `/php/config.php` där man konfigurera systemet efter sina behov.

```
//  MySQL access
const CONF_HOST = 'värd för database';
const CONF_USER = 'användare för database';
const CONF_DBPASSW = 'lösenord för databasen';
const CONF_DATABASE = 'databasens namn';

// Default admin user
const CONF_USERNAME = 'administratörens användarnamn';
const CONF_FULLNAME = 'administratörens fullständiga namn';
const CONF_PASSWORD = 'administratörens lösenord';
const CONF_EMAIL = 'administratörens mail-adress';

// Default home
const CONF_HOME = 'Startsidan namn (inga mellanslag, små bokstäver)';
const CONF_HOME_TITLE = 'Startsidans titel;

// Default config
const CONF_LANGUAGE = 'språk, för närvarande supportas bara svenska, dvs 'sv';
const CONF_SITENAME = 'Webbsidans namn';
const CONF_SITEOWNER = 'Webbsidans utgivare eller ägare';
const CONF_THEME = 'Tema från start. Finns två att välja. "Mörkt" eller "Ljust"';
const CONF_CHARSET = 'UTF-8' är det endas som supportas nu
const CONF_LOGO = 'bild som användas som logga i toppmenyn'
const CONF_SHOWHEADERS = 'Ska sidrubriker visa på vald sida eller inte' (true eller false);
```

# Till sist

Hittar du fel, har önskemål eller har nått smart att tillägga så maila gärna mig 

Min mail är rstralberg@pm.me


# Att göra 

- Tools visas inte direkt efter inloggning. Måste start om först
- Youtube uppspelning fungerar inte
