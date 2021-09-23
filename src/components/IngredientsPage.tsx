import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { IngredientDto } from "../types/dtos.type";

interface State {
  ingredients: IngredientDto[];
  isLoaded: boolean;
  error: string;
}

export class IngredientsPage extends Component<{}, State> {
  state: State = { ingredients: [], isLoaded: false, error: "" };

  componentDidMount() {
    fetch("http://localhost:19061/v1/ingredients")
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: IngredientDto[] }) => {
        this.setState({
          ingredients: jsonRes.data,
          isLoaded: true,
        });
      });
  }

  render() {
    const { ingredients, isLoaded, error } = this.state;
    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>Ingredientes</h2>

          <div className="list-group">
            {ingredients.map((ingredient) => (
              <Link
                to={`/ingredients/${ingredient.id}`}
                className="list-group-item list-group-item-action"
              >
                {ingredient.name}
              </Link>
            ))}
          </div>
        </Fragment>
      );
    }
  }
}

export default IngredientsPage;
