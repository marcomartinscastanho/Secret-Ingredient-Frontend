import jwtDecode from "jwt-decode";
import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";
import { Jwt } from "../types/jwt.interface";
import { Alert, Props as AlertProps } from "./ui-components/alert";

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
  alert: AlertProps;
}

export class Tag extends Component<Props, State> {
  state: State = {
    recipes: [],
    isLoaded: false,
    error: "",
    alert: { type: "d-none", message: "" },
  };

  componentDidMount() {
    if (!this.props.jwt) {
      this.setState({
        alert: { type: "alert-danger", message: "Precisa de se registar para ver as receitas!" },
        isLoaded: true,
      });
      return;
    }

    const { id } = this.props.match.params;
    const jwt = jwtDecode<Jwt>(this.props.jwt);
    const userId = jwt.sub;

    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch(`http://localhost:19061/v1/recipes?tagId=${id}&userId=${userId}`, {
      headers,
    })
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
    const { recipes, isLoaded, error, alert } = this.state;
    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          {/** TODO: this should be the name of the tag instead of the Id */}
          <h2>Receitas com Etiqueta "{this.props.match.params.id}"</h2>
          <hr />

          <Alert type={alert.type} message={alert.message} />

          <div className="list-group">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipe/${recipe.id}`}
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

export default Tag;
