export interface Props {
  type?: "alert-success" | "alert-warning" | "alert-danger" | "d-none";
  message: string;
}

export const Alert = (props: Props) => {
  return (
    <div className={`alert ${props.type}`} role="alert">
      {props.message}
    </div>
  );
};

export default Alert;
