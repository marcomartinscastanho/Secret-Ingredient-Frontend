import { ChangeEvent } from "react";

interface Props {
  type: "text" | "email" | "password";
  name: string;
  title?: string;
  value?: string;
  onChange?: (event: ChangeEvent) => void;
  placeholder?: string;
  hasError: boolean;
  errorMessage?: string;
}

export const TextInput = (props: Props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        type={props.type}
        className={`form-control ${props.hasError ? "is-invalid" : ""}`}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <div className={props.hasError ? "text-danger" : "d-none"}>{props.errorMessage}</div>
    </div>
  );
};

export default TextInput;
