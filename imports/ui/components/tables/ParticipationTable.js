import React from 'react';
import { faTable } from '@fortawesome/free-solid-svg-icons';

import NoData from '/imports/ui/components/noData/NoData';

export default ParticipationTable = props => {

  const { data, companyData } = props;

  const getPercentageLabel = () => {
    return '(Plan por mes) Mínimo 10% Operadores';
  }

  return (
    <>
      {data && data.length
        ? <Table striped bordered hover>
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
            </tbody>
          </Table>
        : <NoData title="Sin datos por mostrar" icon={faTable} />}
    </>
  );
};
