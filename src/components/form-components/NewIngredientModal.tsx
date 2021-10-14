import { ChangeEvent } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  value: string;
  handleSave: () => void;
  handleChange: (event: ChangeEvent) => void;
  handleCancel: () => void;
}

export const NewIngredientModal = (props: Props) => {
  return (
    <Modal show={props.show} onHide={props.handleCancel} centered>
      <Form method="POST">
        <Modal.Header>
          <Modal.Title>Criar novo Ingrediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <input
              type="text"
              className="form-control"
              id="new-ingredient"
              name="newIngredient"
              value={props.value}
              onChange={props.handleChange}
              placeholder="Nome do novo ingrediente"
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
