var socket = io.connect('/');

// Send current time in seconds to server
var prev = -1;
document.querySelector('video').addEventListener('timeupdate', function() {
  if(Math.floor(Number(document.querySelector('video').currentTime)) != prev) {
    socket.emit('video', {playTimeSec: Math.floor(Number(document.querySelector('video').currentTime))});
    prev = Math.floor(Number(document.querySelector('video').currentTime));
  };
});

var holder = document.querySelector('#video-results');
socket.on('setup', function() { holder.classList.remove('active'); });
socket.on('showTv', function() { holder.classList.remove('active'); });


socket.on('reveal', function(data) {
  holder.querySelector('ul li:first-of-type span').innerHTML = '€' + data.prijs;
  holder.querySelector('ul li:last-of-type span').innerHTML = '€' + data.nl;
  holder.classList.add('active');
});
