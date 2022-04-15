import moment from 'moment';

export const getMethodNameByTableName = function(tableName) {
  switch(tableName) {
    case 'complianceByUsers':
      return 'swf_detail_complianceByProp';
    case 'complianceByAudits':
      return 'swf_detail_complianceByProp';

    case 'onTimeByUsers':
      return 'swf_detail_onTimeByProp';
    case 'onTimeByAudits':
      return 'swf_detail_onTimeByProp';

    case 'scoreByAudits':
      return 'swf_detail_score';

    default:
      return;
  }
};

export const getPropNameByTableName = function(tableName) {
  switch(tableName) {
    case 'complianceByUsers':
      return 'userId';
    case 'complianceByAudits':
      return 'auditId';

    case 'onTimeByUsers':
      return 'userId';
    case 'onTimeByAudits':
      return 'auditId';

    case 'scoreByAudits':
      return 'auditId';

    default:
      return;
  }
};

export const getParamNameByTableName = function(tableName) {
  switch(tableName) {
    case 'complianceByUsers':
      return 'user';
    case 'complianceByAudits':
      return 'gembaWalk';

    case 'onTimeByUsers':
      return 'user';
    case 'onTimeByAudits':
      return 'gembaWalk';

    case 'scoreByAudits':
      return 'gembaWalk';

    default:
      return;
  }
};

export const getProcessorByTableName = function(tableName) {
  switch(tableName) {
    case 'complianceByUsers':
      return getDataComplianceByAudit;
    case 'complianceByAudits':
      return getDataComplianceByAudit;

    case 'onTimeByUsers':
      return getDataOnTimeByAudit;
    case 'onTimeByAudits':
      return getDataOnTimeByAudit;

    case 'scoreByAudits':
      return getDataScoreByAudit;

    default:
      return;
  }
};

const getDataComplianceByAudit = function(data) {
  return data.map(row => {
    return {
      audit: row._audit,
      startDate: `${moment(row.startDate).format('MMM/DD/YYYY hh:mm')}`,
      completeDate: row.isComplete? `${moment(row.completeDate).format('MMM/DD/YYYY hh:mm')}`:'--',
      finishDate: `${moment(row.finishDate).format('MMM/DD/YYYY hh:mm')}`,
      done: row.isComplete? 'YES': 'NO'
    }
  });
}

const getDataOnTimeByAudit = function(data) {
  return data.map(row => {
    return {
      audit: row._audit,
      startDate: `${moment(row.startDate).format('MMM/DD/YYYY hh:mm')}`,
      completeDate: row.isComplete? `${moment(row.completeDate).format('MMM/DD/YYYY hh:mm')}`:'--',
      finishDate: `${moment(row.finishDate).format('MMM/DD/YYYY hh:mm')}`,
      deadLine: `${moment(row.deadLine).format('MMM/DD/YYYY hh:mm')}`,
      onTime: row.onTime? 'YES': 'NO'
    }
  });
}

const getDataScoreByAudit = function(data, url) {
  return data.map(row => {
    return {
      historyId: row._id,
      audit: row._audit,
      startDate: `${moment(row.startDate).format('MMM/DD/YYYY hh:mm')}`,
      completeDate: row.isComplete? `${moment(row.completeDate).format('MMM/DD/YYYY hh:mm')}`:'--',
      score: row._score,
      url,
    }
  });
}