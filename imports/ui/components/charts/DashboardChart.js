import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

import { indicatorsChart, indicatorsParticipation } from '../form/Indicators';

import NoData from '/imports/ui/components/noData/NoData';

const getColorParticipationMexico = function(result) {
  if (result == '---') {
    return 'bkg-no-data';
  }

  const item = result === '---' ? '---' : parseInt(result);
  if (item <= 3) {
    return 'bkg-danger text-light';
  }
  if ((item > 3) && (item < 5)) {
    return 'bkg-warning';
  }
  if (item > 5 || item == '---') {
    return 'bkg-success text-light';
  }
}

const getColorParticipationUsa = function(result) {
  if (result == '---') {
    return 'bkg-no-data';
  }

  const item = result === '---' ? '---' : parseInt(result);
  if (item <= 3) {
    return 'bkg-danger text-light';
  }
  if ((item > 3) && (item < 10)) {
    return 'bkg-warning';
  }
  if (item > 10 || item == '---') {
    return 'bkg-success text-light';
  }
}

const getColorGeneral = function(result) {
  if (result == '---') {
    return 'bkg-no-data';
  }

  const item = result === '---' ? '---' : parseInt(result);
  if (item <= 60) {
    return 'bkg-danger text-light';
  }
  if ((item >= 61) && (item <= 80)) {
    return 'bkg-warning';
  }
  if (item >= 81 || item == '---') {
    return 'bkg-success text-light';
  }
}

export default DashboardChart = (props) => {

  const { title, showChart, companyData, labelInfo } = props;

  const getColor = (data) => {
    if (data.isParticipation && data.country == 'mexico') {
      return getColorParticipationMexico(data.result);
    } else if (data.isParticipation && data.country == 'usa') {
      return getColorParticipationUsa(data.result);
    }
    return getColorGeneral(data.result);
  }

  return (
    <>
      <h5>{title}</h5>
      {showChart
        ? <>
            <Row>
              {labelInfo == 'General'
                ? <Col xs={12}>{indicatorsChart(labelInfo)}</Col>
                : indicatorsParticipation(labelInfo)
              }
            </Row>
            <Row className="mt-3">
              {companyData.map((item, index) => (
                <Col xs={3} key={`card-${index}`}>
                  <a href={item.link} className='card-char-dashboard'>
                    <Card className={`${getColor(item)}`}>
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
