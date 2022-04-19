import React from 'react';
import { Card, Col } from 'react-bootstrap';

export default CardBusiness = props => {
  const { business, handleAction = () => {}, averageAction, itemSelect, key } = props;
  const styleItem = itemSelect == business.name && 'bkg-teal text-light';

  return (
    <Col
      key={key}
      xs={6}
      md={3}
      className="mb-3 text-center"
    >
      <Card
        className={`card-business ${styleItem}`}
        onClick={handleAction}
      >
        <Card.Body>
          <h5>{business.name}</h5>
          <h6 className="mb-0">{averageAction}%</h6>
        </Card.Body>
      </Card>
    </Col>
  );
};
