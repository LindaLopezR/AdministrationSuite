import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { indicatorsParticipations } from '../form/Indicators';

const defaultItem = [{
  name: '--',
  company: '--',
  currentHeadCount: {
    shift1: '--',
    shift2: '--',
    total: '--',
  },
  planPerMonth: {
    shift1: '--',
    shift2: '--',
    total: '--',
  },
  actual: {
    shift1: '--',
    shift2: '--',
    total: '--',
  },
  results: {
    shift1: '--',
    shift2: '--',
    total: '--',
  }
}
];

export default ParticipationTable = props => {

  const { data, companyData } = props;
  const { areaCount, companyAreas, company } = data;
  const { country  } = companyData;

  const [ participations, getParticipations ] = useState(defaultItem);

  const getUpdateData = () => {
    if (!areaCount || !areaCount.length) {
      return;
    }

    const finalData = areaCount.map(areaData => {
      const { shift1, shift2, area } = areaData;
      const singleBuData = companyAreas.find(businessUnit => {
        return businessUnit.name == area;
      });

      console.log('singleBuData => ', singleBuData);

      const currentHeadCountTotal = singleBuData.shift1 + singleBuData.shift2;
      const actualTotal = shift1 + shift2;

      let resultShift1 = '--';
      if (singleBuData.shift1 > 0) {
        resultShift1  = (shift1 * 100) / singleBuData.shift1;
        resultShift1 = Math.round(resultShift1);
      }

      let resultShift2 = '--';
      if (singleBuData.shift2) {
        resultShift2 = (shift2 * 100) / singleBuData.shift2;
        resultShift2 = Math.round(resultShift2);
      }

      let resultTotal = '--';
      if (currentHeadCountTotal > 0) {
        resultTotal = (actualTotal * 100) / currentHeadCountTotal;
        resultTotal = Math.round(resultTotal);
      }

      const itemToReturn = {
        name: area,
        company,
        currentHeadCount: {
          shift1: singleBuData.shift1,
          shift2: singleBuData.shift2,
          total: currentHeadCountTotal,
        },
        planPerMonth: {
          shift1: Math.ceil( singleBuData.shift1 * minParticipation ),
          shift2: Math.ceil( singleBuData.shift2 * minParticipation ),
          total: Math.ceil( currentHeadCountTotal * minParticipation ),
        },
        actual: {
          shift1,
          shift2,
          total: actualTotal,
        },
        results: {
          shift1: resultShift1,
          shift2: resultShift2,
          total: resultTotal,
        }
      };

      return itemToReturn;
    });

    const lastRow = {
      name: 'Total Plan % Participation',
    };

    lastRow.currentHeadCount = {
      shift1: finalData.reduce((prev, current) => {
        return prev + current.currentHeadCount.shift1;
      }, 0),
      shift2: finalData.reduce((prev, current) => {
        const count = current.currentHeadCount.shift2;
        return prev + (isNaN(count)? 0: count);
      }, 0),
      total: finalData.reduce((prev, current) => {
        const count = current.currentHeadCount.total;
        return prev + (isNaN(count)? 0: count);
      }, 0),
    };

    lastRow.planPerMonth = {
      shift1: Math.round(lastRow.currentHeadCount.shift1 * 0.1),
      shift2: Math.round(lastRow.currentHeadCount.shift2 * 0.1),
      total: Math.round(lastRow.currentHeadCount.total  * 0.1),
    };

    lastRow.actual = {
      shift1: finalData.reduce((prev, current) => {
        return prev + current.actual.shift1;
      }, 0),
      shift2: finalData.reduce((prev, current) => {
        return prev + current.actual.shift2;
      }, 0),
      total: finalData.reduce((prev, current) => {
        return prev + current.actual.total;
      }, 0),
    };

    lastRow.results = {
      shift1: Math.round((lastRow.actual.shift1 * 100) / lastRow.currentHeadCount.shift1),
      shift2: Math.round((lastRow.actual.shift2 * 100) / lastRow.currentHeadCount.shift2),
      total: Math.round((lastRow.actual.total * 100) / lastRow.currentHeadCount.total),
    };

    lastRow.results = {
      shift1: '--',
      shift2: '--',
      total: '--',
    };

    if (lastRow.currentHeadCount.shift1 > 0) {
      lastRow.results.shift1 = Math.round((lastRow.actual.shift1 * 100) / lastRow.currentHeadCount.shift1);
    }

    if (lastRow.currentHeadCount.shift2 > 0) {
      lastRow.results.shift2 = Math.round((lastRow.actual.shift2 * 100) / lastRow.currentHeadCount.shift2);
    }

    if (lastRow.currentHeadCount.total > 0) {
      lastRow.results.total = Math.round((lastRow.actual.total * 100) / lastRow.currentHeadCount.total);
    }

    finalData.push(lastRow);
    return getParticipations(finalData);
  }

  useEffect(() => {
    if (data || data.length || companyAreas.length || areaCount.length) {
      getUpdateData();
    }
  }, [ data ]);

  const getStyle = (data) => {
    const countryData = country || 'usa';
    const bottom = countryData == 'usa' ? 5 : 3;
    const top = countryData == 'usa' ? 10 : 5;

    if (data < bottom) {
      return 'bkg-danger text-light';
    }
    if (data >= bottom && data <= top) {
      return 'bkg-warning';
    }
    if (data > top) {
      return 'bkg-success text-light';
    }
  };


  const countryData = country || 'usa';
  const getTop = countryData == 'usa' ? 10 : 5;
  const getBottom = countryData == 'usa' ? 5: 3;
  const getPercentageLabel = countryData == 'usa'
    ? '(Plan por mes) Mínimo 10% Operadores'
    : '(Plan por mes) Mínimo 5% Operadores';

  return (
    <>
      <Row>
        <Col xs={12} className="mb-2 d-flex justify-content-end">
          {indicatorsParticipations(getTop, getBottom)}
        </Col>
      </Row>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan="2">BU</th>
              <th colSpan="3">Cantidad actual de personal</th>
              <th colSpan="3">{getPercentageLabel}</th>
              <th colSpan="3">Participacion actual de los operadores</th>
              <th colSpan="3">Resultado actual de participación de LPA %</th>
            </tr>
            <tr>
              <th>Primer turno</th>
              <th>Segundo turno</th>
              <th>Total</th>
              <th>Primer turno</th>
              <th>Segundo turno</th>
              <th>Total</th>
              <th>Primer turno HC</th>
              <th>Segundo turno HC</th>
              <th>Total HC</th>
              <th>Primer turno HC</th>
              <th>Segundo turno HC</th>
              <th>Total HC</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {participations.map((area, index) => (
              <tr key={`area-${index}`}>
                <td>{area.name}</td>

                <td>{area.currentHeadCount.shift1}</td>
                <td>{area.currentHeadCount.shift2}</td>
                <td>{area.currentHeadCount.total}</td>

                <td>{area.planPerMonth.shift1}</td>
                <td>{area.planPerMonth.shift2}</td>
                <td>{area.planPerMonth.total}</td>

                <td>{area.actual.shift1}</td>
                <td>{area.actual.shift2}</td>
                <td>{area.actual.total}</td>

                <td className={getStyle(area.results.shift1)}>
                  {area.results.shift1}%
                </td>
                <td className={getStyle(area.results.shift2)}>
                  {area.results.shift2}%
                </td>
                <td className={getStyle(area.results.total)}>
                  {area.results.total}%
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};
