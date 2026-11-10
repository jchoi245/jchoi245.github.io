// This file runs on the airpods page only.

// ===== SONGS ON THE AIRPODS PAGE =====
// These are Apple's official 30 second previews.
const songs = [
  new Audio('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/94/37/4e/94374ea0-8317-2abf-c27f-6ef60b2beb78/mzaf_15246953119317969504.plus.aac.p.m4a'),
  new Audio('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/d9/1f/1dd91f91-cbd2-87de-643d-e450e839ee2d/mzaf_10919437608751775820.plus.aac.p.m4a'),
  new Audio('https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/f7/03/50f70393-5435-a4b0-1e03-92a031721464/mzaf_1785019607737590347.plus.aac.p.m4a')
];

const covers = [
  document.querySelector('#cover-dean'),
  document.querySelector('#cover-billie'),
  document.querySelector('#cover-sza')
];

const playButtons = [
  document.querySelector('#play-dean'),
  document.querySelector('#play-billie'),
  document.querySelector('#play-sza')
];

const clipLength = 10; // seconds of each song to play
const fadeLength = 1.5; // seconds of fading out at the end

let playingSong = -1; // -1 means nothing is playing

function stopSong() {
  if (playingSong === -1) {
    return;
  }

  songs[playingSong].pause();
  songs[playingSong].currentTime = 0;
  songs[playingSong].volume = 1;
  covers[playingSong].classList.remove('playing');
  playButtons[playingSong].classList.remove('playing');
  playingSong = -1;
}

function clickSong(number) {
  if (playingSong === number) {
    stopSong();
    return;
  }

  stopSong();

  playingSong = number;
  covers[number].classList.add('playing');
  playButtons[number].classList.add('playing');
  songs[number].play();
}

// Runs a few times per second while a song plays.
function checkSongTime() {
  if (playingSong === -1) {
    return;
  }

  const time = songs[playingSong].currentTime;

  if (time >= clipLength) {
    stopSong();
  } else if (time > clipLength - fadeLength) {
    songs[playingSong].volume = (clipLength - time) / fadeLength;
  }
}

for (let i = 0; i < songs.length; i++) {
  songs[i].preload = 'none';
  songs[i].addEventListener('timeupdate', checkSongTime);
  songs[i].addEventListener('ended', stopSong);
  songs[i].addEventListener('error', stopSong);
}

covers[0].addEventListener('click', function () { clickSong(0); });
covers[1].addEventListener('click', function () { clickSong(1); });
covers[2].addEventListener('click', function () { clickSong(2); });

playButtons[0].addEventListener('click', function () { clickSong(0); });
playButtons[1].addEventListener('click', function () { clickSong(1); });
playButtons[2].addEventListener('click', function () { clickSong(2); });
