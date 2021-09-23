import { RouteComponentProps } from "react-router";

type Props = RouteComponentProps<{
  id: string;
}>;

export const Tag = (props: Props) => {
  return <h2>Etiqueta {props.match.params.id}</h2>;
};

export default Tag;
