(() => {
  function addPropertyWithImage() {
    modal(`<div class="modal-header"><div><span class="badge badge-verified">Landlord tools</span><h2 style="margin-top:12px">Add a property</h2></div><button class="modal-close" data-close-modal>×</button></div><form id="property-upload-form"><div class="form-group"><label for="property-upload-title">Property name</label><input id="property-upload-title" name="title" required placeholder="e.g. Garden View Duplex"></div><div class="form-group"><label for="property-upload-location">Location</label><input id="property-upload-location" name="location" required placeholder="Area, city"></div><div class="form-group"><label for="property-upload-type">Property type</label><select id="property-upload-type" name="type"><option>2 Bedroom Apartment</option><option>3 Bedroom Duplex</option><option>Detached House</option><option>Self Contained Apartment</option></select></div><div class="form-group"><label for="property-upload-price">Annual rent (₦)</label><input id="property-upload-price" name="price" type="number" min="1" required placeholder="2500000"></div><div class="form-group"><label for="property-upload-image">Property photo</label><input id="property-upload-image" name="image" type="file" accept="image/*" required><img id="property-upload-preview" class="property-upload-preview" alt="Selected property preview" hidden></div><div class="callout"><strong>Verification reminder</strong>Your listing will appear as under review until the weRent verification process is connected to a backend.</div><div class="modal-actions"><button type="button" class="btn btn-outline" data-close-modal>Cancel</button><button type="submit" class="btn btn-primary">Save property</button></div></form>`);

    const form = document.getElementById('property-upload-form');
    const imageInput = document.getElementById('property-upload-image');
    const preview = document.getElementById('property-upload-preview');
    let imageData = '';

    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        imageData = reader.result;
        preview.src = imageData;
        preview.hidden = false;
      });
      reader.readAsDataURL(file);
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!imageData) return;
      const data = Object.fromEntries(new FormData(form));
      const managed = weRentStore.get('managedProperties', properties.filter(property => property.owner === currentUser()?.name));
      managed.push({
        id: `WR-${Date.now().toString().slice(-5)}`,
        title: data.title,
        location: data.location,
        type: data.type,
        price: Number(data.price),
        beds: Number(data.type[0]) || 1,
        baths: Number(data.type[0]) || 1,
        image: imageData,
        verified: false,
        owner: currentUser()?.name || 'Demo landlord',
        agent: 'Pending assignment',
        active: true
      });
      weRentStore.set('managedProperties', managed);
      closeModal();
      toast('Property submitted for verification.');
      navigate('dashboard/properties');
    });
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-add-property]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    addPropertyWithImage();
  }, true);
})();
