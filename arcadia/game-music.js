(() => {
  const soundButton = document.querySelector('#sound-button');
  const startButton = document.querySelector('#start-button');
  const overlay = document.querySelector('#game-overlay');
  const gameId = new URLSearchParams(window.location.search).get('game') || 'ridge';
  const themes = {
    ridge: { tempo: 420, wave: 'sawtooth', notes: [110, 165, 220, 165, 147, 196] },
    duel: { tempo: 310, wave: 'square', notes: [196, 233, 174, 147, 220, 174] },
    sky: { tempo: 360, wave: 'sine', notes: [440, 554, 659, 554, 740, 659] },
    echo: { tempo: 470, wave: 'triangle', notes: [330, 440, 523, 659, 523, 440] },
    orbit: { tempo: 390, wave: 'sine', notes: [147, 220, 294, 220, 165, 247] },
    maze: { tempo: 440, wave: 'triangle', notes: [262, 311, 370, 311, 247, 294] },
    dash: { tempo: 250, wave: 'square', notes: [220, 220, 330, 220, 392, 330] },
    stack: { tempo: 520, wave: 'triangle', notes: [262, 330, 392, 523, 392, 330] }
  };
  let timer = 0;
  let step = 0;

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = 0;
  }

  function playTone(frequency, theme) {
    if (!soundOn || !audioContext) return;
    const context = audioContext;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = theme.wave;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.018, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  }

  function start() {
    stop();
    const theme = themes[gameId] || themes.ridge;
    if (!audioContext && soundOn) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const context = audioContext;
    if (!context || !soundOn) return;
    step = 0;
    playTone(theme.notes[step], theme);
    timer = window.setInterval(() => {
      if (!soundOn || !overlay || !overlay.hidden || document.hidden) { stop(); return; }
      step = (step + 1) % theme.notes.length;
      playTone(theme.notes[step], theme);
    }, theme.tempo);
  }

  startButton?.addEventListener('click', start);
  soundButton?.addEventListener('click', () => {
    if (soundOn && overlay?.hidden) start(); else stop();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
})();

