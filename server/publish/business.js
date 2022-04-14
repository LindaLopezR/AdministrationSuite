import { BusinessUnitsCollection } from '/imports/api/businessUnits';

Meteor.publish({

  businessUnitsByCompany(company) {
    return BusinessUnitsCollection.find({ company });
  },

  businessUnitsById(businessId) {
    return BusinessUnitsCollection.find({ _id: businessId });
  },
  
});
