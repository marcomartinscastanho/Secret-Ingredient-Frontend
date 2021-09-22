import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { RecipeDto } from "../types/dtos.type";

interface State {
  recipes: RecipeDto[];
  isLoaded: boolean;
  error: string;
}

export class RecipesPage extends Component<{}, State> {
  state: State = { recipes: [], isLoaded: false, error: "" };

  componentDidMount() {
    fetch("http://localhost:19061/v1/recipes")
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: RecipeDto[] }) => {
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
          <h2>Receitas</h2>
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
              </li>
            ))}
          </ul>
        </Fragment>
      );
    }
  }
}

export default RecipesPage;
