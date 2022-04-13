import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

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
