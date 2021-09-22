import React, { Component, Fragment } from "react";

type RecipeDto = {
  id: string;
  title: string;
};

export class Recipes extends Component {
  state = { recipes: [] };

  componentDidMount() {
    this.setState({
      recipes: [
        { id: 1, title: "Chili com carne" },
        { id: 2, title: "Pataniscas de bacalhau" },
        { id: 3, title: "Arroz de feijão" },
      ],
    });
  }

  render() {
    return (
      <Fragment>
        <h2>Receitas</h2>
        <ul>
          {this.state.recipes.map((recipe: RecipeDto) => (
            <li key={recipe.id}>{recipe.title}</li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default Recipes;
