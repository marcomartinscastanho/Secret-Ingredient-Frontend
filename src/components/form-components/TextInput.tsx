import { ChangeEvent } from "react";

interface Props {
  name?: string;
  title?: string;
  value?: string;
  onChange?: (event: ChangeEvent) => void;
  placeholder?: string;
}

export const TextInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        type="text"
        className="form-control"
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default TextInput;
