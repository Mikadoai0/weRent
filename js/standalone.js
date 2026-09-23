(() => {
  const money = value => `₦${Number(value).toLocaleString('en-NG')}`;
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
  const propertyView = property => `<header class="site-header"><a class="brand" href="#home"><span class="brand-mark"><span>w</span></span><span>weRent</span></a><a class="btn btn-outline btn-small" href="#properties">Back to properties</a></header><main class="section"><div class="section-heading"><div><div class="overline">Property details</div><h2>${escapeHtml(property.title)}</h2><p>${escapeHtml(property.location)}</p></div><span class="badge badge-verified">${property.verified ? '✓ Verified listing' : 'Under review'}</span></div><div class="split-band section" style="padding:0;background:transparent"><div class="editorial-image"><img src="${property.image}" alt="${escapeHtml(property.title)}"></div><div><span class="price">${money(property.price)} / year</span><div class="property-meta"><span>▦ ${property.beds} bedrooms</span><span>⌂ ${property.baths} bathrooms</span></div><div class="payment-summary"><div class="payment-row"><span>Property owner</span><strong>${escapeHtml(property.owner)}</strong></div><div class="payment-row"><span>Assigned agent</span><strong>${escapeHtml(property.agent)}</strong></div><div class="payment-row"><span>Caution fee recipient</span><strong style="color:var(--green)">Assigned Agent</strong></div></div><div class="callout"><strong>Clear roles, clearer renting.</strong>The landlord owns the property. The assigned agent receives and manages the caution fee.</div><div class="modal-actions" style="justify-content:flex-start"><a class="btn btn-primary" href="#properties">Apply from marketplace</a></div></div></div></main>`;
  function renderStandalone() {
    const route = location.hash.slice(1);
    if (!route.startsWith('property/')) return;
    const property = (window.weRentProperties || []).find(item => item.id === route.split('/')[1]);
    if (property) document.getElementById('app').innerHTML = propertyView(property);
  }
  window.addEventListener('hashchange', renderStandalone);
  renderStandalone();
})();
