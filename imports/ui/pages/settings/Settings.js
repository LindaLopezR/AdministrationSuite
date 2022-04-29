import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import TitleSection from '/imports/ui/components/pages/TitleSection';

export default Settings = () => {

  const [ companies, getCompanies ] = useState([]);

  const getDataCompanies = () => {
    const allCompanies =  Meteor.settings.public.companies || [];

    return allCompanies;
  }

  useEffect(() => {
    const tempCompanies = getDataCompanies();
    getCompanies(tempCompanies);
  }, []);

  return (
    <>
      <TitleSection title="Configuración" />
      <section>
        <Row>
          {companies.length && companies.map(company => (
            <Col md={3} sm={6}>
              <a
                href={`/settingsCompany/${company.company}`}
                className="card-char-dashboard"
              >
                <Card className="card-general mb-3 p-2">
                  <Card.Body>
                    <Card.Title className="text-center mb-0">
                      {company.company}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </section>
    </>
  )
}
