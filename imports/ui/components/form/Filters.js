import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import { 
  renderCountries, renderMonths, renderOptions, renderWeeks 
} from '/imports/ui/components/form/formUtils';

const clients = Meteor.settings.public.companies || [];

export const Filters = (props) => {

  const { filters, handleFilter = () => {}, levels, business } = props;
  const [ country, setCountry ] = useState('all');
  const [ company, setCompany ] = useState('all');
  const [ period, setPeriod ] = useState('day');
  const [ customWeek, setCustomWeek ] = useState('');
  const [ customMonth, setCustomMonth ] = useState('');
  const [ startDate, setStartDate ] = useState(null);
  const [ finishDate, setFinishDate ] = useState(null);
  const [ levelSelect, setLevelSelect ] = useState('all');
  const [ businessSelect, setBusinessSelect ] = useState('all');
  const [ allCompanies, setAllCompanies ] = useState(clients);

  useEffect(() => {
    if (filters) {
      setCountry(filters.country);
      setCompany(filters.company);
      setPeriod(filters.period);
      setCustomWeek(filters.customWeek);
      setCustomMonth(filters.customMonth);
      setStartDate(filters.startDate);
      setFinishDate(filters.finishDate);
      setLevelSelect(filters.level);
      setBusinessSelect(filters.business);
    }
  }, []);

  useEffect(() => {
    let allSelected = Meteor.settings.public.companies || [];
    let filteredCompanies = allSelected;
    if (country !== 'all') {
      filteredCompanies = allSelected.filter(company => company.country == country);
    }
    setAllCompanies(filteredCompanies);
  }, [ country ]);

  const onSubmit = () => {
    const filtersSubmit = {
      country,
      company,
      period,
      customWeek,
      customMonth,
      startDate,
      finishDate,
      level: levelSelect,
      business: businessSelect
    };

    return handleFilter(filtersSubmit);
  }

  return (
    <Col md={12}>
      <Card className="mb-3">
        <Card.Body>
          <Form>
            <Row>
              {filters.country &&
                <Form.Group as={Col} className="mb-3" controlId="country">
                  <Form.Label>País</Form.Label>
                  <Form.Select
                    size="sm"
                    aria-label="País"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {renderCountries()}
                  </Form.Select>
                </Form.Group>
              }
              {filters.company && 
                <Form.Group as={Col} className="mb-3" controlId="company">
                  <Form.Label>Compañía</Form.Label>
                  <Form.Select
                    size="sm"
                    aria-label="Compañía"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {Object.values(allCompanies).map((value, i) => (
                      <option key={`company-${i}`} value={value.company}>{value.company}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              }
              <Form.Group as={Col} className="mb-3" controlId="period">
                <Form.Label>Periodo de tiempo</Form.Label>
                <Form.Select
                  size="sm"
                  aria-label="time"
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                >
                  <option value="day">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="customWeek">Semana del año</option>
                  <option value="customMonth">Mes del año</option>
                  <option value="custom">Fecha personalizada</option>
                </Form.Select>
              </Form.Group>
              {period == 'customWeek' && (
                <Form.Group as={Col} controlId="customWeek">
                  <Form.Label>Semana</Form.Label>
                  <Form.Select
                    size="sm"
                    aria-label="Semana"
                    value={customWeek}
                    onChange={e => setCustomWeek(e.target.value)}
                  >
                    {renderWeeks()}
                  </Form.Select>
                </Form.Group>
              )}
              {period == 'customMonth' && (
                <Form.Group as={Col} controlId="customMonth">
                  <Form.Label>Mes</Form.Label>
                  <Form.Select
                    size="sm"
                    aria-label="Semana"
                    value={customMonth}
                    onChange={e => setCustomMonth(e.target.value)}
                  >
                    {renderMonths()}
                  </Form.Select>
                </Form.Group>
              )}
              {period == 'custom' && (
                <>
                  <Form.Group as={Col} controlId="startDate">
                    <Form.Label>Empieza</Form.Label>
                    <DatePicker
                      size="sm"
                      dateFormat="dd/MM/yyyy"
                      className="form-select input-calendar"
                      onChange={date => setStartDate(date)}
                      selected={startDate}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="endDate">
                    <Form.Label>Termina</Form.Label>
                    <DatePicker
                      size="sm"
                      dateFormat="dd/MM/yyyy"
                      className="form-select input-calendar"
                      onChange={date => setFinishDate(date)}
                      selected={finishDate}
                    />
                  </Form.Group>
                </>
              )}
              {filters.level && (
                <Form.Group as={Col} controlId="level">
                  <Form.Label>Nivel</Form.Label>
                  <Form.Select
                    size="sm"
                    aria-label="Level"
                    value={levelSelect}
                    onChange={e => setLevelSelect(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    {renderOptions(levels)}
                  </Form.Select>
                </Form.Group>
              )}
              {filters.business && (
                <Form.Group as={Col} controlId="business">
                <Form.Label>Unidad de negocio</Form.Label>
                <Form.Select
                  size="sm"
                  aria-label="Business"
                  value={businessSelect}
                  onChange={e => setBusinessSelect(e.target.value)}
                >
                  <option value="all">Todos</option>
                  {renderOptions(business)}
                </Form.Select>
              </Form.Group>
              )}
              <Col md={2}>
                <Button
                  size="sm"
                  variant="primary"
                  className="btn-100 mt-0 mt-md-4"
                  onClick={onSubmit}
                >
                  Actualizar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  )
}