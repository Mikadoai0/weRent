(() => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const finishLoading = () => {
    loader.classList.add('is-ready');
    setTimeout(() => loader.remove(), 450);
  };
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading, { once: true });
})();
