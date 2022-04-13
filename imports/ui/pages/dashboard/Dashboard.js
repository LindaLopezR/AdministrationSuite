import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { DDP } from 'meteor/ddp-client';
import DatePicker from 'react-datepicker';

import { 
  renderCountries, renderMonths, renderOptions, renderWeeks 
} from '/imports/ui/components/form/formUtils';

import { ParticipationsCollection } from '/imports/api/participations';

import DashboardChart from '/imports/ui/components/charts/DashboardChart';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import { getObjectFromPeriod } from '../utilities/utilities';

const DEFAULT_FILTERS = {
  country: 'all',
  company: 'all',
  period: 'day',
  startDate: null,
  finishDate: null,
  customWeek: '',
  customMonth: '',
};

const allCompanies = Meteor.settings.public.companies || [];

function getDataToParticipation(participation) {
  if (!participation) return 0;
  return participation.buData.reduce((prev, current) => {
    return prev + (current.currentHead1) + (current.currentHead2)
  }, 0);
}

export default Dashboard = () => {

  const [ loading, setLoading ] = useState(false);
  const [ filters, setFilters ] = useState(DEFAULT_FILTERS);

  const [ auditCompliance, setAuditCompliance ] = useState([]);
  const [ auditOnTime, setAuditOnTime ] = useState([]);
  const [ auditScore, setAuditScore ] = useState([]);
  const [ participation, setParticipation ] = useState([]);
  const [ connectionDdp, setDdpConnection ] = useState(null);

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
          let auditData = auditCompliance;
          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
          };
          auditData.push(data);
          setAuditCompliance(auditData);
        }
      });

      // Audit on time
      ddpConnection.connection.call('swf_general_onTimeCompletion', filter, function(error, result){
        if (error) {
          return console.log('Error ', error);
        } else if (result) {
          let auditsOnTimeComplition = auditOnTime;
  
          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
          };
          auditsOnTimeComplition.push(data);
          setAuditOnTime(auditsOnTimeComplition);
        }
      });

      // Score
      ddpConnection.connection.call('swf_general_score', filter, function(error, result) {
        if (error) {
          return console.log('Error ', error, ddpConnection.company);
        } else if (result) {
          let auditsScoreAverage = auditScore

          const data = {
            result: isNaN(result.average)? '---': result.average,
            company: ddpConnection.company,
            name: ddpConnection.company,
            id: ddpConnection.company,
            link: `/companyDetail/score/${ddpConnection.company}`
          };
          auditsScoreAverage.push(data);
          setAuditScore(auditsScoreAverage);
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
          let participationAverage = participation;
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
          setParticipation(participationAverage);
        }
      });
    });

    setLoading(false);

    return;
  }

  const generateConnections = function() {
    const allowedClients = allCompanies.filter(client => client);
    const ddpConnections = allowedClients.map(client => {
      const connection = DDP.connect(client.url)
      return {
        connection,
        company: client.company,
        country: client.country,
      };
    });

    setDdpConnection(ddpConnections);
  }
  
  const checkForAllConnections = function() {
    const ddpConnections = connectionDdp;
    const allStatus = ddpConnections.map(ddpConnection => {
      return ddpConnection.connection.status().status;
    });

    const noConnected = allStatus.filter(status => status != 'connected');
    if (noConnected.length > 0) {
      setTimeout(() => {
        checkForAllConnections();
      }, 500);
    } else {
      // Ya se conecto
      console.log('Ya se conecto a todas');
      updateDashboard(true);
    }
  }

  useEffect(() => {
    generateConnections();
    updateDashboard(true);
  }, []);

  useEffect(() => {
    if (connectionDdp) {
      checkForAllConnections();
    }
  }, [ connectionDdp ]);

  useEffect(() => {
    console.log('// ', auditCompliance);
  }, [ auditCompliance, auditOnTime ]);

  const onChange = (key, newValue) => {
    const newData = Object.assign({}, filters);
    newData[key] = newValue;
    setFilters(newData);
  }

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
      <Row>
        <Col md={12}>
          <h4>Dashboard</h4> 
        </Col>
      </Row>
      <section>
        <Row>
          <Col md={12}>
            <Card className="mb-3">
              <Card.Body>
                <Form>
                  <Row>
                    <Form.Group as={Col} className="mb-3" controlId="country">
                      <Form.Label>País</Form.Label>
                      <Form.Select
                        size="sm"
                        aria-label="País"
                        value={filters.country}
                        onChange={e => onChange('country', e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderCountries()}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="company">
                      <Form.Label>Compañía</Form.Label>
                      <Form.Select
                        size="sm"
                        aria-label="Compañía"
                        value={filters.company}
                        onChange={e => onChange('company', e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions([])}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="period">
                      <Form.Label>Periodo de tiempo</Form.Label>
                      <Form.Select
                        size="sm"
                        aria-label="time"
                        value={filters.period}
                        onChange={e => onChange('period', e.target.value)}
                      >
                        <option value="day">Hoy</option>
                        <option value="week">Esta semana</option>
                        <option value="month">Este mes</option>
                        <option value="customWeek">Semana del año</option>
                        <option value="customMonth">Mes del año</option>
                        <option value="custom">Fecha personalizada</option>
                      </Form.Select>
                    </Form.Group>
                    {filters.period == 'customWeek' && (
                      <Form.Group as={Col} controlId="customWeek">
                        <Form.Label>Semana</Form.Label>
                        <Form.Select
                          size="sm"
                          aria-label="Semana"
                          value={filters.customWeek}
                          onChange={e => onChange('customWeek', e.target.value)}
                        >
                          {renderWeeks()}
                        </Form.Select>
                      </Form.Group>
                    )}
                    {filters.period == 'customMonth' && (
                      <Form.Group as={Col} controlId="customMonth">
                        <Form.Label>Mes</Form.Label>
                        <Form.Select
                          size="sm"
                          aria-label="Semana"
                          value={filters.customMonth}
                          onChange={e => onChange('customMonth', e.target.value)}
                        >
                          {renderMonths()}
                        </Form.Select>
                      </Form.Group>
                    )}
                    {filters.period == 'custom' && (
                      <>
                        <Form.Group as={Col} controlId="startDate">
                          <Form.Label>Empieza</Form.Label>
                          <DatePicker
                            size="sm"
                            dateFormat="dd/MM/yyyy"
                            className="form-select input-calendar"
                            onChange={date => onChange(date)}
                            selected={filters.startDate}
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="endDate">
                          <Form.Label>Termina</Form.Label>
                          <DatePicker
                            size="sm"
                            dateFormat="dd/MM/yyyy"
                            className="form-select input-calendar"
                            onChange={date => onChange(date)}
                            selected={filters.finishDate}
                          />
                        </Form.Group>
                      </>
                    )}
                    <Col md={2}>
                      <Button
                        size="sm"
                        variant="primary"
                        className="btn-100 mt-0 mt-md-4"
                        onClick={updateDashboard}
                      >
                        Actualizar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <DashboardChart
                  title="Auditorias Completadas"
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
