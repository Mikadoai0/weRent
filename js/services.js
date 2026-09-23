// API-ready service boundaries. Replace these local adapters with fetch calls later.
window.weRentServices = {
  propertyService: {
    getProperties: () => window.weRentProperties || [],
    getPropertyById: id => (window.weRentProperties || []).find(property => property.id === id)
  },
  applicationService: {
    getCurrent: () => window.weRentStore?.get('application', null),
    save: application => window.weRentStore?.set('application', application)
  },
  paymentService: {
    getTransaction: () => window.weRentStore?.get('transaction', null),
    createTransaction: transaction => window.weRentStore?.set('transaction', transaction)
  },
  userService: {
    getCurrent: () => window.weRentStore?.get('currentUser', null),
    saveProfile: profile => window.weRentStore?.set('profile', profile)
  }
};
