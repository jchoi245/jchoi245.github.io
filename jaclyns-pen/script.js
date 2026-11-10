// This file runs on every page.

// ===== LINKS =====
// Every link plays the button sound and does its little animation,
// then goes to its page a moment later.
const buttonSound = new Audio('assets/sounds/button.mp3');
const links = document.querySelectorAll('a');

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function (event) {
    event.preventDefault(); // wait a moment instead of leaving straight away

    links[i].classList.add('clicked');
    buttonSound.currentTime = 0;
    buttonSound.play();

    setTimeout(function () {
      window.location.href = links[i].href;
    }, 350);
  });
}

// Buttons (like the play buttons) play the sound too.
const buttons = document.querySelectorAll('button');

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    buttonSound.currentTime = 0;
    buttonSound.play();
  });
}


// ===== RUMMAGING =====
// Moving the mouse over a bag shakes it. When the mouse stops, the shaking stops.
const hero = document.querySelector('#hero');
const heroBagButton = document.querySelector('#hero-bag-button');
const bag = document.querySelector('#bag');
const rummageArea = document.querySelector('#rummage-area');

let shakeTimer;

function shake(screen) {
  screen.classList.add('shaking');
  clearTimeout(shakeTimer);

  shakeTimer = setTimeout(function () {
    screen.classList.remove('shaking');
  }, 160);
}

// Only the start page and the bag pages have something to shake.
if (heroBagButton !== null) {
  heroBagButton.addEventListener('mousemove', function () {
    shake(hero);
  });
}

if (rummageArea !== null) {
  rummageArea.addEventListener('mousemove', function () {
    shake(bag);
  });
}


// ===== FIT THE STAGE TO THE WINDOW =====
const stage = document.querySelector('#stage');

function fitStage() {
  const scaleWidth = window.innerWidth / 1512;
  const scaleHeight = window.innerHeight / 982;
  const scale = Math.min(scaleWidth, scaleHeight);

  stage.style.transform = 'scale(' + scale + ') translate(-50%, -50%)';
}

window.addEventListener('resize', fitStage);
fitStage();
