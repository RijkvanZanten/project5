# Project5
Second Screen app voor het programma Tussen Kunst en Kitsch

## Installatie
Download alle en run in deze directory ```npm install``` en ```bower install```

Het is noodzakelijk dat je in de root van deze app een bestand aanmaakt gemaakt secrets.js met de volgende inhoud:

```javascript
var secrets = {
  sessionSecret: 'secretString',
  videoUser: 'secretUsername',
  videoPass: 'secretPassword'
}

module.exports = secrets;
```

Vervolgens doe je ```gulp serve``` en draait hij op http://localhost:3000/
