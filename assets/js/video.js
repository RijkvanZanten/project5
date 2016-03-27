var socket = io.connect('/');

// Send current time in seconds to server
var prev = -1;
document.querySelector('video').addEventListener('timeupdate', function() {
  if(Math.floor(Number(document.querySelector('video').currentTime)) != prev) {
    socket.emit('video', {playTimeSec: Math.floor(Number(document.querySelector('video').currentTime))});
    prev = Math.floor(Number(document.querySelector('video').currentTime));
  };
});
