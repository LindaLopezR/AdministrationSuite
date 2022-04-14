import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { BusinessUnitsCollection } from '../api/businessUnits';
import { LevelsCollection } from '../api/levelsUnits';

export const useAccount = () => useTracker(() => {

  const roleSubscription = Meteor.subscribe('rolesBySelfUser');

  const user = Meteor.user();
  const userId = Meteor.userId();
  const isLoggingIn = Meteor.loggingIn();
  const role = Roles.getRolesForUser(userId);

  return {
    user,
    role,
    userId,
    isLoggingIn,
    isLoggedIn: !!userId,
    loading: !roleSubscription.ready(),
  };
}, []);

export const allLevelsByCompany = (company) => useTracker(() => {
  const levelsSubscription = Meteor.subscribe('allLevelsByCompany', company);
  const loading = !levelsSubscription.ready();

  return {
    allLevels: LevelsCollection.find().fetch(),
    loading,
  }
}, [company]);

export const businessUnitsByCompany = (company) => useTracker(() => {
  const businessSubscription = Meteor.subscribe('allLevelsByCompany', company);
  const loading = !businessSubscription.ready();

  return {
    allBusiness: BusinessUnitsCollection.find().fetch(),
    loading,
  }
}, [company]);
