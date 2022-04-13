import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
});
