import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{
  id: string;
}>;

export const Ingredient = (props: Props) => {
  return <h2>Ingrediente {props.match.params.id}</h2>;
};

export default Ingredient;
