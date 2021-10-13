import React, { Component, Fragment } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";

interface Params {
  id: string;
}

interface ComponentProps {
  jwt?: string;
}

export interface RouteProps extends RouteComponentProps<Params> {}

interface Props extends RouteProps, ComponentProps {}

interface State {
  recipes: RecipeOutputDto[];
  isLoaded: boolean;
  error: string;
}

export class Admin extends Component<Props, State> {
  state: State = { recipes: [], isLoaded: false, error: "" };

  componentDidMount() {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes", { headers })
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: RecipeOutputDto[] }) => {
        this.setState({
          recipes: jsonRes.data,
          isLoaded: true,
        });
      });
  }

  render() {
    const { recipes, isLoaded, error } = this.state;
    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>Editar Receias</h2>
          <div className="list-group">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/edit/${recipe.id}`}
                className="list-group-item list-group-item-action"
              >
                {recipe.title}
              </Link>
            ))}
          </div>
        </Fragment>
      );
    }
  }
}

export default Admin;
