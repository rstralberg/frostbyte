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

| Katalog           | Innehåll                                              |
| ------------------|-------------------------------------------------------|
| `/`                | Roten för projektet                                   |
| `/.vscode`         | Inställningar för VSCode                              |
| `/php`             | Rot för icke publik PHP-kod                           |
| `/php/db`          | Rutiner/klasser för databasåtkomst                    |
| `/php/generators`  | Genererar HTML headers mm                             |
| `/php/reply`       | Rutiner för att svara på förfrågningar från JScript   |
| `/public`          | Rot för den publika delen                             |
| `/public/css`      | All CSS kod                                           |
| `/public/favicons` | Ikoner för webläsaren                                 |
| `/public/icons`    | Övriga ikoner                                         |
| `/public/fonts`    | Fonter/teckensnitt som används                        |
| `/public/js`       | Rot för alla Jscripts                                 |
| `/public/js/fields`| Allt specialiserat fältinnehåll                       |
| `/public/js/utils` | Hjälprutiner av varierande slag                       |
| `/public/php`      | PHP för kommunkation med servern                      |
| `/public/uploads`  | Här laddas all bilder, videor och annat upp           |

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

En sida består av ett eller flera `section`. Ett `section` består sedan av ett eller fler `fält` 
(i koden kallas fält för 'field'). Dessa fält har sedan olika specialiserde innehåll. För 
närvarnde supportas förljande typer. Kod för dessa finns i `/public/js/fields`

| Fälttyp       | Innehåll              |
|---------------|-----------------------|
| `Text`        | Vanlig text           |
| `Picture`     | En bild               |
| `Soundcloud`  | Ljud från Soundcloud  |
| `Spotify`     | Ljud från Spotify     |
| `Vimeo`       | Video från Vimeo      |
| `Youtube`     | Video Youtube         |
| `Audio`       | Lokala ljudfiler      |
| `Video`       | Lokala videofiler     |
| `Empty`       | Tomt fält             |

# Generellt om koden

Jag ordar inget om den annat än principen om hur Sidor, section och Bält skapas. 
Övrigt är tämligen enkelt och torde inte vålla några besvär att följa med i. I koden
kallas en sida för 'Page', ett section för 'section' och ett fält för 'Field'. 

Följande gäller gemensamt för dessa tre kategorier (page, section och field). `XXXX` är
alltså antingen `page`, `section` eller `field`

| Funktion      | Ansvar |
| --------------| -------|
| `load_XXXX`   | Laddar innehåll från databasen och presenterar HTML-kod utifrån detta
| `create_XXXX` | Skapar nytt innehåll och sparar detta i databasen. 'load' får sedan presentera det
| `delete_XXXX` | Raderar från databasen och tar bort presentation
| `select_XXXX` | Markerar elementet som 'valt'


I praktiken går det till så här då:

När en sida väljs ur toppmenyn anropas `load_page` som laddar sidan. I denna procedur så laddas alla
section som ingår i sidan genom anrop till `load_section`. Varje section laddar i sin tur alla fält som ingår
i sectionet genom anrop till `load_field`.

I funktionen `load_field` söks efter en funktion som laddar en specialisering av fältet. Detta sker genom
att det göra ett försök att hitta och anropa `load_YYYY` där YYYY är fälttypen. Så om fältet är av typen
`Picture` sker en sökning efter rutinen `load_picture`. Hittas denna anropas den som då får fylla det skapade
fältet med i detta fall en bild.

## Globals

Det finns några globala variabler man kan använda.

window['config'] - Aktuell konfiguration (se `/php/db/config.php`)
window['user'] - Aktuell inloggad användare eller `null` (se `/php/db/user.php`)
window['page'] - Aktuell sida (se `/php/db/page.php`)
window['selected_field'] - Referens till valt fält (ett `div`-element)
window['selected_section'] - Referens till valt section (ett `div`-element)

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

Min mail är roland.stralberg@gmail.com
