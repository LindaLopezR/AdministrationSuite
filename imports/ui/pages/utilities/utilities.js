import moment from 'moment';

import { LevelsCollection } from '../../../api/levelsUnits';

export const INIT_VALUE = {
  auditCompliance: [],
  auditOnTime: [],
  auditScore: [],
  participation: [],
};

export const getObjectFromPeriod = (period, selectedWeek, selectedMonth, dateStart, dateEnd) => {
  if (period == 'month') {
    return {
      startDate: moment().startOf('month').toDate(),
      finishDate: moment().endOf('month').toDate(),
    };
  } else if (period == 'week') {
    return {
      startDate: moment().startOf('week').toDate(),
      finishDate: moment().endOf('week').toDate(),
    };
  } else if (period == 'day') {
    return {
      startDate: moment().startOf('day').toDate(),
      finishDate: moment().endOf('day').toDate(),
    };
  } else if (period == 'customWeek') {
    let week = selectedWeek || 0;
    week = Number(week) + 1;
    console.log(`Week => `, week);
    const auxDate = moment().week(week);
    return {
      startDate: moment(auxDate).startOf('week').toDate(),
      finishDate: moment(auxDate).endOf('week').toDate(),
    };
  } else if (period == 'customMonth') {
    let month = selectedMonth || 0;
    console.log(`Month => `, month);
    const auxDate = moment().month(Number(month));
    return {
      startDate: moment(auxDate).startOf('month').toDate(),
      finishDate: moment(auxDate).endOf('month').toDate(),
    };
  } else if (period == 'custom') {
    return {
      startDate: new Date(dateStart),
      finishDate: new Date(dateEnd),
    };
  }

  // Default day
  return {
    startDate: moment().startOf('day').toDate(),
    finishDate: moment().endOf('day').toDate(),
  };
};

export const callbackError = (error) => {
  return alert(`Error, ${error.reason}`);
};

export const getPositionsByLevel = (level) => {
  let positions = [];
  if (level !== 'all') {
    const data = LevelsCollection.findOne({ _id: level });
    positions = data.positions;
  }
  return positions;
};
