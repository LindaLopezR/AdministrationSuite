import React from 'react';
import moment from 'moment';

export const renderCountries = () => {
  const countries = Meteor.settings.public.countries || [];
  
  return countries.map((country, index) => (
    <option
      key={`country-${index}`}
      value={country.key}
    >
      {country.name}
    </option>
  ));
}

export const renderOptions = (collection) => {
  return collection.map((item, index) => (
    <option
      key={`item-${index}`}
      value={item._id ? item._id : item}
    >
      {item.name ? item.name : item}
    </option>
  ));
};

export const renderWeeks = () => {
  const nowWeek = moment().week() - 1;
  const weeks = [];
  for (let i=1; i <= nowWeek; i++) {
    weeks.push(i);
  }
  return renderOptions(weeks);
};

export const renderMonths = () => {
  const monts = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const nowMonth = moment().month();
  const monthsToRender = monts.filter( (month, index) => {
    return index <= nowMonth;
  });

  return monthsToRender.map((month, index) => (
    <option
      key={`item-${index}`}
      value={index}
    >
      {month}
    </option>
  ));
};
