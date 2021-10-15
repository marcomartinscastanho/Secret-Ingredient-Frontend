import React, { Component, Fragment } from "react";
import "react-confirm-alert/src/react-confirm-alert.css";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import {
  IngredientOutputDto,
  RecipeIngredientInputDto,
  RecipeInputDto,
  RecipeOutputDto,
  RestError,
  TagOption,
  TagOutputDto,
} from "../types/dtos.type";
import "./EditRecipe.css";
import { TextInputModal } from "./form-components/TextInputModal";
import { NumberInput } from "./form-components/NumberInput";
import { PreparationStepsInput } from "./form-components/PreparationStepsInput";
import { RecipeIngredientsInput } from "./form-components/RecipeIngredientsInput";
import { TagsSelect } from "./form-components/TagsSelect";
import { TextAreaInput } from "./form-components/TextAreaInput";
import { TextInput } from "./form-components/TextInput";
import { Alert, Props as AlertProps } from "./ui-components/alert";
import { ActionMeta, OnChangeValue } from "react-select";

interface Params {
  id: string;
}

interface ComponentProps {
  jwt?: string;
}

export interface RouteProps extends RouteComponentProps<Params> {}

interface Props extends RouteProps, ComponentProps {}

interface NewIngredientState {
  show: boolean;
  name: string;
  index: number;
}

interface RecipeState {
  id?: string;

  title: string;

  portions?: number;

  tags: TagOption[];

  description: string;

  preparationTime?: number;

  cookingTime?: number;

  ingredients: RecipeIngredientInputDto[];

  preparationSteps: string[];

  user?: string;
}

interface State {
  recipe: RecipeState;
  ingredients: IngredientOutputDto[];
  tags: TagOutputDto[];
  isLoaded: boolean;
  error: string;
  errors: string[];
  alert: AlertProps;
  newIngredient: NewIngredientState;
}

export class EditRecipe extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      recipe: {
        title: "",
        portions: undefined,
        tags: [],
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
      newIngredient: { show: false, name: "", index: -1 },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIngredient = this.handleChangeIngredient.bind(this);
    this.showNewIngredientModal = this.showNewIngredientModal.bind(this);
    this.hideNewIngredientModal = this.hideNewIngredientModal.bind(this);
    this.handleChangeNewIngredientName = this.handleChangeNewIngredientName.bind(this);
    this.handleCreateNewIngredient = this.handleCreateNewIngredient.bind(this);
    this.handleChangePreparationStep = this.handleChangePreparationStep.bind(this);
    this.handleChangeTags = this.handleChangeTags.bind(this);
    this.handleCreateTag = this.handleCreateTag.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
            tags: jsonRes.tags.map((tag) => ({ value: tag.id, label: tag.name })),
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

  postRecipe = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.props.jwt);

    const body: RecipeInputDto = {
      ...this.state.recipe,
      tagIds: this.state.recipe.tags.map((tag) => tag.value),
      ingredients: this.state.recipe.ingredients.filter(
        (ingredient) =>
          ingredient.quantity !== "" ||
          ingredient.ingredientId !== "" ||
          (ingredient.specification !== undefined && ingredient.specification !== "")
      ),
      preparationSteps: this.state.recipe.preparationSteps.filter((step) => step !== ""),
    };

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(body, (key, value) => {
        if (key === "quantity") {
          return `${value}`;
        }

        return isNaN(value) ? value : +value;
      }),
    };

    fetch("http://localhost:19061/v1/recipes", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.props.history.push({ pathname: "/recipes" });
        }
      });
  };

  patchRecipe = (id: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.props.jwt);

    const body: RecipeInputDto = {
      ...this.state.recipe,
      tagIds: this.state.recipe.tags.map((tag) => tag.value),
      ingredients: this.state.recipe.ingredients.filter(
        (ingredient) =>
          ingredient.quantity !== "" ||
          ingredient.ingredientId !== "" ||
          (ingredient.specification !== undefined && ingredient.specification !== "")
      ),
      preparationSteps: this.state.recipe.preparationSteps.filter((step) => step !== ""),
    };

    const requestOptions = {
      method: "PATCH",
      headers,
      body: JSON.stringify(body, (key, value) => {
        if (key === "quantity") {
          return `${value}`;
        }

        return isNaN(value) ? value : +value;
      }),
    };

    fetch(`http://localhost:19061/v1/recipes/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.props.history.push({ pathname: "/recipes" });
        }
      });
  };

  handleChange = (event: any) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      recipe: { ...prevState.recipe, [name]: value },
    }));
  };

  handleChangeIngredient = (event: any, index: number) => {
    const { name, value } = event.target;

    const updatedRecipe = { ...this.state.recipe };
    const updatedIngredients = [...updatedRecipe.ingredients];
    const updatedIngredient = updatedIngredients[index];
    updatedIngredients[index] = { ...updatedIngredient, [name]: value };

    // if all ingredient rows are filled, add a new row at the end
    if (
      updatedIngredients.every((recipeIngredient) => {
        return recipeIngredient.quantity !== "" && recipeIngredient.ingredientId !== "";
      })
    ) {
      updatedIngredients.push(newRecipeIngredient());
    }

    // prune consecutive empty rows
    updatedRecipe.ingredients = updatedIngredients.filter((currentIngredient, i, arr) => {
      // Always keep the 0th element as there is nothing before it
      if (i === 0) {
        return true;
      }
      const previousIngredient = arr[i - 1];
      // Then check if both the current element and the one before are empty
      return (
        currentIngredient.quantity !== "" ||
        currentIngredient.ingredientId !== "" ||
        currentIngredient.specification ||
        previousIngredient.quantity !== "" ||
        previousIngredient.ingredientId !== "" ||
        previousIngredient.specification
      );
    });

    let prevIngredient: RecipeIngredientInputDto | undefined = undefined;
    for (const recipeIngredient of updatedIngredients) {
      if (prevIngredient === undefined) {
        prevIngredient = recipeIngredient;
        continue;
      }
    }

    this.setState({ recipe: updatedRecipe });
  };

  showNewIngredientModal = (index: number) => {
    this.setState({ newIngredient: { show: true, name: "", index } });
  };

  hideNewIngredientModal = () => {
    this.setState({ newIngredient: { show: false, name: "", index: -1 } });
  };

  handleChangeNewIngredientName = (event: any) => {
    this.setState((prevState) => ({
      newIngredient: { ...prevState.newIngredient, name: event.target.value },
    }));
  };

  handleCreateNewIngredient = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.props.jwt);

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify({ name: this.state.newIngredient.name }),
    };

    fetch("http://localhost:19061/v1/ingredients", requestOptions)
      .then((response) => response.json())
      .then((data: IngredientOutputDto & RestError) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
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
            })
            .then(() => {
              const { index } = this.state.newIngredient;
              const updatedRecipe = { ...this.state.recipe };
              const updatedIngredients = [...updatedRecipe.ingredients];
              const updatedIngredient = updatedIngredients[index];
              updatedIngredients[index] = { ...updatedIngredient, ingredientId: data.id };
              updatedRecipe.ingredients = updatedIngredients;
              this.setState({ recipe: updatedRecipe });
            })
            .then(() => {
              this.hideNewIngredientModal();
            });
        }
      });
  };

  handleChangePreparationStep = (event: any, index: number) => {
    const updatedRecipe = { ...this.state.recipe };
    const updatedSteps = [...updatedRecipe.preparationSteps];
    updatedSteps[index] = event.target.value;

    // if all preparation steps are filled, add a new row at the end
    if (updatedSteps.every((step) => step !== "")) {
      updatedSteps.push("");
    }

    // prune consecutive empty rows
    updatedRecipe.preparationSteps = updatedSteps.filter((currentStep, i, arr) => {
      // Always keep the 0th element as there is nothing before it
      if (i === 0) {
        return true;
      }
      const previousStep = arr[i - 1];
      // Then check if both the current element and the one before are empty
      return currentStep !== "" || previousStep !== "";
    });

    this.setState({ recipe: updatedRecipe });
  };

  handleChangeTags = (
    newValue: OnChangeValue<TagOption, true>,
    actionMeta: ActionMeta<TagOption>
  ) => {
    this.setState((prevState) => ({
      recipe: {
        ...prevState.recipe,
        tags: newValue.map((v) => ({ value: v.value, label: v.label })),
      },
    }));
  };

  handleCreateTag = (newTag: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.props.jwt);

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify({ name: newTag }),
    };

    fetch("http://localhost:19061/v1/tags", requestOptions)
      .then((response) => response.json())
      .then((data: TagOutputDto & RestError) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          // update list of tags
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
            })
            .then(() => {
              const updatedRecipe = { ...this.state.recipe };
              const updatedTags = [...updatedRecipe.tags];
              updatedTags.push({ value: data.id, label: data.name });
              updatedRecipe.tags = updatedTags;
              this.setState({ recipe: updatedRecipe });
            });
        }
      });
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

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleSubmit = (event: any) => {
    event.preventDefault();
    const { id } = this.props.match.params;

    if (!this.isInputValid()) {
      return false;
    }

    if (id === "0") {
      this.postRecipe();
    } else {
      this.patchRecipe(id);
    }
  };

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
            onChangeIngredient={this.handleChangeIngredient}
            onCreateNewIngredient={this.showNewIngredientModal}
          />
          <PreparationStepsInput
            steps={recipe.preparationSteps}
            onChangeStep={this.handleChangePreparationStep}
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
          <TagsSelect
            value={recipe.tags}
            handleChange={this.handleChangeTags}
            handleCreateOption={this.handleCreateTag}
            options={tags}
          />

          <hr />

          <div className="d-flex justify-content-center mb-5">
            <button className="btn btn-primary">Guardar</button>
            <Link
              to={recipe.id ? `/recipe/${recipe.id}` : "/recipes"}
              className="btn btn-secondary ms-2"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {/* Modals */}
        {/* New Ingredient Modal */}
        <TextInputModal
          show={this.state.newIngredient.show}
          title="Criar novo Ingrediente"
          id="new-ingredient"
          name="newIngredient"
          placeholder="Nome do novo ingrediente"
          value={this.state.newIngredient.name}
          handleSave={this.handleCreateNewIngredient}
          handleChange={this.handleChangeNewIngredientName}
          handleCancel={this.hideNewIngredientModal}
        />

        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
        </div>
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
