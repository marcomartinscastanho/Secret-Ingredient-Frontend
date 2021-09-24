import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import { RecipeDto, RecipeIngredientDto } from "../types/dtos.type";
import "./EditRecipe.css";

interface State {
  recipe: RecipeDto;
  isLoaded: boolean;
  error: string;
}

const newRecipeIngredient = (): RecipeIngredientDto => {
  return Object.create({
    ingredient: { id: "", name: "", popularity: 0 },
    quantity: "",
    specification: "",
  });
};

export class EditRecipe extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      recipe: {
        id: "",
        title: "",
        portions: 0,
        tags: [],
        description: "",
        cookingTime: 0,
        preparationTime: 0,
        ingredients: [newRecipeIngredient()],
        preparationSteps: [""],
        user: "",
      },
      isLoaded: false,
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);

    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);

    this.handleAddPreparationStep = this.handleAddPreparationStep.bind(this);
    this.handleRemovePreparationStep = this.handleRemovePreparationStep.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState((prevState) => ({
      recipe: { ...prevState.recipe, [name]: value },
    }));
  };

  handleAddIngredient = () => {
    const thereAreEmptyIngredients = this.state.recipe.ingredients.some(
      (recipeIngredient) => !recipeIngredient.quantity || !recipeIngredient.ingredient
    );

    // TODO: uncomment this once onIngredientChange is done
    // if (thereAreEmptyIngredients) {
    //   // TODO: handle error: can't add more ingredients while there are empty ingredients
    //   return;
    // }

    this.setState((prevState) => ({
      recipe: {
        ...prevState.recipe,
        ingredients: [...prevState.recipe.ingredients, newRecipeIngredient()],
      },
    }));
  };

  handleRemoveIngredient = (index: number) => {
    this.setState((prevState) => {
      const newIngredients = prevState.recipe.ingredients;
      newIngredients.splice(index, 1);
      return {
        recipe: {
          ...prevState.recipe,
          ingredients: [...newIngredients],
        },
      };
    });
  };

  handleAddPreparationStep = () => {
    const thereAreEmptySteps = this.state.recipe.preparationSteps.some((step) => step.length === 0);

    // TODO: uncomment this once onStepChange is done
    // if (thereAreEmptySteps) {
    //   // TODO: handle error: can't add more preparationSteps while there are empty preparationSteps
    //   return;
    // }

    this.setState((prevState) => ({
      recipe: {
        ...prevState.recipe,
        preparationSteps: [...prevState.recipe.preparationSteps, ""],
      },
    }));
  };

  handleRemovePreparationStep = (index: number) => {
    this.setState((prevState) => {
      const newPreparationSteps = prevState.recipe.preparationSteps;
      newPreparationSteps.splice(index, 1);
      return {
        recipe: {
          ...prevState.recipe,
          preparationSteps: [...newPreparationSteps],
        },
      };
    });
  };

  handleSubmit = (event: any) => {
    console.log("Form was submitted");

    event.preventDefault();
  };

  componentDidMount() {}

  render() {
    const { recipe } = this.state;

    return (
      <Fragment>
        <h2>Adicionar/Editar Receita</h2>
        <hr />

        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" id="id" value={recipe.id} onChange={this.handleChange} />

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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
                    id={`ingredient.quantity-${index}`}
                    name={`quantity`}
                    key={index}
                    value={recipeIngredient.quantity}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center justify-content-center">de</div>
                <div className="col-sm-4">
                  <select
                    className="form-select"
                    id={`ingredient.ingredient-${index}`}
                    name={`ingredient.ingredient-${index}`}
                    key={index}
                    value={recipeIngredient.ingredient.id}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    id={`ingredient.specification-${index}`}
                    name={`specification`}
                    key={index}
                    value={recipeIngredient.specification}
                  />
                </div>
                {index < recipe.ingredients.length - 1 && (
                  <div className="col-sm-1 text-end">
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleRemoveIngredient(index)}
                    >
                      <strong>&#10005;</strong>
                    </button>
                  </div>
                )}
                {index === recipe.ingredients.length - 1 && (
                  <div className="col-sm-1 text-end">
                    <button className="btn btn-primary" onClick={this.handleAddIngredient}>
                      <strong>&#65291;</strong>
                    </button>
                  </div>
                )}
              </div>
            ))}
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
                <div className="col-sm-10">
                  <textarea
                    className="form-control"
                    id={`preparation-${index}`}
                    name={`preparation-${index}`}
                    rows={2}
                    key={index}
                    value={preparationStep}
                  />
                </div>
                {index < recipe.preparationSteps.length - 1 && (
                  <div className="col-sm-1 d-flex align-items-center justify-content-end">
                    <button
                      className="btn btn-danger"
                      onClick={() => this.handleRemovePreparationStep(index)}
                    >
                      <strong>&#10005;</strong>
                    </button>
                  </div>
                )}
                {index === recipe.preparationSteps.length - 1 && (
                  <div className="col-sm-1 d-flex align-items-center justify-content-end">
                    <button className="btn btn-primary" onClick={this.handleAddPreparationStep}>
                      <strong>+</strong>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label htmlFor="preparationTime" className="form-label">
              Tempo de Preparação
            </label>
            <input
              type="number"
              min={0}
              max={60}
              className="form-control"
              id="preparationTime"
              name="preparationTime"
              value={recipe.preparationTime}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cookingTime" className="form-label">
              Tempo de Cozedura
            </label>
            <input
              type="number"
              min={0}
              max={1440}
              className="form-control"
              id="cookingTime"
              name="cookingTime"
              value={recipe.cookingTime}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="portions" className="form-label">
              Porções
            </label>
            <input
              type="number"
              min={0}
              max={20}
              className="form-control"
              id="portions"
              name="portions"
              value={recipe.portions}
              onChange={this.handleChange}
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

          <button className="btn btn-primary">Guardar</button>
        </form>

        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>
      </Fragment>
    );
  }
}

export default EditRecipe;
