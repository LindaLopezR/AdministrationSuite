import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { ParticipationsCollection } from '/imports/api/participations';

import { getObjectFromPeriod, INIT_VALUE } from '../utilities/utilities';
import { Filters } from '/imports/ui/components/form/Filters';
import { checkForAllConnections, generateAllConnections } from '../utilities/ddp';

import DashboardChart from '/imports/ui/components/charts/DashboardChart';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const DEFAULT_FILTERS = {
  country: 'all',
  company: 'all',
  period: 'day',
  startDate: null,
  finishDate: null,
  customWeek: '',
  customMonth: '',
};

function getDataToParticipation(participation) {
  if (!participation) return 0;
  return participation.buData.reduce((prev, current) => {
    return prev + (current.currentHead1) + (current.currentHead2)
  }, 0);
}

export default Dashboard = () => {

  const [ loading, setLoading ] = useState(true);
  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);

  const [ auditCompliance, setAuditCompliance ] = useState([]);
  const [ auditOnTime, setAuditOnTime ] = useState([]);
  const [ auditScore, setAuditScore ] = useState([]);
  const [ participation, setParticipation ] = useState([]);
  const [ connectionDdp, setDdpConnection ] = useState([]);
  const [ init, setInit ] = useState(INIT_VALUE);

  const updateDashboard = () => {
    setLoading(true);
    const { 
      country, company, period, startDate, finishDate, customWeek, customMonth
    } = filters;

    // TODO Obtenerlo aqui
    const periodFilter = getObjectFromPeriod(period, customWeek, customMonth, startDate, finishDate);

    let filter = {};
    filter = Object.assign({}, periodFilter);

    let filteredDdpConnections = connectionDdp;

    if (!filteredDdpConnections) {
      return;
    }

    if (company !== 'all') {
      filteredDdpConnections = filteredDdpConnections.filter(ddpConnection => {
        return ddpConnection.company == company;
      });
    }
  
    if (country !== 'all') {
      filteredDdpConnections = filteredDdpConnections.filter(ddpConnection => {
        return ddpConnection.country == country;
      });
    }

    filteredDdpConnections.forEach(ddpConnection => {
      // Audit compliance
      ddpConnection.connection.call('swf_general_compliance', filter, function(error, result){
        if (error) {
          return console.log('Error ', error);
        } else if (result) {
          let auditData = init.auditCompliance;
          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
          };
          auditData.push(data);
          const newData = Object.assign({}, init);
          newData.auditCompliance = auditData;
          setInit(newData);
        }
      });

      // Audit on time
      ddpConnection.connection.call('swf_general_onTimeCompletion', filter, function(error, result){
        if (error) {
          return console.log('Error ', error);
        } else if (result) {
          let auditsOnTimeComplition = init.auditOnTime;
          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
          };
          auditsOnTimeComplition.push(data);
          const newData = Object.assign({}, init);
          newData.auditOnTime = auditsOnTimeComplition;
          setInit(newData);
        }
      });

      // Score
      ddpConnection.connection.call('swf_general_score', filter, function(error, result) {
        if (error) {
          return console.log('Error ', error, ddpConnection.company);
        } else if (result) {
          let auditsScoreAverage = init.auditScore;
          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
            link: `/companyDetail/score/${ddpConnection.company}`
          };
          auditsScoreAverage.push(data);
          const newData = Object.assign({}, init);
          newData.auditScore = auditsScoreAverage;
          setInit(newData);
        }
      });

      const participationObject = ParticipationsCollection.findOne({ company: ddpConnection.company });
      const totalPArticipationByCompany = getDataToParticipation(participationObject);

      // Participation
      ddpConnection.connection.call('participationAverage', filter, totalPArticipationByCompany, function(error, result) {
        if (error) {
          return console.log('Error ', error, ddpConnection.company);
        } else  {
          // Participation
          let participationAverage = init.participation;
          const resultNumber = totalPArticipationByCompany == 0? 0: result;
          const data = {
            result: Math.round(resultNumber),
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
            link: `/companyDetail/${ddpConnection.company}`,
            country: ddpConnection.country,
            isParticipation: true,
          };

          participationAverage.push(data);
          const newData = Object.assign({}, init);
          newData.participation = participationAverage;
          setInit(newData);
        }
      });
    });
  }

  useEffect(() => {
    const dataCheck = generateAllConnections();
    setDdpConnection(dataCheck);
  }, []);

  useEffect(() => {
    if (Object.values(connectionDdp).length) {
      checkForAllConnections(connectionDdp, updateDashboard());
    }
  }, [ connectionDdp ]);

  useEffect(() => {
    if (
      init.auditCompliance.length == Object.values(connectionDdp).length &&
      init.auditOnTime.length == Object.values(connectionDdp).length &&
      init.auditScore.length == Object.values(connectionDdp).length &&
      init.participation.length == Object.values(connectionDdp).length
    ) {
      setAuditCompliance(init.auditCompliance);
      setAuditOnTime(init.auditOnTime);
      setAuditScore(init.auditScore);
      setParticipation(init.participation);

      const old = {
        auditCompliance: [],
        auditOnTime: [],
        auditScore: [],
        participation: [],
      }

      setInit(old);
      setLoading(false);
    }
  }, [ init ]);

  useEffect(() => {
    updateDashboard();
  }, [ filters ]);

  const getData = (data, link) => {
    let chartData = data;
    chartData = chartData.map(item => {
      if(isNaN(item.result)) {
        item.result = '---';
        return item;
      }
      item.result = Math.round(item.result);
      item.link = `${link}${item.company}`;
      return item;
    });

    return chartData.sort(function(a, b){
      if(a.company < b.company) { return -1; }
      if(a.company > b.company) { return 1; }
      return 0;
    });
  }

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection title="Dashboard" />
      <section>
        <Row>
          <Filters
            filters={filters}
            handleFilter={(filters) => setFilters(filters)}
          />
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <DashboardChart
                  title="Auditorias Completadas"
                  labelInfo="General"
                  showChart={auditCompliance.length}
                  companyData={getData(auditCompliance, '/companyDetail/auditCompliance/')}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <DashboardChart
                  title="Auditorias a tiempo"
                  labelInfo="General"
                  showChart={auditOnTime.length}
                  companyData={getData(auditOnTime, '/companyDetail/onTime/')}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <DashboardChart
                  title="Promedio de Hallazgos"
                  labelInfo="General"
                  showChart={auditScore.length}
                  companyData={getData(auditScore, '/companyDetail/score/')}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <DashboardChart
                  title="Participación"
                  labelInfo="Participation"
                  showChart={participation.length}
                  companyData={getData(participation, '/companyDetail/')}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
};
