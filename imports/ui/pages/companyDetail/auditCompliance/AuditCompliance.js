import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Filters } from '/imports/ui/components/form/Filters';
import { useParams } from 'react-router-dom';

import { businessUnitsByCompany } from '/imports/startup/hooks';
import { callbackError, getObjectFromPeriod } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';

import TitleSection from '/imports/ui/components/pages/TitleSection';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import CardBusiness from '/imports/ui/components/charts/CardBusiness';
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
  const [ business, setBusiness ] = useState([{ name: 'General' }]);
  const [ itemSelect, setItemSelect ] = useState('General');

  const { loading: loading2, allBusiness } = businessUnitsByCompany(id);

  const updateDataAudit = (filtersData) => {
    setLoading(true);
  
    const { period, startDate, finishDate, customMonth, customWeek } = filtersData;
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

    if (allBusiness && allBusiness.length) {
      const newData = [...business, allBusiness];
      setBusiness(newData);
    }
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, updateDataAudit(filters))
    }
  }, [ conection ]);

  useEffect(() => {
    if (Object.values(data).length) {
      getDataFromResult();
    }
  }, [ data ]);

  const getDataFromResult = function() {
    const { sortedByAudit, sortedByUser } = data;
  
    let dataUsersFiltered = sortedByUser;
    let dataAuditsFilter = sortedByAudit;
  
    if (selectedAreas.length > 0) {
      dataUsersFiltered = dataUsersFiltered.filter(row => {
        return selectedAreas.includes(row._areaId);
      });
  
      dataAuditsFilter = dataAuditsFilter.filter(row => {
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
  
    const toTableAudits = dataAuditsFilter.map(row => {
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

  const updateFilters = (dataFilter) => {
    setFilters(dataFilter);
    setLoading(true);
    updateDataAudit(dataFilter);
  }

  const getAreaAverage = (item) => {
    const result = data;

    if (!result) {
      return '--';
    }

    const { average, sortedByAudit, sortedByUser } = result;

    if (item.name == 'General') {
      return average;
    }

    const selectedAreas = item.areas;
    let dataAuditsFilter = sortedByAudit;
    if (selectedAreas && selectedAreas.length > 0) {
      dataAuditsFilter = dataAuditsFilter.filter(row => {
        return selectedAreas.includes(row._areaId);
      });
    }

    if (dataAuditsFilter.length == 0) {
      return '--';
    }

    const totalAverage = dataAuditsFilter.reduce((prev, current) => {
      return prev + current.average;
    }, 0);

    return Math.round( totalAverage / dataAuditsFilter.length);
  }

  const selectedBusiness = (item) => {
    setItemSelect(item.name);
    setSelectedAreas(item.areas);
    getDataFromResult();
  }

  const renderBusiness = () => {
    return business && business.length &&
      business.map((item, index) => <CardBusiness 
        business={item}
        key={`business-${index}`}
        averageAction={getAreaAverage(item)}
        handleAction={() => selectedBusiness(item)}
        itemSelect={itemSelect}
      />
    )
  }

  if (loading || loading2) {
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

          <Col md={12}>
            <Row>
              {renderBusiness()}
            </Row>
          </Col>

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
                  filters={filters}
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
                  filters={filters}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};
