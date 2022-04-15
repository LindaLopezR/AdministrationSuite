import React from 'react';
import { Col, Row, } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default Problems = props => {

  const { id } = useParams();

  return (
    <>
      <TitleSection
        title="Hallazgos"
        subtitle={id}
        back={true}
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
