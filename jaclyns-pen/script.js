// ===== GET THE THINGS WE NEED FROM THE PAGE =====
const stage = document.querySelector('#stage');
const hero = document.querySelector('#hero');
const bag = document.querySelector('#bag');
const heroBag = document.querySelector('#hero-bag');
const heroBagButton = document.querySelector('#hero-bag-button');
const clickBagText = document.querySelector('#click-bag-text');
const rummageArea = document.querySelector('#rummage-area');
const exploreAgain = document.querySelector('#explore-again');
const plannerBig = document.querySelector('#planner-big');
const todoPage = document.querySelector('#todo-page');
const leftPage = document.querySelector('#left-page');
const plannerHint = document.querySelector('#planner-hint');
const progressBar = document.querySelector('#progress-bar');

const screens = document.querySelectorAll('.screen');
const itemButtons = document.querySelectorAll('.item');
const backButtons = document.querySelectorAll('.back-to-bag');
const progressSegments = document.querySelectorAll('#progress-bar span');


// ===== THE GAME =====
// The items, in the order you have to find them.
const items = ['airpods', 'planner', 'pouch', 'wallet', 'receipts', 'pen'];

let itemsFound = 0;
let isChangingScreen = false;

// Show one screen and hide all the others.
function showScreen(screenName) {
  for (let i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }
  document.querySelector('#' + screenName).classList.add('active');

  stopSong();
  updateProgressBar(screenName);
}

// Open the bag. Only the next item can be clicked.
function showBag() {
  for (let i = 0; i < itemButtons.length; i++) {
    itemButtons[i].classList.remove('target');
    itemButtons[i].disabled = true;
  }

  const nextItem = document.querySelector('#' + items[itemsFound] + '-item');
  nextItem.classList.add('target');
  nextItem.disabled = false;

  showScreen('bag');
}

// Click the bag on the start screen: it shakes, then opens.
function openBag() {
  if (isChangingScreen === true) {
    return;
  }
  isChangingScreen = true;
  heroBag.classList.add('big-shake');

  setTimeout(function () {
    heroBag.classList.remove('big-shake');
    isChangingScreen = false;
    showBag();
  }, 380);
}

// Click an item in the bag: it jumps up, then its page opens.
function grabItem() {
  if (isChangingScreen === true) {
    return;
  }
  isChangingScreen = true;

  const itemName = items[itemsFound];
  const itemButton = document.querySelector('#' + itemName + '-item');
  itemButton.classList.add('picked');
  itemsFound = itemsFound + 1;

  setTimeout(function () {
    itemButton.classList.remove('picked');
    isChangingScreen = false;
    showScreen('page-' + itemName);
  }, 320);
}

// Fill in one segment of the bar for each item found.
function updateProgressBar(screenName) {
  for (let i = 0; i < progressSegments.length; i++) {
    if (i < itemsFound) {
      progressSegments[i].classList.add('done');
    } else {
      progressSegments[i].classList.remove('done');
    }
  }

  if (screenName === 'hero') {
    progressBar.classList.add('hidden');
  } else {
    progressBar.classList.remove('hidden');
  }
}

heroBagButton.addEventListener('click', openBag);
clickBagText.addEventListener('click', openBag);

for (let i = 0; i < itemButtons.length; i++) {
  itemButtons[i].addEventListener('click', grabItem);
}

for (let i = 0; i < backButtons.length; i++) {
  backButtons[i].addEventListener('click', showBag);
}

exploreAgain.addEventListener('click', function () {
  itemsFound = 0;
  closePlanner();
  showScreen('hero');
});

// ===== THE PLANNER =====
let plannerOpen = false;

function openPlanner() {
  plannerBig.classList.add('open');
  todoPage.classList.add('showing');
  leftPage.classList.add('showing');
  plannerHint.classList.add('dark');
  plannerHint.textContent = 'click to close';
  plannerOpen = true;
}

function closePlanner() {
  plannerBig.classList.remove('open');
  todoPage.classList.remove('showing');
  leftPage.classList.remove('showing');
  plannerHint.classList.remove('dark');
  plannerHint.textContent = 'click to open';
  plannerOpen = false;
}

// Click the closed notebook to open it.
plannerBig.addEventListener('click', function () {
  if (plannerOpen === false) {
    openPlanner();
  }
});

// Click the left page to close it again.
leftPage.addEventListener('click', function () {
  closePlanner();
});


// ===== THE POUCH =====
// Hovering a thing in the pouch writes its name in the tooltip.
const tooltip = document.querySelector('#tooltip');
const tooltipStart = tooltip.innerHTML;

function addPouchName(selector, name) {
  const thing = document.querySelector(selector);

  thing.addEventListener('mouseenter', function () {
    tooltip.innerHTML = name + '<br>(not a pen)';
  });

  thing.addEventListener('mouseleave', function () {
    tooltip.innerHTML = tooltipStart;
  });
}

addPouchName('#pouch-clip', 'hair clip');
addPouchName('#pouch-cream', 'hand cream');
addPouchName('#pouch-mirror', 'pocket mirror');
addPouchName('#pouch-balm', 'lip balm');
addPouchName('#pouch-tissues', 'tissues');


// ===== RUMMAGING =====
// Moving the mouse over a bag shakes it. When the mouse stops, the shaking stops.
let shakeTimer;

function shake(screen) {
  screen.classList.add('shaking');
  clearTimeout(shakeTimer);

  shakeTimer = setTimeout(function () {
    screen.classList.remove('shaking');
  }, 160);
}

heroBagButton.addEventListener('mousemove', function () {
  shake(hero);
});

rummageArea.addEventListener('mousemove', function () {
  shake(bag);
});


// ===== BUTTON SOUND =====
const buttonSound = new Audio('assets/sounds/button.mp3');
const allButtons = document.querySelectorAll('button');

for (let i = 0; i < allButtons.length; i++) {
  allButtons[i].addEventListener('click', function () {
    buttonSound.currentTime = 0;
    buttonSound.play();
  });
}


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


// ===== FIT THE STAGE TO THE WINDOW =====
function fitStage() {
  const scaleWidth = window.innerWidth / 1512;
  const scaleHeight = window.innerHeight / 982;
  const scale = Math.min(scaleWidth, scaleHeight);

  stage.style.transform = 'scale(' + scale + ') translate(-50%, -50%)';
}

window.addEventListener('resize', fitStage);
fitStage();
