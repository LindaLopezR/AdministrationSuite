import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Filters } from '/imports/ui/components/form/Filters';
import { useNavigate, useParams } from 'react-router-dom';

import { callbackError, getObjectFromPeriod } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';
import { indicatorsScore } from '/imports/ui/components/form/Indicators';

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

const headerAudits = ['Audit', 'User assigned', 'Audits', 'Average', 'Detail'];

export default Score = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);
  const [ conection, setConection ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ selectedAreas, setSelectedAreas ] = useState([]);
  const [ tableByAudits, setTableByAudits] = useState([]);

  const updateDataScore = (filtersData) => {
    setLoading(true);
  
    const { period, startDate, finishDate, customMonth, customWeek } = filtersData;
    const periodFilter = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);
  
    // Reset
    setData([]);
  
    //Filter
    const filter = Object.assign({}, periodFilter);
    const ddpConnection = conection;
  
    ddpConnection.connection.call('swf_general_score', filter, true, function(error, result) {
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
      checkForConnection(conection, updateDataScore(filters))
    }
  }, [ conection ]);

  useEffect(() => {
    if (Object.values(data).length) {
      getDataFromResult();
    }
  }, [ data ]);

  const getDataFromResult = function(template) {
    const { sortedByAudit } = data;
  
    let dataAuditsFilterd = sortedByAudit;
  
    if (selectedAreas && selectedAreas.length > 0) {
      dataAuditsFilterd = dataAuditsFilterd.filter(row => {
        return selectedAreas.includes(row._areaId);
      });
    }
  
    const toTableAudits = dataAuditsFilterd.map(row => {
      return {
        _id: row.auditId,
        name: row._audit,
        user: row._user,
        average: row.average,
        auditId: row.auditId,
        allCount: row.allCount,
      }
    });

    setTableByAudits(toTableAudits);
    setLoading(false);
  };

  const updateFilters = (data) => {
    setFilters(data);
    setLoading(true);
    updateDataScore(data);
  }

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Promedio de Hallazgos"
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
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={8}>
                    <h5>Por auditorias</h5>
                  </Col>
                  <Col xs={4} className="text-end">
                    <Button
                      variant="outline-teal"
                      size="sm"
                      onClick={() => navigate(`/problems/${id}`)}
                    >
                      Ver tablas y gráficas
                    </Button>
                  </Col>
                  <hr className="mt-1" />
                  <Col xs={12} className="mb-2 d-flex justify-content-end">
                    {indicatorsScore()}
                  </Col>
                </Row>
                <ContentTable
                  id="scoreByAudits"
                  company={id}
                  data={tableByAudits}
                  headers={headerAudits}
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
