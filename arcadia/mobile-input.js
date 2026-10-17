(() => {
  const selector = '.portfolio-link,.back-button,.control-button,.primary-button,.game-tile,.category-chip,.text-button,.switcher-list a';
  const isControl = target => target instanceof Element && target.closest(selector);
  let lastTap = 0;

  document.addEventListener('dblclick', event => {
    if (isControl(event.target)) event.preventDefault();
  }, { capture: true });

  document.addEventListener('contextmenu', event => {
    if (isControl(event.target)) event.preventDefault();
  });

  document.addEventListener('touchend', event => {
    if (!isControl(event.target)) return;
    const now = Date.now();
    if (now - lastTap < 300) event.preventDefault();
    lastTap = now;
  }, { passive: false, capture: true });
})();
