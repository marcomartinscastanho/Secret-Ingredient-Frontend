import { FormatListNumbered, Timer } from "@mui/icons-material";
import { Link } from "react-router-dom";

export interface Props {
  id: string;
  title: string;
  description: string;
  preparationSteps: number;
  preparationTime: number;
}

export const RecipeCard = (props: Props) => {
  return (
    <div className="col card border-light px-0 me-3" style={{ maxWidth: "18rem" }}>
      <div className="card-header">
        <Link to={`/recipe/${props.id}`} className="link-dark text-decoration-none card-title">
          <h5>{props.title}</h5>
        </Link>
      </div>
      <div className="card-body">
        <p className="card-text text-muted">{cap(props.description, 140)}</p>
      </div>
      <div className="card-footer bg-transparent">
        <div className="text-muted d-flex align-items-center justify-content-around">
          <small>
            <FormatListNumbered className="me-2" />
            {props.preparationSteps} passos
          </small>
          <small>
            <Timer className="me-2" />
            {props.preparationTime} minutos
          </small>
        </div>
      </div>
    </div>
  );
};

const cap = (str: string, c: number) => {
  if (str.length > c) {
    return str.substring(0, c - 3) + "...";
  } else {
    return str;
  }
};

export default RecipeCard;
