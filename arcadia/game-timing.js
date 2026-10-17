/* Keep frame-based canvas games consistent on 30, 60, and 120 Hz displays. */
(() => {
  // Keep Ridge Runner at its tuned pace; give the other quick-play cabinets
  // a livelier rhythm without changing how the car handles.
  const selectedGame = new URLSearchParams(window.location.search).get('game');
  const nativeRequest = window.requestAnimationFrame.bind(window);
  const callbacks = new Map();
  // A slightly livelier fixed simulation rate keeps every cabinet responsive,
  // while still producing the same pace on phones and desktop displays.
  const frameMs = 1000 / (selectedGame === 'ridge' ? 90 : 110);
  let nextId = 1;
  let scheduled = false;
  let lastTime = 0;
  let accumulator = 0;

  function schedule() {
    if (scheduled || !callbacks.size) return;
    scheduled = true;
    nativeRequest(pump);
  }

  function pump(now) {
    scheduled = false;
    if (!lastTime) lastTime = now;
    accumulator += Math.min(80, now - lastTime);
    lastTime = now;
    const steps = Math.min(4, Math.floor(accumulator / frameMs));
    if (!steps) { schedule(); return; }
    accumulator -= steps * frameMs;
    for (let step = 0; step < steps; step += 1) {
      const work = [...callbacks.entries()];
      callbacks.clear();
      work.forEach(([, callback]) => callback(now));
    }
    schedule();
  }

  window.requestAnimationFrame = callback => {
    const id = nextId++;
    callbacks.set(id, callback);
    schedule();
    return id;
  };
  window.cancelAnimationFrame = id => callbacks.delete(id);
})();

