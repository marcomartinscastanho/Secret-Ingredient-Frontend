import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";

interface Props {
  id: string;
}

interface State {
  recipes: RecipeOutputDto[];
  isLoaded: boolean;
  error: string;
}

export class Ingredient extends Component<RouteComponentProps<Props>, State> {
  state: State = { recipes: [], isLoaded: false, error: "" };

  componentDidMount() {
    fetch("http://localhost:19061/v1/recipes?ingredientId=" + this.props.match.params.id)
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
          {/** TODO: this should be the name of the ingredient instead of the Id */}
          <h2>Receitas com {this.props.match.params.id}</h2>

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

export default Ingredient;
