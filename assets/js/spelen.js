var socket = io.connect('/');

var currentItem = -1,
    score = 0,
    newScore = 0,
    huidigeSchatting = 0,
    voted = false;

var stem = document.querySelector('#stem'),
    tv = document.querySelector('#lookTv'),
    progress = document.querySelector('progress'),
    img = document.querySelector('#stem img'),
    geschat = document.querySelector('#stem p span'),
    input = document.querySelector('#stem input[type="range"]'),
    button = document.querySelector('#stem button');

var counterUp, counterDown, countOptions = {
  useEasing : false,
  useGrouping : true,
  separator : ',',
  decimal : '.',
  prefix : '',
  suffix : ''
};

function disable(bool) {
  if(bool) {
    input.disabled = 'disabled';
    button.disabled = 'disabled';
  } else {
    input.disabled = '';
    button.disabled = '';
  }
}

socket.on('showTV', function(data){
  currentItem = -1;
  stem.classList.remove('active');
  tv.classList.add('active');
});

socket.on('video-time', function(data) {
  if(currentItem != -1) {
    progress.value = 100 - (data.t - currentItem.start) * (100 / (currentItem.reveal - currentItem.start));
  }

  if(progress.value <= 20 && !progress.classList.contains('flash')) {
    progress.classList.add('flash');
  } else if(progress.value > 20 && progress.classList.contains('flash')) {
    progress.classList.remove('flash');
  }
});

socket.on('setup', function(data) {
  voted = false;
  document.querySelector('#stem-results').classList.remove('active');
  document.querySelector('#stem-controls').classList.add('active');

  stem.classList.add('active');
  tv.classList.remove('active');

  img.setAttribute('src', data.src);

  disable(false);

  currentItem = data;

  input.setAttribute('min', data.min);
  input.setAttribute('max', data.max);

  var avg = (data.max + data.min) / 2;

  input.value = avg;
  geschat.innerHTML = input.value;
});

socket.on('reveal', function(data) {
  disable(true);
  document.querySelector('#stem-results').classList.add('active');
  document.querySelector('#stem-controls').classList.remove('active');
  document.querySelector('#scoreUp').innerHTML = score;
  document.querySelector('#scorePlus').innerHTML = ' + ';
  document.querySelector('#stem-results p:first-of-type span').innerHTML = '€' + currentItem.prijs;


  if(!voted) {
    newScore = score - 70;
    document.querySelector('#scorePlus').innerHTML = ' - ';
    document.querySelector('#scoreDown').innerHTML = '2';
    document.querySelector('#guess').innerHTML = '¯\\_(ツ)_/¯';
    document.querySelector('#verschil').innerHTML = '';


    counterUp = new CountUp('scoreUp', score, newScore, 0, 1, countOptions);
    counterDown = new CountUp('scoreDown', 70, 0, 0, 1, countOptions);
  } else {
    var verschil = currentItem.prijs - huidigeSchatting;
    var posVerschil = -verschil > 0 ? -verschil : verschil;

    document.querySelector('#guess').innerHTML = '€' + huidigeSchatting;
    document.querySelector('#verschil').innerHTML = verschil >= 0 ? ('(- €' + verschil + ')') : ('(+ €' + posVerschil + ')');
  }

  setTimeout(function() {
    counterUp.start(function() {
      score = newScore;
    });
    counterDown.start(function() {
      document.querySelector('#scoreDown').innerHTML = '';
      document.querySelector('#scorePlus').innerHTML = '';
    });
  }, 1500);
});

socket.on('sendScores', function() {
  socket.emit('score', {naam: document.querySelector('input[type="hidden"]').value, score: score});
});

socket.on('eindScores', function(data) {
  var scores = data.scores;
  scores.sort(function(a, b) {
    return b.score - a.score;
  });

  var table = document.querySelector('table');
  for(i = 0; i < scores.length; i++) {
    table.innerHTML += '<tr><td>' + scores[i].naam + '</td><td>' + scores[i].score + '</td></tr>';
  }
  document.querySelector('#lookTv').classList.remove('active');
  document.querySelector('#eindStand').classList.add('active');
});

button.addEventListener('click', function() {
  voted = true;
  huidigeSchatting = Number(input.value);
  socket.emit('guess', {value: huidigeSchatting});
  disable(true);

  var rondeScore = 100;
  var tienProcent = (currentItem.max - currentItem.min) / 10;

  // Check het verschil
  var verschil = +(currentItem.prijs - huidigeSchatting);

  // Maak het verschil altijd een positief getal
  var posVerschil = -verschil > 0 ? -verschil : verschil;

  rondeScore = rondeScore - (10 * Math.round(posVerschil / tienProcent));

  // Geef extra punten als er vroeg gestemd wordt
  if(progress.value > 85) rondeScore = rondeScore + 25;
  if(progress.value > 70) rondeScore = rondeScore + 25;

  newScore = score + rondeScore;

  counterUp = new CountUp('scoreUp', score, newScore, 0, 1, countOptions);
  counterDown = new CountUp('scoreDown', rondeScore, 0, 0, 1, countOptions);

  document.querySelector('#scoreDown').innerHTML = rondeScore;
});

input.addEventListener('input', function() {
  geschat.innerHTML = this.value;
});
