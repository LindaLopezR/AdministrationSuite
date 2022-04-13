import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

import { indicatorsChart } from '../form/Indicators';

import NoData from '/imports/ui/components/noData/NoData';

export default DashboardChart = (props) => {

  const { title, showChart, companyData } = props;

  console.log('DATA => ', props)

  return (
    <>
      <h5>{title}</h5>
      {showChart
        ? <>
            <Row>
              {indicatorsChart()}
            </Row>
            <Row>
              {companyData.map((item, index) => (
                <Col xs={3}>
                  <a href="" key={`card-${index}`}  className="card-char-dashboard">
                    <Card>
                      <Card.Body>
                        <h6>{item.name}</h6>
                        <h5 className="mb-0">{item.result}%</h5>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              ))}
            </Row>
          </>
        : <NoData title="Sin datos por mostrar" icon={faMagnifyingGlassChart} />}
    </>
  );
};
