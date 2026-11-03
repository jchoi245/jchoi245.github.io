// The story is a simple choose-one-item flow: each bag state names the item that is
// valid for that screen and the wrong-item page that opens when you choose the wrong thing.
const STAGE_WIDTH = 1512;
const STAGE_HEIGHT = 982;
const INITIAL_SCREEN = 'hero';

const BAG_STATES = {
  'bag-airpods':  { item: 'airpods',  page: 'page-airpods' },
  'bag-planner':  { item: 'planner',  page: 'page-planner' },
  'bag-pouch':    { item: 'pouch',    page: 'page-pouch' },
  'bag-wallet':   { item: 'wallet',   page: 'page-wallet' },
  'bag-receipts': { item: 'receipts', page: 'page-receipts' },
  'bag-pen':      { item: 'pen',      page: 'page-found' },
};

const bag = document.getElementById('bag');
const heroScreen = document.getElementById('hero');
const heroBag = document.getElementById('hero-bag');
const soundButton = document.getElementById('sound');
const plannerBig = document.getElementById('planner-big');
const stage = document.getElementById('stage');

let currentScreen = INITIAL_SCREEN;
let isBusy = false;

function setActiveScreen(step) {
  const bagState = BAG_STATES[step];
  const targetScreenId = bagState ? 'bag' : step;

  if (bagState) {
    bag.querySelectorAll('.item').forEach(item => {
      const isTarget = item.dataset.item === bagState.item;
      item.classList.toggle('target', isTarget);
      item.tabIndex = isTarget ? 0 : -1;
    });
  }

  currentScreen = step;
  document.querySelectorAll('.screen').forEach(screen => {
    const isActive = screen.id === targetScreenId;
    screen.classList.toggle('active', isActive);
    screen.inert = !isActive;
  });
}

// ---------- sound: everything is synthesised with Web Audio, nothing to load ----------
const sfx = (() => {
  let audioContext, masterGain, fabricGain, fabricTone, isEnabled = true;
  let whiteNoise;

  try { isEnabled = localStorage.getItem('jp-sound') !== 'off'; } catch {}

  function init() {
    if (audioContext) {
      if (audioContext.state === 'suspended') audioContext.resume();
      return;
    }

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = isEnabled ? 1 : 0;
    masterGain.connect(audioContext.destination);

    const noiseLength = audioContext.sampleRate * 2;
    whiteNoise = audioContext.createBuffer(1, noiseLength, audioContext.sampleRate);
    const data = whiteNoise.getChannelData(0);
    for (let i = 0; i < noiseLength; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioContext.createBufferSource();
    const highPass = audioContext.createBiquadFilter();
    fabricTone = audioContext.createBiquadFilter();
    fabricGain = audioContext.createGain();

    source.buffer = whiteNoise;
    source.loop = true;

    highPass.type = 'highpass';
    highPass.frequency.value = 180;

    fabricTone.type = 'lowpass';
    fabricTone.frequency.value = 600;
    fabricTone.Q.value = .5;
    fabricGain.gain.value = 0;

    source.connect(highPass).connect(fabricTone).connect(fabricGain).connect(masterGain);
    source.start();
  }

  const ready = () => audioContext && isEnabled;

  function burst(buffer, filterType, frequency, duration, volume, q = 1, sweepTo) {
    const startTime = audioContext.currentTime;
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();

    source.buffer = buffer;
    filter.type = filterType;
    filter.Q.value = q;
    filter.frequency.setValueAtTime(frequency, startTime);

    if (sweepTo) {
      filter.frequency.exponentialRampToValueAtTime(sweepTo, startTime + duration);
    }

    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);

    source.connect(filter).connect(gain).connect(masterGain);
    source.start(startTime, Math.random() * 1.5);
    source.stop(startTime + duration + .05);
  }

  function tone(frequency, startDelay, duration, volume, type = 'triangle', sweepTo) {
    const startTime = audioContext.currentTime + startDelay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    if (sweepTo) {
      oscillator.frequency.exponentialRampToValueAtTime(sweepTo, startTime + duration * .8);
    }

    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);

    oscillator.connect(gain).connect(masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + .05);
  }

  return {
    init,
    get on() { return isEnabled; },
    toggle() {
      isEnabled = !isEnabled;
      init();
      masterGain.gain.setTargetAtTime(isEnabled ? 1 : 0, audioContext.currentTime, .02);
      try { localStorage.setItem('jp-sound', isEnabled ? 'on' : 'off'); } catch {}
      return isEnabled;
    },
    click() { if (!ready()) return; tone(700, 0, .12, .3, 'triangle', 200); burst(whiteNoise, 'highpass', 4000, .04, .15); },
    blip() { if (!ready()) return; tone(1200 + Math.random() * 300, 0, .07, .06, 'sine'); },
    rustle() { if (!ready()) return; burst(whiteNoise, 'bandpass', 1600 + Math.random() * 1800, .22, .3, 1.2); },
    swish() { if (!ready()) return; burst(whiteNoise, 'bandpass', 500, .35, .35, .9, 5000); },
    tada() { if (!ready()) return; [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => tone(freq, .08 + index * .09, .7, .14)); },
    crinkle() {
      for (let i = 0, count = 2 + Math.random() * 3; i < count; i++) {
        setTimeout(() => burst(whiteNoise, 'bandpass', 1100 + Math.random() * 1300, .01 + Math.random() * .015, .05 + Math.random() * .08, 2), Math.random() * 70);
      }
    },
    knock() {
      tone(140 + Math.random() * 140, 0, .09, .12, 'sine', 90);
      burst(whiteNoise, 'lowpass', 700, .06, .12);
    },
    clink() {
      const baseFrequency = 2200 + Math.random() * 1800;
      [1, 1.47, 2.09].forEach((multiple, index) => tone(baseFrequency * multiple, index * .004, .12 + Math.random() * .15, .035 / (index + 1), 'sine'));
    },
    rummage(level) {
      if (!ready()) return;
      const now = audioContext.currentTime;
      fabricGain.gain.setTargetAtTime(level * (.16 + Math.random() * .1), now, level ? .06 : .15);
      fabricTone.frequency.setTargetAtTime(450 + level * 450 + Math.random() * 200, now, .08);

      if (!level) return;
      if (Math.random() < .12 * level) this.crinkle();
      if (Math.random() < .09 * level) this.knock();
      if (Math.random() < .04 * level) this.clink();
    },
    jostle() {
      if (!ready()) return;
      this.rummage(.8);
      [0, 90, 170, 260].forEach((delay, index) => setTimeout(() => {
        this.knock();
        this.crinkle();
        if (index % 2) this.clink();
      }, delay));
      setTimeout(() => this.rummage(0), 320);
    },
  };
})();

addEventListener('pointerdown', sfx.init);
addEventListener('keydown', sfx.init);

function showSoundState() {
  soundButton.textContent = sfx.on ? 'sound on' : 'sound off';
  soundButton.setAttribute('aria-pressed', sfx.on);
}

soundButton.addEventListener('click', () => {
  sfx.toggle();
  showSoundState();
  sfx.click();
});
showSoundState();

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('click', event => {
  const target = event.target.closest('[data-go], .item.target');
  if (!target || isBusy) return;

  const nextScreen = target.dataset.go || BAG_STATES[currentScreen].page;
  sfx.click();

  let delay = 0;
  if (target.matches('.item')) {
    target.classList.add('picked');
    sfx.rustle();
    delay = 320;
  } else if (target === heroBag || target.matches('.click-bag')) {
    heroBag.classList.add('shake');
    sfx.jostle();
    delay = 380;
  }

  isBusy = true;
  setTimeout(() => {
    isBusy = false;
    target.classList.remove('picked');
    heroBag.classList.remove('shake');
    heroScreen.classList.remove('bag-hover');
    sfx.rummage(0);
    setActiveScreen(nextScreen);
    if (nextScreen === 'page-found') sfx.tada();
  }, reduceMotion ? 0 : delay);
});

// Stagger the entrance of each screen's pieces so they animate in sequence.
document.querySelectorAll('.screen').forEach(screen =>
  [...screen.children].forEach((child, index) => child.style.setProperty('--i', index))
);

// Pointer position in design coordinates (1512 × 982).
function toStage(event) {
  const rect = stage.getBoundingClientRect();
  const scale = rect.width / STAGE_WIDTH;
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
}

// The rummage effect tracks pointer speed to make the bag feel more alive when you move quickly.
function rummager(element, insideBounds, className, baseLevel) {
  let lastPoint = null;
  let idleTimer;

  const stop = () => {
    element.classList.remove(className);
    sfx.rummage(0);
    lastPoint = null;
  };

  element.addEventListener('pointermove', event => {
    if (isBusy || event.pointerType === 'touch') return;
    if (!insideBounds(toStage(event))) return stop();

    const speed = lastPoint
      ? Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y) / Math.max(8, event.timeStamp - lastPoint.t)
      : 0;

    lastPoint = { x: event.clientX, y: event.clientY, t: event.timeStamp };
    const intensity = Math.min(1, speed / 1.5);

    element.style.setProperty('--amp', (.6 + intensity * 2.6).toFixed(2));
    element.classList.add(className);
    sfx.rummage(baseLevel + intensity * (1 - baseLevel));
    clearTimeout(idleTimer);
    idleTimer = setTimeout(stop, 160);
  });

  element.addEventListener('pointerleave', stop);
}

rummager(bag, point => ((point.x - 733) / 430) ** 2 + ((point.y - 541) / 410) ** 2 < 1, 'rummaging', .2);
rummager(heroScreen, point => point.x > 487 && point.x < 1033 && point.y > 160, 'bag-hover', .35);

document.addEventListener('pointerover', event => {
  const target = event.target.closest('.item.target, .box-white, .receipt, #planner-big, .link, #sound');
  if (!target || target.contains(event.relatedTarget)) return;
  target.matches('.item') ? sfx.rustle() : sfx.blip();
});

plannerBig.addEventListener('click', () => {
  plannerBig.classList.remove('flip');
  void plannerBig.offsetWidth;
  plannerBig.classList.add('flip');
  sfx.swish();
});

function fitStage() {
  const scale = Math.min(innerWidth / STAGE_WIDTH, innerHeight / STAGE_HEIGHT);
  stage.style.transform = `scale(${scale}) translate(-50%, -50%)`;
}

addEventListener('resize', fitStage);
fitStage();
setActiveScreen(INITIAL_SCREEN);
