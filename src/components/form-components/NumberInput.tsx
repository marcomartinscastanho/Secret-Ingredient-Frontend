import { ChangeEvent } from "react";

interface Props {
  name?: string;
  title?: string;
  min?: number;
  max?: number;
  value?: string | number;
  onChange?: (event: ChangeEvent) => void;
  placeholder?: string;
}

export const NumberInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        type="number"
        className="form-control"
        min={props.min}
        max={props.max}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default NumberInput;
