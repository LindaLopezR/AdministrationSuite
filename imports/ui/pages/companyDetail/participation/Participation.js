import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Filters } from '/imports/ui/components/form/Filters';
import { useParams } from 'react-router-dom';

import { allLevelsByCompany, businessUnitsByCompany } from '/imports/startup/hooks';
import { callbackError, getObjectFromPeriod,getPositionsByLevel } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';

import TitleSection from '/imports/ui/components/pages/TitleSection';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ParticipationTable from '../../../components/tables/ParticipationTable';

const DEFAULT_FILTERS = {
  period: 'day',
  startDate: null,
  finishDate: null,
  customWeek: '',
  customMonth: '',
  level: 'all'
};

export default Participation = () => {

  const { id } = useParams();

  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);
  const [ conection, setConection ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(false);

  const [ tableLpaData, setTableLpaData ] = useState([]);

  const { loading: loading1, allLevels } = allLevelsByCompany(id);
  const { loading: loading2, allBusiness } = businessUnitsByCompany(id);

  const updateParticipations = (filtersData) => {
    setLoading(true);
  
    const { period, startDate, finishDate, customMonth, customWeek } = filtersData;
    const periodFilter = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);
    const levelFilter = getPositionsByLevel(filtersData.level);

    const areasByBU = allBusiness.map(businessUnit => {
      return {
        bu: businessUnit.name,
        areasIds: businessUnit.areas
      }
    });

    // Reset
    setData([]);

    const ddpConnection = conection;
  
    ddpConnection.connection.call('participationByAreaAndShift', periodFilter, areasByBU, filters.level, levelFilter, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        result.companyAreas = allBusiness;
        result.company = ddpConnection.company;
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
      checkForConnection(conection, updateParticipations(filters))
    }
  }, [ conection ]);

  useEffect(() => {
    if (Object.values(data).length) {
      setTableLpaData(data);
      setData([]);
      setLoading(false);
    }
  }, [ data ]);

  const updateFilters = (dataFilter) => {
    setFilters(dataFilter);
    setLoading(true);
    updateParticipations(dataFilter);
  }

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Participación"
        subtitle={id}
        back={true}
      />
      <section>
        <Row>
          <Filters
            filters={filters}
            handleFilter={(filters) => updateFilters(filters)}
            levels={allLevels}
          />

          <Col md={12}>
            <Card>
              <Card.Body>
                <ParticipationTable
                  data={tableLpaData}
                  companyData={conection}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};
