/* Keep frame-based canvas games consistent on 30, 60, and 120 Hz displays. */
(() => {
  const nativeRequest = window.requestAnimationFrame.bind(window);
  const callbacks = new Map();
  const frameMs = 1000 / 60;
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
