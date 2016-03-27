var socket = io.connect('/');

var disabled,
    currentItem = -1,
    huidigeSchatting = 0;

var stem = document.querySelector('#stem'),
    tv = document.querySelector('#lookTv'),
    progress = document.querySelector('progress'),
    img = document.querySelector('#stem img'),
    geschat = document.querySelector('#stem p span'),
    input = document.querySelector('#stem input[type="range"]'),
    button = document.querySelector('#stem button');

function disable(bool) {
  if(bool) {
    input.disabled = 'disabled';
    button.disabled = 'disabled';
    disabled = true;
  } else {
    input.disabled = '';
    button.disabled = '';
    disabled = false;
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
  stem.classList.add('active');
  tv.classList.remove('active');

  img.setAttribute('src', data.src);

  disable(false);

  currentItem = data;

  input.setAttribute('min', data.min);
  input.setAttribute('max', data.max);

  var avg = (data.max + data.min) / 2;
  console.log(data.max + ' + ' + data.min + ' / 2 = ' + avg);

  input.value = avg;
  geschat.innerHTML = input.value;
  huidigeSchatting = Number(input.value);
});

socket.on('reveal', function(data) {
  disable(true);
});

button.addEventListener('click', function() {
  huidigeSchatting = Number(input.value);
  socket.emit('guess', {value: huidigeSchatting});
  disable(true);
});

input.addEventListener('input', function() {
  geschat.innerHTML = this.value;
});
