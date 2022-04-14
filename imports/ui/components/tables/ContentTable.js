import React from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import NoData from '/imports/ui/components/noData/NoData';

export default ContentTable = props => {

  const { id, company, data, headers } = props;

  const getCardClass = (result) => {
    const item = result === '---' ? '---' : parseInt(result);
    if (item < 100) {
      return 'danger-item c-Whi';
    }
    return 'success-item c-Whi';
  }

  const clickBtnView = (data) => {
    const toNewTable = {
      type: id,
      prop: data,
      company,
    };
    const params = JSON.stringify(toNewTable);
    // window.open(`/tableDetail?params=${params}`);
    console.log('=> ', params);
  }

  const columns = headers.map(item => {
    let fieldName = '';
    switch(item) {
      case 'Audit':
        fieldName = 'name';
        break;
      case 'User':
        fieldName = 'name';
        break;
      case 'Average':
        fieldName = 'average';
        break;
      case 'Detail':
        fieldName = 'detail';
        break;
      case 'On time / Total':
        fieldName = 'meetRequirementCount';
        break;
      case 'Done / Total':
        fieldName = 'meetRequirementCount';
        break;
      case 'Audits':
        fieldName = 'allCount';
        break;
      case 'User assigned':
        fieldName = 'user';
        break;
    }

    return {
      dataField: fieldName,
      text: item,
      formatter: (cell, row) => {
        if (item == 'Average') {
          return (
            <div className={getCardClass(cell, row)}>
              {cell} %
            </div>
          );
        } else if (item == 'Detail') {
          return (
            <a href="" onClick={() => clickBtnView(row)}>
              <i className="eye icon btnView" />
            </a>
          );
        } else if (item == 'On time / Total' || item == 'Done / Total') {
          return `${row.meetRequirementCount} / ${row.allCount}`;
        }
        return cell;
      }
    };
  });

  const finalData = data && data.length
    ? data.map((data, i) => {
      data.key = `item-${i}`;
      return data;
    })
    : [];

  return finalData && finalData.length
    ? <div className="box-body table-responsive tableClient">
        <BootstrapTable
          keyField='key'
          data={ finalData }
          columns={ columns }
          pagination={ paginationFactory() }
          disablePageTitle={ true }
        />
      </div>
    : <NoData title="Sin datos por mostrar" icon={faTable} />;
};
