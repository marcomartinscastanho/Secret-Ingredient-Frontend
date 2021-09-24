import React, { Component, Fragment } from "react";
import { RecipeDto } from "../types/dtos.type";
import "./EditRecipe.css";

interface State {
  recipe: RecipeDto;
  isLoaded: boolean;
  error: string;
}

export class EditRecipe extends Component {
  state: State = {
    recipe: {
      id: "",
      title: "",
      portions: 0,
      tags: [],
      description: "",
      cookingTime: 0,
      preparationTime: 0,
      ingredients: [
        { quantity: "", ingredient: { id: "", name: "", popularity: 0 }, specification: "" },
      ],
      preparationSteps: [""],
      user: "",
    },
    isLoaded: false,
    error: "",
  };

  componentDidMount() {
    // this.setState({
    //   recipe: { title: "Pataniscas de Bacalhau" },
    // });
  }

  render() {
    const { recipe } = this.state;

    return (
      <Fragment>
        <h2>Adicionar/Editar Receita</h2>
        <hr />

        <form method="post">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Título
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={recipe.title}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descrição
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows={3}
              value={recipe.description}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ingredients" className="form-label">
              Ingredientes
            </label>
            {recipe.ingredients.map((recipeIngredient, index) => (
              <div className="row mb-3">
                <div className="col-sm-2">
                  <input
                    type="text"
                    className="form-control"
                    id={`ingredientQuantity${index}`}
                    name={`ingredientQuantity${index}`}
                    value={recipeIngredient.quantity}
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center justify-content-center">de</div>
                <div className="col-sm-4">
                  <select
                    className="form-select"
                    id={`ingredient${index}`}
                    name={`ingredient${index}`}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    id={`ingredientSpec${index}`}
                    name={`ingredientSpec${index}`}
                    value={recipeIngredient.specification}
                  />
                </div>
              </div>
            ))}
            <div className="text-end">
              <button className="btn btn-primary">
                <strong>+</strong>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="preparation" className="form-label">
              Preparação
            </label>
            {recipe.preparationSteps.map((preparationStep, index) => (
              <div className="row mb-3">
                <div className="col-sm-1 d-flex align-items-center justify-content-center">
                  {index + 1}
                </div>
                <div className="col-sm-11">
                  <textarea
                    className="form-control"
                    id={`preparation${index}`}
                    name={`preparation${index}`}
                    rows={2}
                    value={preparationStep}
                  />
                </div>
              </div>
            ))}
            <div className="text-end">
              <button className="btn btn-primary">
                <strong>+</strong>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="preparationTime" className="form-label">
              Tempo de Preparação
            </label>
            <input
              type="number"
              className="form-control"
              id="preparationTime"
              name="preparationTime"
              value={recipe.preparationTime}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cookingTime" className="form-label">
              Tempo de Cozedura
            </label>
            <input
              type="number"
              className="form-control"
              id="cookingTime"
              name="cookingTime"
              value={recipe.cookingTime}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="portions" className="form-label">
              Porções
            </label>
            <input
              type="number"
              className="form-control"
              id="portions"
              name="portions"
              value={recipe.portions}
            />
          </div>

          <div className="mb-5">
            <label htmlFor="tags" className="form-label">
              Etiquetas
            </label>
            <select multiple className="form-select" id="tags" name="tags">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
            </select>
          </div>

          <hr />

          <button className="btn btn-primary mb-5">Guardar</button>
        </form>
      </Fragment>
    );
  }
}

export default EditRecipe;
