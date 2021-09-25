import { ChangeEvent } from "react";

interface Props {
  steps: string[];
  onAddStep: () => void;
  onChangeStep: (event: ChangeEvent, index: number) => void;
  onRemoveStep: (index: number) => void;
  placeholder?: string;
}

export const PreparationStepsInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor="preparation" className="form-label">
        Preparação
      </label>
      {props.steps.map((step, index) => (
        <div className="row mb-3">
          <div className="col-sm-1 d-flex align-items-center justify-content-center">
            {index + 1}
          </div>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              id={`preparation-${index}`}
              name={`preparation-${index}`}
              rows={2}
              key={index}
              value={step}
              onChange={(event) => {
                props.onChangeStep(event, index);
              }}
            />
          </div>
          {index === props.steps.length - 1 && (
            <div className="col-sm-1 d-flex align-items-center justify-content-end">
              <button className="btn btn-primary" onClick={props.onAddStep}>
                <strong>+</strong>
              </button>
            </div>
          )}
          {index < props.steps.length - 1 && (
            <div className="col-sm-1 d-flex align-items-center justify-content-end">
              <button className="btn btn-danger" onClick={() => props.onRemoveStep(index)}>
                <strong>&#10005;</strong>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreparationStepsInput;
