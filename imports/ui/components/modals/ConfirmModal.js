import React from 'react';
import { Button, Modal, } from 'react-bootstrap';

export default ConfirmModal = props => {
  const { title = '', message = '', handleClose = () => {}, visible } = props;

  return (
    <Modal
      show={visible}
      onHide={handleClose}
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="action" onClick={handleClose}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};
