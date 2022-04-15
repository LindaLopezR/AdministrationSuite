import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

import { getDataDoc, getIconDoc, getTypeDoc } from '../utilities/utilities';

import { 
  checkForConnection, generateConnection
} from '/imports/ui/pages/utilities/ddp';
import { callbackError } from '/imports/ui/pages/utilities/utilities';

export default AuditDetail = props => {

  const { company, auditId } = useParams();
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ conection, setConection ] = useState([]);
  const [ tableData, setTableData ] = useState([]);

  const updateData = () => {
    setLoading(true);
    const ddpConnection = conection;
    setData(null);

    ddpConnection.connection.call('history_report_detail', auditId, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        setData(result);
      }
    });
  };

  useEffect(() => {
    const connection = generateConnection(company);
    setConection(connection);
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, updateData());
    }
  }, [ conection ]);

  useEffect(() => {
    if (data) {
      setTableData(data);
      setLoading(false);
    }
  }, [ data ]);
  

  const taskItem = (task, index) => {

    const colorIcon = task.compilance ? '#5AA66B' : '#C9252C';
    const iconTask = task.compilance ? faCheck : faXmark;

    return (
      <div className={`task-${index}`}>
        <h6>
          <FontAwesomeIcon
            icon={iconTask}
            color={colorIcon}
            className="me-2"
          />
          {task.name}
        </h6>
        {task.docs && task.docs.map(doc => {
          <>
            <hr/>
            <FontAwesomeIcon icon={getIconDoc(doc)} />
            <p>{getTypeDoc(doc)}</p>
            <p>{getDataDoc(doc)}</p>
          </>
        })}
        <hr />
      </div>
    )
  };

  const cardItem = (location, index) => (
    <Card key={`location-${index}`}>
      <Card.Body>
        <Row>
          <Col xs={8}>
            <h6>{location.name}</h6>
          </Col>
          <Col xs={4}>
            <h6>{location.score}%</h6>
          </Col>
        </Row>
        {location.description && (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Descripción</Accordion.Header>
              <Accordion.Body>
                {location.description}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        <hr className="mt-1 line-header" />

        {location.skiped && (
          <>
            <h5 className="text-center">Esta ubicación fue omitida</h5>
            <p>
              <strong>Razón:</strong>{' '}
              {location.reason}
            </p>
          </>
        )}

        {location.tasksReports && 
          location.tasksReports.map((task, index) => taskItem(task, index))
        }
      </Card.Body>
    </Card>
  );

  if (loading) {
    return <LoadingView />;
  }

  console.log('sdgs', tableData)

  return (
    <>
      <TitleSection
        title="Detalle de auditoría"
        subtitle={company}
      />
      <section className="section-scroll">
        <div className="page-wrap">
          {tableData &&
            <>
              <Card>
                <Card.Body>
                  <h5>Información general</h5>
                  <hr className="line-header" />
                  <h5>Nombre</h5>
                  <p>{tableData.gembaWalk}</p>
                  <h5>Calificación</h5>
                  <p>{tableData.score}%</p>
                  <h5>Usuario</h5>
                  <p>{tableData.user}</p>
                  <h5>Fecha</h5>
                  <p>{tableData.completeDate}%</p>
                </Card.Body>
              </Card>
    
            {tableData.locationsReports && tableData.locationsReports.length && 
              tableData.locationsReports.map(
                (location, index) => cardItem(location, index))
              }
          </>
          }
        </div>
      </section>
    </>
  );
}
