import React from 'react';
import { Col, Row } from 'react-bootstrap';

export const indicatorsChart = (label, item) => {
  let success = label === 'General' ? '81' : '5';
  let between = label === 'General' ? '61%-80%' : '3%-4.99%';
  let less = label === 'General' ? '60' : '3';

  if (item) {
    success = 10;
    between = '5% - 9.99%';
    less = 5;
  }

  return (
    <div className="indicators-row">
      <p>
        <small>
          <span className="badge-label badge-label-success">&nbsp;</span>
          Igual o mayor que {success}%
        </small>
      </p>
      <p>
        <small>
          <span className="badge-label badge-label-warning">&nbsp;</span>
          Entre {between}
        </small>
      </p>
      <p>
        <small>
          <span className="badge-label badge-label-danger">&nbsp;</span>
          Menos que {less}%
        </small>
      </p>
      <p>
        <small>
          <span className="badge-label badge-label-none">&nbsp;</span>
          Ningún dato
        </small>
      </p>
    </div>
  );
};

export const indicatorsParticipation = (labelInfo) => (
  <>
    <Col xs={12} className="indicators-row">
      <h6>USA</h6>
      <div >
        {indicatorsChart(labelInfo, 'Participation')}
      </div>
    </Col>
    <Col xs={12} className="indicators-row">
      <h6>México</h6>
      <Row className="indicators-row">
        {indicatorsChart(labelInfo)}
      </Row>
    </Col>
  </>
);

export const indicatorsScore = () => (
  <div className="indicators-row">
    <p>
      <small>
        <span className="badge-label badge-label-success">&nbsp;</span>
        Igual a 100%
      </small>
    </p>
    <p>
      <small>
        <span className="badge-label badge-label-danger">&nbsp;</span>
        Menos de 100%
      </small>
    </p>
  </div>
);

export const indicatorsParticipations = (top, bottom) => (
  <div className="indicators-row">
    <p>
      <small>
        <span className="badge-label badge-label-success">&nbsp;</span>
        Igual o mayor que {top}%
      </small>
    </p>
    <p>
      <small>
        <span className="badge-label badge-label-warning">&nbsp;</span>
        Entre {bottom}% - {top}%
      </small>
    </p>
    <p>
      <small>
        <span className="badge-label badge-label-danger">&nbsp;</span>
        Menos que {bottom}%
      </small>
    </p>
  </div>
);
