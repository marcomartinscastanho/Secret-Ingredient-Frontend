import { ChangeEvent } from "react";

interface Props {
  steps: string[];
  onChangeStep: (event: ChangeEvent, index: number) => void;
  placeholder?: string;
}

export const PreparationStepsInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor="preparation" className="form-label">
        Preparação
      </label>
      {props.steps.map((step, index) => (
        <div className="row mb-2">
          <div className="col-sm-1 d-flex align-items-center justify-content-center">
            {index + 1}
          </div>
          <div className="col-sm-11">
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
        </div>
      ))}
    </div>
  );
};

export default PreparationStepsInput;
