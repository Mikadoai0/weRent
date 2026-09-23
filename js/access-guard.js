(() => {
  const pendingKey = 'weRent_pendingRoute';

  function isRegistered() {
    return Boolean(window.weRentStore?.get('currentUser', null));
  }

  function requestRegistration(route) {
    window.weRentStore?.set(pendingKey, route);
    window.location.hash = 'auth-signup';
  }

  function guardRoute() {
    const route = window.location.hash.slice(1) || 'home';
    if (isRegistered() || !(route === 'properties' || route.startsWith('properties?') || route.startsWith('property/'))) return;
    requestRegistration(route);
  }

  document.addEventListener('click', event => {
    const propertyButton = event.target.closest('[data-property]');
    if (!propertyButton || isRegistered()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestRegistration(`property/${propertyButton.dataset.property}`);
  }, true);

  document.addEventListener('submit', event => {
    if (event.target.id !== 'auth-form') return;
    const pendingRoute = window.weRentStore?.get(pendingKey, null);
    if (!pendingRoute) return;
    setTimeout(() => {
      if (!isRegistered()) return;
      window.weRentStore.set(pendingKey, null);
      window.location.hash = pendingRoute;
    }, 0);
  }, true);

  window.addEventListener('hashchange', guardRoute);
  setTimeout(guardRoute, 0);
})();
