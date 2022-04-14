import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

Meteor.startup(() => {
  render(<App/>, document.getElementById('react-target'));
});
