import React, { Component, Fragment } from "react";
import { RouteComponentProps, RouteProps } from "react-router";
import { RecipeDto } from "../types/dtos.type";

type Props = RouteComponentProps<{
  id: string;
}>;

interface State {
  recipe: RecipeDto;
  isLoaded: boolean;
}

export class Recipe extends Component<Props, State> {
  state: State = {
    recipe: {
      id: "",
      title: "",
      tags: [],
      cookingTime: 0,
      preparationTime: 0,
      ingredients: [],
      preparationSteps: [],
      user: "",
    },
    isLoaded: false,
  };

  componentDidMount() {
    this.setState({
      recipe: {
        id: this.props.match.params.id,
        title: "Some recipe",
        tags: [],
        cookingTime: 45,
        preparationTime: 10,
        ingredients: [],
        preparationSteps: [],
        user: "",
      },
    });
  }

  render() {
    return (
      <Fragment>
        <h2>{this.state.recipe.title}</h2>
        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Título:</strong>
              </td>
              <td>{this.state.recipe.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Tempo de cozedura:</strong>
              </td>
              <td>{this.state.recipe.cookingTime}</td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
}

export default Recipe;
