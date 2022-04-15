import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default GenericTables = props => {
  const { data, type } = props;

  return (
    <Card>
      <Card.Body>
        <Table>
          <thead className="text-center">
            <tr>
              <th>Auditoria</th>
              <th>Fecha de inicio</th>
              <th>Fecha de finalización</th>
              {type == 'onTime' && <th>Fecha puntual</th>}
              {type !== 'score' && <th>Fecha de vencimiento</th>}
              {type == 'compliance' && <th>Realizado</th>}
              {type == 'onTime' && <td>A tiempo</td>}
              {type == 'score' && <th>Calificación</th>}
              {type == 'score' && <th>Detalle</th>}
            </tr>
          </thead>
          <tbody className="text-center">
            {data.map((item, index) => (
              <tr key={`item-${index}`}>
                <td>{item.audit}</td>
                <td>{item.startDate}</td>
                <td>{item.completeDate}</td>
                {type == 'onTime' && <td>{item.deadLine}</td>}
                {type !== 'score' && <td>{item.finishDate}</td>}
                {type == 'compliance' &&<td>{item.done}</td>}
                {type == 'onTime' && <td>{item.onTime}</td>}
                {type == 'score' && <td>{item.score}</td>}
                {type == 'score' && <td>
                  <a href={`/auditReport/${item.company}/${item.historyId}`} target="_blank">
                    <FontAwesomeIcon icon={faEye} />
                  </a>
                </td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
