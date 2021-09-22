import React, { Component, Fragment } from "react";
import { RouteComponentProps, RouteProps } from "react-router";
import { RecipeDto } from "../types/RecipeDto.type";

type Props = RouteComponentProps<{
  id: string;
}>;

interface State {
  recipe: RecipeDto;
}

export class Recipe extends Component<Props, State> {
  //   state = {
  //     recipe: {
  //       id: "",
  //       title: "",
  //       cookingTime: 0,
  //     },
  //   };

  componentDidMount() {
    this.setState({
      recipe: {
        id: this.props.match.params.id,
        title: "Some recipe",
        cookingTime: 45,
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
                <strong>Cooking Time:</strong>
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
