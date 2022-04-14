import { LevelsCollection } from '../../imports/api/levelsUnits';

Meteor.publish({

  allLevelsByCompany(company) {
    return LevelsCollection.find({ company: company });
  }

});