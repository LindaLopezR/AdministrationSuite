import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

import { 
  checkForConnection, generateConnection
} from '/imports/ui/pages/utilities/ddp';
import { 
  callbackError, getObjectFromPeriod 
} from '/imports/ui/pages/utilities/utilities';

import { 
  getMethodNameByTableName, getParamNameByTableName, 
  getProcessorByTableName, getPropNameByTableName 
} from '/imports/ui/pages/utilities/genericTable';

import GenericTables from '/imports/ui/components/tables/GenericTables';
import NoData from '/imports/ui/components/noData/NoData';

export default TableDetail = () => {

  const { state } = useLocation();
  const { company, filters, prop, type } = state;

  const [ conection, setConection ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ data, setData ] = useState([]);
  const [ tableData, setTableData ] = useState([]);

  const updateData = () => {
    setLoading(true);

    const { period, startDate, finishDate, customMonth, customWeek } = filters;
    const filtersData = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);
    const methodName = getMethodNameByTableName(type);
    const propName = getPropNameByTableName(type);
    const propValue = prop[propName];
    const paramName = getParamNameByTableName(type);
    const proccessor = getProcessorByTableName(type);
    const ddpConnection = conection;

    ddpConnection.connection.call(methodName, filtersData, paramName, propValue, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        let finalData = proccessor(result, ddpConnection.url);
        finalData = finalData.map(data => {
          data.company = company;
          return data;
        });
        setData(finalData);
      }
    });
  };

  useEffect(() => {
    const connection = generateConnection(company);
    setConection(connection);
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, updateData(filters));
    }
  }, [ conection ]);

  useEffect(() => {
    if (data) {
      setTableData(data);
      setLoading(false);
    }
  }, [ data ]);

  const getTableType = () => {
    switch(type) {
      case 'complianceByUsers':
        return <GenericTables data={tableData} type="compliance" />;
      case 'complianceByAudits':
        return <GenericTables data={tableData} type="compliance" />;

      case 'onTimeByUsers':
        return <GenericTables data={tableData} type="onTime" />;
      case 'onTimeByAudits':
        return <GenericTables data={tableData} type="onTime" />;

      case 'scoreByAudits':
        return <GenericTables data={tableData} type="score" />;

      default:
        return;
    };
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Detalle del facility"
        subtitle={company}
        back={true}
      />
      <section>
        <Row>
          <Col xs={12}>
            {tableData && tableData.length
              ? getTableType()
              : <NoData title="Sin datos por mostrar" icon={faTable} />
            }
          </Col>
        </Row>
      </section>
    </>
  );
};
