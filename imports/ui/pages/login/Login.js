import React, { useState } from 'react';
import { Button, Card, Form, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';

const version = '1.0.0';

export default Login = () => {

  const [ loading, setLoading ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const navigate = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const onSubmit = data => {

    const { username, password } = data;
    setLoading(true);

    Meteor.loginWithPassword(username, password, error => {

      if (error) {
        setLoading(false);
        setTitleModal('Error');
        const message = error.error === 403 ? 'Usuario no encontrado' : error.reason;
        setMessageModal(message);
        return setShowModal(true);
      }

      navigate('/');
    });
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      <ConfirmModal
        visible={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <Card className="card-login">
        <Card.Body>
          <Form onSubmit={ handleSubmit(onSubmit) }>
            <figure>
              <Image
                src="/img/logo-suite.png"
                decoding="async"
                alt="iGoSuite"
              />
            </figure>
            <Form.Group className="mb-3" controlId="user">
              <Form.Control
                type="text"
                defaultValue=""
                placeholder="Usuario"
                {...register("username")}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                defaultValue=""
                placeholder="Contraseña"
                {...register("password")}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" variant="teal">
                Iniciar sesión
              </Button>
              <h6 className="font-weight-light text-center text-white-50 mt-3">
                Versión {version}
              </h6>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
