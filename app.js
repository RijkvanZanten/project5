// Require dependencies
// -------------------------------------------------------
var express = require('express'),
    bodyParser = require('body-parser'),
    socket = require('socket.io'),
    http = require('http'),
    session = require('express-session'),
    items = require('./items.js'),
    secrets = require('./secrets.js');


// Setup the packages
// -------------------------------------------------------
var app = express();
app.use(express.static('assets'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: secrets.sessionSecret,
  saveUninitialized: true,
  resave: false
}));


// Routes & Routers
// -------------------------------------------------------
app.use('/', require('./routes/app.js'));
app.use('/video', require('./routes/video.js'));


// Real-time gekkigheid
// -------------------------------------------------------
var server = http.Server(app);
var io = socket(server);

var currentItem = -1;
var isRevealed = false;

var currentAverage = {
  value: 0,
  peeps: 0,
  avg: function() {
    return this.value / this.peeps;
  }
}

function setup(i, item, socket) {
  // Check of setup al gedaan is voor dit item, zo niet, doe de setup
  if(currentItem != i) {
    isRevealed = false;
    currentItem = i;

    // -1 => geen item, dus toon 'kijk naar TV'
    if(i != -1) {
      console.log('setup' + i)
      // Reset de geschatte waardes
      currentAverage.value = 0;
      currentAverage.peeps = 0;

      var data = {
        min: item.min,
        max: item.max,
        src: item.src,
        start: item.start,
        reveal: item.reveal,
        id: item.id
      }
      socket.broadcast.emit('setup', data);
    } else {
      console.log('Show TV')
      socket.broadcast.emit('showTV');
    }
  }
}

function reveal(i, item, socket) {
  isRevealed = true;

  var data = {
    prijs: item.prijs,
    nl: currentAverage.avg()
  }

  socket.broadcast.emit('reveal', data);
}

io.on('connection', function (socket) {

  socket.on('video', function(data) {
    // Stuur huidige tijd naar clients
    socket.broadcast.emit('video-time', {t: data.playTimeSec});

    // Stuur item data op ingestelde tijden uit items.js
    var itemFound = false;  // Check of er een item is gevonden
    for(var i = 0; i < items.length; i++) {
      if(data.playTimeSec > items[i].start && data.playTimeSec <= items[i].eind) {
        itemFound = true;
        if(data.playTimeSec > items[i].reveal && !isRevealed && data.playTimeSec <= items[i].eind) {
          // Toon echte waarde
          reveal(i, items[i], socket);
        } else {
          // Setup huidige item
          setup(i, items[i], socket);
        }
        // Als er een item is gevonden, stop de loop
        break;
      }
    }

    // Als er geen item is gevonden, toon 'kijk naar TV'
    if(!itemFound) setup(-1, null, socket);
  });

  socket.on('guess', function(data) {
    currentAverage.value += data.value;
    currentAverage.peeps++;
  });

});


// Start the server
// -------------------------------------------------------
server.listen(3000, function() {
	console.log('App started');
});
