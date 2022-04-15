import { faClock, faFile, faImage, faMapPin, faNoteSticky, faVideo, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
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
  console.log('ERROR ', error)
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

export const getIconDoc = (data) => {
  let type = getTypeFromUrl(data);
  switch(type){
    case 0 :
      return faImage;
    case 1 :
      return faVolumeHigh;
    case 5 :
      return faClock;
    case 6 :
      return faNoteSticky;
    case 7 :
      return faVideo;
    case 8 :
      return faMapPin;
    default :
      return faFile;
  }
};

export const getTypeDoc = (data) => {
  let type = getTypeFromUrl(data);
  switch(type){
    case 0 :
      return 'Foto';
    case 1 :
      return 'Audio';
    case 5 :
      return 'Tiempo';
    case 6 :
      return 'Nota';
    case 7 :
      return 'Video';
    case 8 :
      return 'GPS';
    default :
      return `N/A ${type}`;
  }
};

export const getDataDoc = (data) => {
  let type = getTypeFromUrl(data);
  switch(type){
    case 0 :
      return `<a href="${data}" target="_blank"><img class="img-detail" src="${data}"></a>`;
    case 1 :
      return `<a href="${data}">${data}</a>`;
    case 5 :
      return `${data} TAPi18n.__('seconds')`;
    case 6 :
      return data;
    case 7 :
      return `<video class="rounded image" width="170px" height="120px" controls><source src="${data}"></video>`;
    case 8 :
      return `<a href="${data}" target="_blank"><img class="ui small image" src="${data}/assets/img/mapa-09.png"></a>`;
    default :
      return 'N/A';
  }
};

function getTypeFromUrl(data) {
	if (data.startsWith('{') && data.endsWith('}')) {
		return 8;
	}
	if (data.endsWith('jpg') || data.endsWith('png')) {
		return 0;
	}
	if (data.endsWith('mp4') || data.endsWith('webm')) {
		return 7;
	}
	if (data.indexOf(':') > -1) {
		return 5;
	}
	else {
		return 6;
	}
}
