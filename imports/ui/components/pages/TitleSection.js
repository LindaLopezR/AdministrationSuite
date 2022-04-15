import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default TitleSection = props => {
  const { back = false, title, subtitle } = props;
  const navigate = useNavigate();

  const colTitle = back ? 9 : 12;

  return (
    <>
      <Row>
        <Col xs={colTitle}>
          <h5 className="mb-0">{title}</h5>
          {subtitle && (
            <h5 className="mb-0">
              <small>{subtitle}</small>
            </h5>
          )}
        </Col>
        {back && (
          <Col xs={3} className="text-end">
            <Button
              variant="outline-secondary"
              className="mt-1"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
              Atrás
            </Button>
          </Col>
        )}
      </Row>
      <hr className="mt-0" />
    </>
  );
};
