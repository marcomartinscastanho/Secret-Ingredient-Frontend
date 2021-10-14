import { ChangeEvent } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";

interface Props {
  title: string;
  id: string;
  name: string;
  placeholder: string;
  show: boolean;
  value: string;
  handleSave: () => void;
  handleChange: (event: ChangeEvent) => void;
  handleCancel: () => void;
}

export const TextInputModal = (props: Props) => {
  return (
    <Modal show={props.show} onHide={props.handleCancel} centered>
      <Form method="POST">
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <input
              type="text"
              className="form-control"
              id={props.id}
              name={props.name}
              value={props.value}
              onChange={props.handleChange}
              placeholder={props.placeholder}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.handleSave}>
            Criar
          </Button>
          <Button variant="secondary" onClick={props.handleCancel}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
