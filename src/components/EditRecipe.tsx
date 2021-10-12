import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
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
import Alert from "./ui-components/alert";

interface Props {
  id: string;
}

type AlertState = {
  type: "alert-success" | "alert-danger" | "d-none";
  message: string;
}

interface State {
  recipe: RecipeInputDto;
  ingredients: IngredientOutputDto[];
  tags: TagOutputDto[];
  isLoaded: boolean;
  error: string;
  errors: string[];
  alert: AlertState
}

const newRecipeIngredient = (): RecipeIngredientInputDto => {
  return {
    ingredient: "",
    quantity: "",
    specification: "",
  };
};

export class EditRecipe extends Component<RouteComponentProps<Props>, State> {
  constructor(props: RouteComponentProps<Props>) {
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
        message: ""
      }
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
    event.preventDefault();

    // client side validation
    const errors = [];
    if (this.state.recipe.title === "") {
      errors.push("title");
    }

    this.setState({ errors });

    if (errors.length > 0) {
      return false;
    }

    const id = this.props.match.params.id;
    const method = id === "0" ? "POST" : "PATCH";
    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.recipe, (key, value) => (isNaN(value) ? value : +value)),
    };

    console.log(requestOptions.body);

    //TODO: prune empty recipeIngredients and empty preparationSteps

    // FIXME: only POST for now
    fetch("http://localhost:19061/v1/recipes", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error){
          this.setState({alert: {type: "alert-danger", message: data.message}})
        } else {
          this.setState({alert: {type: "alert-success", message: "Receita guardada!"}})
        }
      });
  };

  // TODO: add form validation to all input fields
  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

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

    const id = this.props.match.params.id;
    if (id !== "0") {
      fetch("http://localhost:19061/v1/recipes/" + this.props.match.params.id)
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
              tags: jsonRes.tags.map((tag) => tag.id),
              ingredients: jsonRes.ingredients.map((recipeIngredient) => ({
                quantity: recipeIngredient.quantity,
                ingredient: recipeIngredient.ingredient.id,
                specification: recipeIngredient.specification,
              })),
            },
            isLoaded: true,
          });
        });
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

        <Alert type={alert.type} message={alert.message}/>

        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" id="id" value={recipe.id} onChange={this.handleChange} />

          <TextInput
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
          <TagsSelect value={recipe.tags} onChange={this.handleChangeTags} options={tags} />

          <hr />

          <button className="btn btn-primary">Guardar</button>
        </form>
{/*
        <div className="mt-3">
          <pre>{JSON.stringify(this.state, null, 3)}</pre>
</div> */}
      </Fragment>
    );
  }
}

export default EditRecipe;
