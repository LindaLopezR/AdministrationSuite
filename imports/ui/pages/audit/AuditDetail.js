import React from 'react';
import { Col, Row, } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default AuditDetail = props => {

  const { company, auditId } = useParams();

  return (
    <>
      <TitleSection
        title="Detalle de auditoría"
        subtitle={company}
      />
      <section>
        <Row>
          <Col xs={12}>

          </Col>
        </Row>
      </section>
    </>
  );
}
