import React, { Component, Fragment } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  IngredientOutputDto,
  RecipeIngredientInputDto,
  RecipeInputDto,
  RecipeOutputDto,
  TagOutputDto,
} from "../types/dtos.type";
import "./EditRecipe.css";
import { NumberInput } from "./form-components/NumberInput";
import { PreparationStepsInput } from "./form-components/PreparationStepsInput";
import { RecipeIngredientsInput } from "./form-components/RecipeIngredientsInput";
import { TagsSelect } from "./form-components/TagsSelect";
import { TextAreaInput } from "./form-components/TextAreaInput";
import { TextInput } from "./form-components/TextInput";
import { Alert, Props as AlertProps } from "./ui-components/alert";

interface Params {
  id: string;
}

interface ComponentProps {
  jwt?: string;
}

export interface RouteProps extends RouteComponentProps<Params> {}

interface Props extends RouteProps, ComponentProps {}

interface State {
  recipe: RecipeInputDto;
  ingredients: IngredientOutputDto[];
  tags: TagOutputDto[];
  isLoaded: boolean;
  error: string;
  errors: string[];
  alert: AlertProps;
}

export class EditRecipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      recipe: {
        title: "",
        portions: undefined,
        tagIds: [],
        description: "",
        cookingTime: undefined,
        preparationTime: undefined,
        ingredients: [newRecipeIngredient()],
        preparationSteps: [""],
      },
      ingredients: [],
      tags: [],
      isLoaded: false,
      error: "",
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      },
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
      (recipeIngredient) => !recipeIngredient.quantity || !recipeIngredient.ingredientId
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
      recipe: { ...prevState.recipe, tagIds: selected },
    }));
  };

  isInputValid = () => {
    // client side validation
    // TODO: do the same for other inputs
    const errors = [];
    if (this.state.recipe.title === "") {
      errors.push("title");
    }

    this.setState({ errors });

    return errors.length === 0;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();

    if (!this.isInputValid()) {
      return false;
    }

    const id = this.props.match.params.id;
    const method = id === "0" ? "POST" : "PATCH";
    const baseUrl = "http://localhost:19061/v1/recipes";
    const url = id === "0" ? baseUrl : `${baseUrl}/${id}`;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.props.jwt);

    const requestOptions = {
      method,
      headers,
      body: JSON.stringify(this.state.recipe, (key, value) => {
        if (key === "quantity") {
          return `${value}`;
        }

        return isNaN(value) ? value : +value;
      }),
    };

    //TODO: prune empty recipeIngredients and empty preparationSteps

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.props.history.push({ pathname: "/admin" });
        }
      });
  };

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  getIngredients() {
    // get list of ingredients
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/ingredients", { headers })
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
  }

  getTags() {
    // get list of tags
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/tags", { headers })
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

  getRecipe(id: string) {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes/" + id, { headers })
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: RecipeOutputDto) => {
        this.setState({
          recipe: {
            ...jsonRes,
            tagIds: jsonRes.tags.map((tag) => tag.id),
            ingredients: jsonRes.ingredients.map((recipeIngredient) => ({
              quantity: recipeIngredient.quantity,
              ingredientId: recipeIngredient.ingredient.id,
              specification: recipeIngredient.specification,
            })),
          },
          isLoaded: true,
        });
      });
  }

  componentDidMount() {
    this.getIngredients();
    this.getTags();

    const id = this.props.match.params.id;
    if (id !== "0") {
      this.getRecipe(id);
    } else {
      this.setState({ isLoaded: true });
    }
  }

  render() {
    const { recipe, tags, ingredients, isLoaded, error, alert } = this.state;

    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    }

    return (
      <Fragment>
        <h2>Adicionar/Editar Receita</h2>
        <hr />

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" id="id" value={recipe.id} onChange={this.handleChange} />

          <TextInput
            type="text"
            title="Título"
            name="title"
            value={recipe.title}
            onChange={this.handleChange}
            hasError={this.hasError("title")}
            errorMessage="Por favor insira um título"
          />
          <TextAreaInput
            title="Descrição"
            name="description"
            value={recipe.description}
            onChange={this.handleChange}
          />
          <RecipeIngredientsInput
            recipeIngredients={recipe.ingredients}
            options={ingredients}
            onAddIngredient={this.handleAddIngredient}
            onChangeIngredient={this.handleChangeIngredient}
            onRemoveIngredient={this.handleRemoveIngredient}
          />
          <PreparationStepsInput
            steps={recipe.preparationSteps}
            onAddStep={this.handleAddPreparationStep}
            onChangeStep={this.handleChangePreparationStep}
            onRemoveStep={this.handleRemovePreparationStep}
          />
          <NumberInput
            title="Tempo de Preparação"
            name="preparationTime"
            value={recipe.preparationTime}
            min={0}
            max={60}
            onChange={this.handleChange}
          />
          <NumberInput
            title="Tempo de Cozedura"
            name="cookingTime"
            value={recipe.cookingTime}
            min={0}
            max={1000}
            onChange={this.handleChange}
          />
          <NumberInput
            title="Porções"
            name="portions"
            value={recipe.portions}
            min={0}
            max={20}
            onChange={this.handleChange}
          />
          <TagsSelect value={recipe.tagIds} onChange={this.handleChangeTags} options={tags} />

          <hr />

          <div className="d-flex justify-content-center mb-5">
            <button className="btn btn-primary">Guardar</button>
            <Link to={`/recipe/${recipe.id}`} className="btn btn-warning ms-2">
              Cancelar
            </Link>
          </div>
        </form>

        {/* <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div> */}
      </Fragment>
    );
  }
}

const newRecipeIngredient = (): RecipeIngredientInputDto => {
  return {
    ingredientId: "",
    quantity: "",
  };
};

export default EditRecipe;
