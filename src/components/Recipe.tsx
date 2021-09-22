import React, { Component, Fragment } from "react";
import { RouteComponentProps, RouteProps } from "react-router";
import { RecipeDto } from "../types/dtos.type";

type Props = RouteComponentProps<{
  id: string;
}>;

interface State {
  recipe: RecipeDto;
  isLoaded: boolean;
  error: string;
}

export class Recipe extends Component<Props, State> {
  state: State = {
    recipe: {
      id: "",
      title: "",
      portions: 0,
      tags: [],
      description: "",
      cookingTime: 0,
      preparationTime: 0,
      ingredients: [],
      preparationSteps: [],
      user: "",
    },
    isLoaded: false,
    error: "",
  };

  componentDidMount() {
    fetch("http://localhost:19061/v1/recipes/" + this.props.match.params.id)
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: RecipeDto) => {
        this.setState({
          recipe: jsonRes,
          isLoaded: true,
        });
      });
  }

  render() {
    const { recipe, isLoaded, error } = this.state;

    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>{recipe.title}</h2>

          <div className="float-start">
            <small>{recipe.portions} porções</small>
          </div>
          <div className="float-end">
            {recipe.tags.map((tag, index) => (
              <span className="badge bg-secondary me-1" key={index}>
                {tag.name}
              </span>
            ))}
          </div>
          <div className="clearfix"></div>
          <hr />

          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              <tr>
                <td>
                  <strong>Descrição</strong>
                </td>
                <td>{recipe.description}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tempo de preparação</strong>
                </td>
                <td>{recipe.preparationTime}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tempo de cozedura</strong>
                </td>
                <td>{recipe.cookingTime}</td>
              </tr>
            </tbody>
          </table>

          <h3>Ingredientes</h3>
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              {recipe.ingredients.map((recipeIngredient, index) => (
                <tr key={index}>
                  <td>
                    {recipeIngredient.quantity} de{" "}
                    <strong>{recipeIngredient.ingredient.name}</strong>{" "}
                    {recipeIngredient.specification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Preparação</h3>
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              {recipe.preparationSteps.map((step, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{step}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      );
    }
  }
}

export default Recipe;
