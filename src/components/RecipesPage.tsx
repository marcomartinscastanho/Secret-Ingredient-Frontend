import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

type RecipeDto = {
  id: string;
  title: string;
};

export class RecipesPage extends Component {
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
            <li key={recipe.id}>
              <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

export default RecipesPage;
