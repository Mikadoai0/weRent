(() => {
  const states = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT Abuja'];
  const listingInfo = {
    'WR-1048': { state: 'Oyo', whatsapp: '2348030001048', lat: 7.3775, lng: 3.9470 },
    'WR-1052': { state: 'Lagos', whatsapp: '2348030001052', lat: 6.4474, lng: 3.4723 },
    'WR-1061': { state: 'FCT Abuja', whatsapp: '2348030001061', lat: 9.0765, lng: 7.3986 },
    'WR-1074': { state: 'Rivers', whatsapp: '2348030001074', lat: 4.8156, lng: 7.0498 },
    'WR-1080': { state: 'Edo', whatsapp: '2348030001080', lat: 6.3350, lng: 5.6037 },
    'WR-1088': { state: 'Lagos', whatsapp: '2348030001088', lat: 6.6018, lng: 3.3515 }
  };
  const stateSearchTerms = { Oyo: 'Ibadan', Lagos: 'Lagos', 'FCT Abuja': 'Abuja', Rivers: 'Port Harcourt', Edo: 'Benin City' };

  function properties() {
    return [...(window.weRentProperties || []), ...(window.weRentStore?.get('managedProperties', []) || [])];
  }

  function info(property) {
    return { ...(listingInfo[property.id] || {}), state: property.state || listingInfo[property.id]?.state || 'Lagos', whatsapp: property.whatsapp || listingInfo[property.id]?.whatsapp || '2348030000000', lat: property.lat || listingInfo[property.id]?.lat || 6.5244, lng: property.lng || listingInfo[property.id]?.lng || 3.3792 };
  }

  function stateOptions(selected = '') {
    return `<option value="">All states</option>${states.map(state => `<option value="${state}" ${selected === state ? 'selected' : ''}>${state}</option>`).join('')}`;
  }

  function addSearchControls(form) {
    if (!form || form.dataset.enhanced === 'true') return;
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const locationInput = form.querySelector('[name="location"]');
    if (locationInput) locationInput.insertAdjacentHTML('afterend', `<select name="state" class="state-filter" aria-label="Select state">${stateOptions(params.get('state') || '')}</select>`);
    const submit = form.querySelector('button[type="submit"]');
    submit?.insertAdjacentHTML('beforebegin', `<input name="minPrice" class="price-filter" type="number" min="0" step="50000" value="${params.get('minPrice') || ''}" placeholder="Min price (₦)" aria-label="Minimum annual rent"><input name="maxPrice" class="price-filter" type="number" min="0" step="50000" value="${params.get('maxPrice') || ''}" placeholder="Max price (₦)" aria-label="Maximum annual rent">`);
    form.dataset.enhanced = 'true';
    form.classList.add('marketplace-filter-enhanced');
  }

  function queryFromForm(form) {
    const data = new FormData(form);
    const state = data.get('state') || '';
    const location = stateSearchTerms[state] || data.get('location') || '';
    const params = new URLSearchParams({ location: state || location, state, type: data.get('type') || '', budget: data.get('budget') || '', minPrice: data.get('minPrice') || '', maxPrice: data.get('maxPrice') || '' });
    return `properties?${params.toString()}`;
  }

  function addListingActions() {
    document.querySelectorAll('.property-card').forEach(card => {
      if (card.querySelector('.listing-actions')) return;
      const button = card.querySelector('[data-property]');
      const property = properties().find(item => item.id === button?.dataset.property);
      if (!property) return;
      const details = info(property);
      const message = encodeURIComponent(`Hi, I am interested in ${property.title} (${property.location}) on weRent.`);
      card.querySelector('.property-body')?.insertAdjacentHTML('beforeend', `<div class="listing-actions"><a class="btn btn-whatsapp btn-small" href="https://wa.me/${details.whatsapp}?text=${message}" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-map btn-small" href="https://www.openstreetmap.org/?mlat=${details.lat}&mlon=${details.lng}#map=15/${details.lat}/${details.lng}" target="_blank" rel="noopener">View map</a></div>`);
    });
  }

  function applyPriceFilter() {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const min = Number(params.get('minPrice') || 0);
    const max = Number(params.get('maxPrice') || 0);
    if (!min && !max) return;
    let visible = 0;
    document.querySelectorAll('#property-results .property-card').forEach(card => {
      const property = properties().find(item => item.id === card.querySelector('[data-property]')?.dataset.property);
      const matches = property && property.price >= min && (!max || property.price <= max);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    const resultCopy = document.getElementById('results-copy');
    if (resultCopy) resultCopy.textContent = `${visible} homes match your search`;
  }

  function addDetailActions(property) {
    const actions = document.querySelector('.modal .modal-actions');
    if (!actions || actions.querySelector('.property-contact-actions')) return;
    const details = info(property);
    const message = encodeURIComponent(`Hi, I am interested in ${property.title} (${property.location}) on weRent.`);
    actions.insertAdjacentHTML('beforebegin', `<div class="property-contact-actions"><a class="btn btn-whatsapp btn-small" href="https://wa.me/${details.whatsapp}?text=${message}" target="_blank" rel="noopener">Message on WhatsApp</a><a class="btn btn-map btn-small" href="https://www.openstreetmap.org/?mlat=${details.lat}&mlon=${details.lng}#map=15/${details.lat}/${details.lng}" target="_blank" rel="noopener">Open live location</a></div>`);
  }

  function enhance() {
    addSearchControls(document.getElementById('hero-search'));
    addSearchControls(document.getElementById('filter-form'));
    addListingActions();
    applyPriceFilter();
  }

  document.addEventListener('submit', event => {
    if (!['hero-search', 'filter-form'].includes(event.target.id)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.hash = queryFromForm(event.target);
  }, true);

  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-property]');
    if (!viewButton) return;
    setTimeout(() => { enhance(); const property = properties().find(item => item.id === viewButton.dataset.property); if (property) addDetailActions(property); }, 0);
  }, true);

  window.addEventListener('hashchange', () => setTimeout(enhance, 0));
  setTimeout(enhance, 0);
})();
