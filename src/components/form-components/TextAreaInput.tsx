import { ChangeEvent } from "react";

interface Props {
  name?: string;
  title?: string;
  value?: string;
  onChange?: (event: ChangeEvent) => void;
  placeholder?: string;
}

export const TextAreaInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <textarea
        className="form-control"
        id={props.name}
        name={props.name}
        rows={3}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default TextAreaInput;
