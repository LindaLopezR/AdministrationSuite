import React from 'react';
import { Col } from 'react-bootstrap';

export const indicatorsChart = () => {
  return (
    <Col xs={12} className="indicators-row">
      <h4>
        <small>
          <span className="badge-label badge-label-success">&nbsp;</span>
          Igual o mayor que 0%
        </small>
      </h4>
      <h4>
        <small>
          <span className="badge-label badge-label-warning">&nbsp;</span>
          Entre 0%
        </small>
      </h4>
      <h4>
        <small>
          <span className="badge-label badge-label-danger">&nbsp;</span>
          Menos que 0%
        </small>
      </h4>
      <h4>
        <small>
          <span className="badge-label badge-label-none">&nbsp;</span>
          Ningún dato
        </small>
      </h4>
    </Col>
  );
}
