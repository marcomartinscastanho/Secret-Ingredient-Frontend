import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import {
  IngredientOutputDto,
  RecipeIngredientInputDto,
  RecipeInputDto,
  TagOutputDto,
} from "../types/dtos.type";
import "./EditRecipe.css";

interface State {
  recipe: RecipeInputDto;
  ingredients: IngredientOutputDto[];
  tags: TagOutputDto[];
  isLoaded: boolean;
  error: string;
}

const newRecipeIngredient = (): RecipeIngredientInputDto => {
  return {
    ingredient: "",
    quantity: "",
    specification: "",
  };
};

export class EditRecipe extends Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      recipe: {
        title: "",
        portions: 0,
        tags: [],
        description: "",
        cookingTime: 0,
        preparationTime: 0,
        ingredients: [newRecipeIngredient()],
        preparationSteps: [""],
      },
      ingredients: [],
      tags: [],
      isLoaded: false,
      error: "",
    };

    this.handleChange = this.handleChange.bind(this);

    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleRemoveIngredient = this.handleRemoveIngredient.bind(this);
    this.handleChangeIngredient = this.handleChangeIngredient.bind(this);

    this.handleAddPreparationStep = this.handleAddPreparationStep.bind(this);
    this.handleRemovePreparationStep = this.handleRemovePreparationStep.bind(this);
    this.handleChangePreparationStep = this.handleChangePreparationStep.bind(this);

    this.handleChangeTags = this.handleChangeTags.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event: any) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      recipe: { ...prevState.recipe, [name]: value },
    }));
  };

  handleAddIngredient = () => {
    const thereAreEmptyIngredients = this.state.recipe.ingredients.some(
      (recipeIngredient) => !recipeIngredient.quantity || !recipeIngredient.ingredient
    );

    if (thereAreEmptyIngredients) {
      // TODO: handle error: can't add more ingredients while there are empty ingredients
      return;
    }

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

  handleChangeIngredient = (event: any, index: number) => {
    const { name, value } = event.target;

    const updatedRecipe = { ...this.state.recipe };
    const updatedIngredients = [...updatedRecipe.ingredients];
    const updatedIngredient = updatedIngredients[index];
    updatedIngredients[index] = { ...updatedIngredient, [name]: value };
    updatedRecipe.ingredients = updatedIngredients;
    this.setState({ recipe: updatedRecipe });
  };

  handleAddPreparationStep = () => {
    const thereAreEmptySteps = this.state.recipe.preparationSteps.some((step) => step.length === 0);

    if (thereAreEmptySteps) {
      // TODO: handle error: can't add more preparationSteps while there are empty preparationSteps
      return;
    }

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

  handleChangePreparationStep = (event: any, index: number) => {
    const updatedRecipe = { ...this.state.recipe };
    const updatedSteps = [...updatedRecipe.preparationSteps];
    updatedSteps[index] = event.target.value;
    updatedRecipe.preparationSteps = updatedSteps;
    this.setState({ recipe: updatedRecipe });
  };

  handleChangeTags = (event: any) => {
    const selected = [...event.target.options].filter((o) => o.selected).map((o) => o.value);

    this.setState((prevState) => ({
      recipe: { ...prevState.recipe, tags: selected },
    }));
  };

  handleSubmit = (event: any) => {
    console.log("Form was submitted");

    //TODO: prune empty recipeIngredients and empty preparationSteps

    event.preventDefault();
  };

  componentDidMount() {
    // get list of ingredients
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
        });
      });

    // get list of tags
    fetch("http://localhost:19061/v1/tags")
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: { data: TagOutputDto[] }) => {
        this.setState({
          tags: jsonRes.data,
        });
      });
  }

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
                    placeholder="quantidade"
                    value={recipeIngredient.quantity}
                    onChange={(event) => {
                      this.handleChangeIngredient(event, index);
                    }}
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center justify-content-center">de</div>
                <div className="col-sm-4">
                  <select
                    className="form-select"
                    id={`ingredient.ingredient-${index}`}
                    name={`ingredient`}
                    key={index}
                    value={recipeIngredient.ingredient}
                    onChange={(event) => {
                      this.handleChangeIngredient(event, index);
                    }}
                  >
                    <option>Seleccione o Ingrediente</option>
                    {this.state.ingredients.map((ingredient) => (
                      <option value={ingredient.id}>{ingredient.name}</option>
                    ))}
                    <option value={-1} style={{ backgroundColor: "lightblue" }}>
                      Criar novo Ingrediente...
                    </option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <input
                    type="text"
                    className="form-control"
                    id={`ingredient.specification-${index}`}
                    name={`specification`}
                    placeholder="detalhes (opcional)"
                    key={index}
                    value={recipeIngredient.specification}
                    onChange={(event) => {
                      this.handleChangeIngredient(event, index);
                    }}
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
                    onChange={(event) => {
                      this.handleChangePreparationStep(event, index);
                    }}
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
            <select
              multiple
              size={4}
              className="form-select"
              id="tags"
              name="tags"
              value={recipe.tags}
              onChange={this.handleChangeTags}
            >
              {this.state.tags.map((tag) => (
                <option value={tag.id}>{tag.name}</option>
              ))}
              <option value={-1} style={{ backgroundColor: "lightblue" }}>
                Criar nova Etiqueta...
              </option>
            </select>
            <small>
              Para seleccionar várias Etiquetas, mantenha a tecla <strong>Ctrl</strong> carregada
              antes de seleccionar cada Etiqueta.
            </small>
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
