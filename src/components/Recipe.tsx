import React, { Component, Fragment } from "react";
import { confirmAlert } from "react-confirm-alert";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { RecipeOutputDto } from "../types/dtos.type";
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
  recipe: RecipeOutputDto;
  isLoaded: boolean;
  error: string;
  alert: AlertProps;
}

export class Recipe extends Component<Props, State> {
  state: State = {
    recipe: {
      id: "",
      title: "",
      portions: 0,
      tags: [],
      description: "",
      cookingTime: 0,
      preparationTime: 0,
      ingredients: [],
      preparationSteps: [],
      user: "",
    },
    isLoaded: false,
    error: "",
    alert: {
      type: "d-none",
      message: "",
    },
  };

  componentDidMount() {
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + this.props.jwt);

    fetch("http://localhost:19061/v1/recipes/" + this.props.match.params.id, { headers })
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ error: "Invalid response code: " + response.status });
        }
        return response.json();
      })
      .then((jsonRes: RecipeOutputDto) => {
        this.setState({
          recipe: jsonRes,
          isLoaded: true,
        });
      });
  }

  deleteRecipe(id: string) {
    fetch("http://localhost:19061/v1/recipes/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({ alert: { type: "alert-danger", message: data.message } });
        } else {
          this.props.history.push({ pathname: "/admin" });
        }
      });
  }

  confirmDelete = () => {
    confirmAlert({
      title: "Eliminar Receita?",
      message: "Tem a certeza?",
      buttons: [
        {
          label: "Sim",
          onClick: () => {
            this.deleteRecipe(this.state.recipe.id);
          },
        },
        {
          label: "Não",
          onClick: () => {},
        },
      ],
    });
  };

  render() {
    const { recipe, isLoaded, error, alert } = this.state;

    if (error) {
      return <div>Erro: {error}</div>;
    } else if (!isLoaded) {
      return <p>Carregando...</p>;
    } else {
      return (
        <Fragment>
          <h2>{recipe.title}</h2>

          <div className="float-start">
            <small>{recipe.portions} porções</small>
          </div>
          <div className="float-end">
            {recipe.tags.map((tag, index) => (
              <span className="badge bg-secondary me-1" key={index}>
                {tag.name}
              </span>
            ))}
          </div>
          <div className="clearfix"></div>
          <hr />

          <Alert type={alert.type} message={alert.message} />

          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              <tr>
                <td>
                  <strong>Descrição</strong>
                </td>
                <td>{recipe.description}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tempo de preparação</strong>
                </td>
                <td>{recipe.preparationTime}</td>
              </tr>
              <tr>
                <td>
                  <strong>Tempo de cozedura</strong>
                </td>
                <td>{recipe.cookingTime}</td>
              </tr>
            </tbody>
          </table>

          <h3>Ingredientes</h3>
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              {recipe.ingredients.map((recipeIngredient, index) => (
                <tr key={index}>
                  <td>
                    {recipeIngredient.quantity} de{" "}
                    <strong>{recipeIngredient.ingredient.name}</strong>{" "}
                    {recipeIngredient.specification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Preparação</h3>
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              {recipe.preparationSteps.map((step, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{step}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          <div className="d-flex justify-content-center mb-5">
            <button className="btn btn-primary">Imprimir</button>
            <Link to={`/recipe/edit/${recipe.id}`} className="btn btn-warning ms-2">
              Editar
            </Link>
            <a href="#!" onClick={() => this.confirmDelete()} className="btn btn-danger ms-2">
              Eliminar
            </a>
          </div>
        </Fragment>
      );
    }
  }
}

export default Recipe;
