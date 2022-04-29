import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faCogs } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { callbackError, getStatus } from '/imports/ui/pages/utilities/utilities';
import { checkForConnection, generateConnection } from '/imports/ui/pages/utilities/ddp';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const INIT_VALUES = {
  status: '',
  modules: {},
  users: 0
};

export default CompanySettings = () => {

  const { id } = useParams();
  const [ conection, setConection ] = useState([]);
  const [ data, setData ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ info, setInfo ] = useState(INIT_VALUES);
  const navigate = useNavigate();

  const dataCompany = () => {
    setLoading(true);

    // Reset
    setData([]);
  
    const ddpConnection = conection;
  
    ddpConnection.connection.call('adminSettings', function(error, result) {
      if (error) callbackError(error);
      if (result) {
        setData(result);
      }
    });
  };

  useEffect(() => {
    const connection = generateConnection(id);
    setConection(connection);
  }, []);

  useEffect(() => {
    if (Object.values(conection).length) {
      checkForConnection(conection, dataCompany());
    }
  }, [ conection ]);

  useEffect(() => {
    if (Object.values(data).length) {
      getDataFromResult();
    }
  }, [ data ]);

  const getDataFromResult = () => {
    const { accountStatus, activeModules, maxUsers } = data;

    const values = {
      status: accountStatus,
      modules: activeModules,
      users: maxUsers
    }

    setLoading(false);
    setInfo(values);
  };

  const inputChange = (key, newValue) => {
    const newData = Object.assign({}, info);
    newData[key] = newValue;
    setInfo(newData);
  };

  const onSubmit = () => {

    if (!info.users) {
      return alert('Error, ingresa la cantidad de usuarios');
    }

    const usersNumber = info.users;

    setLoading(true);
  
    const ddpConnection = conection;
  
    ddpConnection.connection.call('editMaxUsersAllowed', usersNumber, function(error, result) {
      if (error) callbackError(error);
      if (result) {
        navigate(-1);
      }
    });
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <TitleSection
        title="Configuración"
        subtitle={id}
        back={true}
      />
      <section>
        <Card>
          <Card.Body>
            <h6 className="mb-0 title-card mt-3">
              <FontAwesomeIcon icon={faCircleInfo} />{' '}
              Información
            </h6>
            <hr />
            <Row>
              <Col md={6} className="mb-3">
                <h5>Estatus:</h5>
                {getStatus(info.status)}
              </Col>
              <Col md={6} className="mb-3">
                <h5>Módulos activos:</h5>
                <ul>
                  {info.modules && Object.keys(info.modules) &&
                    Object.entries(info.modules).map(([key, value], i) => {
                      if (!value) return;
                      return <li key={`module-${i}`}>{key}</li>
                    })
                  }
                </ul>
              </Col>
            </Row>
            <h6 className="mb-0 title-card">
              <FontAwesomeIcon icon={faCogs} />{' '}
              Configuración
            </h6>
            <hr />
            <Form>
              <Form.Group className="mb-3" controlId="maxUsers">
                <Form.Label>Usuarios máximos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Número de usuarios"
                  value={info.users}
                  onChange={e => inputChange('users', e.target.value)}
                />
              </Form.Group>
              <div className="text-end">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="success"
                  className="ms-2"
                  onClick={onSubmit}
                >
                  Guardar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
       
      </section>
    </>
  )
}
