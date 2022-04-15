import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTable } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import NoData from '/imports/ui/components/noData/NoData';

export default ContentTable = props => {

  const { id, company, data, headers } = props;
  const navigate = useNavigate();

  const clickBtnView = (data) => {
    const toNewTable = {
      type: id,
      prop: data,
      company,
    };

    navigate(`/tableDetail/${company}`, {
      state: toNewTable
    });
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
            <center>
              {cell} %
            </center>
          );
        } else if (item == 'Detail') {
          return (
            <center>
              <a href="" className="text-center" onClick={() => clickBtnView(row)}>
                <FontAwesomeIcon icon={faEye} />
              </a>
            </center>
          );
        } else if (item == 'On time / Total' || item == 'Done / Total') {
          return (
            <center>
              {`${row.meetRequirementCount} / ${row.allCount}`}
            </center>
          );
        }
        return cell;
      },
      headerStyle: () => {
        if (item == 'Audit' || item == 'User') {
          return { width: '45%' };
        }
        if (item == 'Detail') {
          return { width: '15%' };
        }
        return { width: '20%' };
      },
      classes: (cell, row, rowIndex, colIndex) => {
        if (item == 'Average') {
          const item = row.average === '---' ? '---' : parseInt(row.average);
          if (item < 100) {
            return 'bkg-danger text-light';
          }
          return 'bkg-success text-light';
        }

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
