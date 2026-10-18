(() => {
  const selector = '.portfolio-link,.back-button,.control-button,.primary-button,.game-tile,.category-chip,.text-button,.switcher-list a';
  const isControl = target => target instanceof Element && target.closest(selector);
  document.addEventListener('dblclick', event => {
    if (isControl(event.target)) event.preventDefault();
  }, { capture: true });

  document.addEventListener('contextmenu', event => {
    if (isControl(event.target)) event.preventDefault();
  });

})();
