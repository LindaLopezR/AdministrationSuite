import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Filters } from '/imports/ui/components/form/Filters';
import { useParams } from 'react-router-dom';

import { callbackError, getObjectFromPeriod } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';

import TitleSection from '/imports/ui/components/pages/TitleSection';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ContentTable from '/imports/ui/components/tables/ContentTable';

const DEFAULT_FILTERS = {
  period: 'day',
  startDate: null,
  finishDate: null,
  customWeek: '',
  customMonth: '',
};

const headerUsers = ['User', 'Done / Total', 'Average', 'Detail'];
const headerAudits = ['Audit', 'Done / Total', 'Average', 'Detail'];

export default AuditCompliance = () => {

  const { id } = useParams();

  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);
  const [ conection, setConection ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ selectedAreas, setSelectedAreas ] = useState([]);
  const [ tableByUsers, setTableByUsers ] = useState([]);
  const [ tableByAudits, setTableByAudits] = useState([]);

  const updateDashboard = () => {
    setLoading(true);
  
    const { period, startDate, finishDate, customMonth, customWeek } = filters;
    const periodFilter = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);
  
    // Reset
    setData([]);
  
    //Filter
    const filter = Object.assign({}, periodFilter);
    const ddpConnection = conection;
  
    ddpConnection.connection.call('swf_general_compliance', filter, true, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        setData(result);
      }
    });
  };

  useEffect(() => {
    const connection = generateConnection(id);
    setConection(connection);
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, updateDashboard())
    }
  }, [ conection ]);

  useEffect(() => {
    if (Object.values(data).length) {
      getDataFromResult();
    }
  }, [ data ]);

  const getDataFromResult = function(template) {
    const { sortedByAudit, sortedByUser } = data;
  
    let dataUsersFiltered = sortedByUser;
    let dataAuditsFilterd = sortedByAudit;
  
    if (selectedAreas.length > 0) {
      dataUsersFiltered = dataUsersFiltered.filter(row => {
        return selectedAreas.includes(row._areaId);
      });
  
      dataAuditsFilterd = dataAuditsFilterd.filter(row => {
        return selectedAreas.includes(row._areaId);
      });
    }
  
    const toTableUsers = dataUsersFiltered.map(row => {
      return {
        name: row._user,
        average: row.average,
        userId: row.userId,
        meetRequirementCount: row.meetRequirementCount,
        allCount: row.allCount,
      }
    });
  
    const toTableAudits = dataAuditsFilterd.map(row => {
      return {
        name: row._audit,
        average: row.average,
        auditId: row.auditId,
        meetRequirementCount: row.meetRequirementCount,
        allCount: row.allCount,
      }
    });

    setTableByUsers(toTableUsers);
    setTableByAudits(toTableAudits);
    setLoading(false);
  };

  const updateFilters = (data) => {
    setFilters(data);
    setLoading(true);
    updateDashboard();
  }

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Auditorias Completadas"
        subtitle={id}
        back={true}
      />
      <section>
        <Row>
          <Filters
            filters={filters}
            handleFilter={(filters) => updateFilters(filters)}
          />

          <Col md={6}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <h5>Por auditorias</h5>
                  </Col>
                  <hr className="mt-1" />
                </Row>
                <ContentTable
                  id="complianceByAudits"
                  company={id}
                  data={tableByAudits}
                  headers={headerAudits}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mt-3 mt-md-0">
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <h5>Por usuarios</h5>
                  </Col>
                  <hr className="mt-1" />
                </Row>
                <ContentTable
                  id="complianceByUsers"
                  company={id}
                  data={tableByUsers}
                  headers={headerUsers}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};
