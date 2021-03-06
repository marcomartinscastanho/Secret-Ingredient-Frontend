import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { IngredientOutputDto } from "../types/dtos.type";

interface State {
  ingredients: IngredientOutputDto[];
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
      .then((jsonRes: { data: IngredientOutputDto[] }) => {
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
            {ingredients
              .filter((ingredient) => ingredient.popularity && ingredient.popularity > 0)
              .map((ingredient) => (
                <Link
                  key={ingredient.id}
                  to={`/ingredients/${ingredient.id}`}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  {ingredient.name}
                  <span className="badge bg-secondary rounded-pill">
                    {ingredient.popularity} receita{ingredient.popularity === 1 ? "" : "s"}
                  </span>
                </Link>
              ))}
          </div>
        </Fragment>
      );
    }
  }
}

export default IngredientsPage;
